/* =====================================================================
   श्री महा माया — ENQUIRY BACKEND (zero-dependency Node.js)
   ---------------------------------------------------------------------
   Run:  OWNER_PASSWORD="strong-password" node server/server.js
   Env:  PORT (default 8787) · OWNER_PASSWORD (required) ·
         DATA_DIR (default ./data) · ALLOWED_ORIGIN (e.g. https://shreemahamayahotelpallu.netlify.app)
   Endpoints:
     GET  /api/health
     POST /api/enquiries            {name, phone, type, details, lang, source}  (public, rate-limited)
     POST /api/auth/login           {password}  -> {token}
     GET  /api/enquiries?status=    Bearer token
     PATCH /api/enquiries/:id       Bearer token {status: pending|contacted|closed}
     GET  /api/stats                Bearer token
     GET  /api/availability         (public) aaj ki vacancy counts
     POST /api/availability         Bearer token YA X-Sync-Token (env AVAILABILITY_TOKEN; billing-app push)
                                    {vacant:{standard,deluxe,family}, source?, note?}
     GET  /admin/                   dashboard (login inside)
   Security: hashed password compare (timing-safe), HMAC session tokens
   (12h), body cap 10KB, per-IP rate limit, security headers, no deps.
   ===================================================================== */
"use strict";
const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 8787);
const OWNER_PASSWORD = process.env.OWNER_PASSWORD || "";
const DATA_DIR = path.resolve(process.env.DATA_DIR || path.join(__dirname, "data"));
const ALLOWED_ORIGIN = process.env.ALLOWED_ORIGIN || "";
const ADMIN_DIR = path.join(__dirname, "admin");
const DB = path.join(DATA_DIR, "enquiries.json");
const AV = path.join(DATA_DIR, "availability.json");   // aaj ki vacancy (dashboard ya billing-app adapter se)
const TOKEN_TTL = 12 * 60 * 60 * 1000;

if (!OWNER_PASSWORD) { console.error("FATAL: set OWNER_PASSWORD env variable."); process.exit(1); }
if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DB)) fs.writeFileSync(DB, "[]");

/* ---------- helpers ---------- */
const sha = (s) => crypto.createHash("sha256").update(s).digest("hex");
const PASS_HASH = sha(OWNER_PASSWORD);
const sign = (payload) => {
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto.createHmac("sha256", PASS_HASH).update(body).digest("base64url");
  return body + "." + sig;
};
const verify = (token) => {
  try {
    const [body, sig] = String(token).split(".");
    const expect = crypto.createHmac("sha256", PASS_HASH).update(body).digest("base64url");
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expect))) return null;
    const p = JSON.parse(Buffer.from(body, "base64url").toString());
    return p.exp > Date.now() ? p : null;
  } catch { return null; }
};
const readDB = () => { try { return JSON.parse(fs.readFileSync(DB, "utf8")); } catch { return []; } };
const readAV = () => { try { return JSON.parse(fs.readFileSync(AV, "utf8")); } catch { return null; } };
const writeAV = (obj) => {
  const tmp = AV + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(obj, null, 2));
  fs.renameSync(tmp, AV);
};
const writeDB = (rows) => {   // atomic write
  const tmp = DB + ".tmp";
  fs.writeFileSync(tmp, JSON.stringify(rows, null, 2));
  fs.renameSync(tmp, DB);
};
const send = (res, code, obj, extra) => {
  const body = JSON.stringify(obj);
  res.writeHead(code, Object.assign({
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "X-Content-Type-Options": "nosniff",
    "Cache-Control": "no-store",
  }, extra || {}));
  res.end(body);
};
const cors = (res) => {
  if (ALLOWED_ORIGIN) { res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGIN); }
  res.setHeader("Vary", "Origin");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, OPTIONS");
};
/* simple in-memory rate limit: 6 enquiries / 10 min per IP */
const hits = new Map();
setInterval(() => { const now = Date.now(); for (const [k, v] of hits) if (now - v.t > 600000) hits.delete(k); }, 60000);
const limited = (ip) => {
  const now = Date.now(), h = hits.get(ip) || { n: 0, t: now };
  if (now - h.t > 600000) { h.n = 0; h.t = now; }
  h.n++; hits.set(ip, h);
  return h.n > 6;
};
const readBody = (req) => new Promise((resolve, reject) => {
  let size = 0; const chunks = [];
  let killed = false;
  req.on("data", (c) => { size += c.length; if (size > 10240) { if (!killed) { killed = true; reject(new Error("too-large")); } } else if (!killed) chunks.push(c); });
  req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
  req.on("error", reject);
});
const ipOf = (req) => (req.headers["x-forwarded-for"] || "").split(",")[0].trim() || req.socket.remoteAddress || "?";
async function jsonBody(req) {
  let raw;
  try { raw = await readBody(req); } catch (e) { return { tooLarge: true }; }
  try { return { json: JSON.parse(raw) }; } catch (e) { return { bad: true }; }
}

/* ---------- validation ---------- */
const VALID_TYPES = ["room", "food", "general", "complaint"];
function validateEnquiry(b) {
  const e = {};
  const name = String(b.name || "").trim(), phone = String(b.phone || "").trim();
  const details = String(b.details || "").trim();
  if (name.length < 2 || name.length > 60) e.name = "invalid";
  if (!/^[6-9]\d{9}$/.test(phone.replace(/\D/g, "").slice(-10)) && phone !== "-") e.phone = "invalid";
  if (!VALID_TYPES.includes(b.type)) e.type = "invalid";
  if (details.length > 1000) e.details = "too-long";
  return { ok: Object.keys(e).length === 0, errors: e, clean: { name, phone, type: b.type, details, lang: b.lang === "hi" ? "hi" : "en", source: String(b.source || "web").slice(0, 40) } };
}

/* ---------- server ---------- */
const server = http.createServer(async (req, res) => {
  cors(res);
  if (req.method === "OPTIONS") { res.writeHead(204); return res.end(); }
  const url = new URL(req.url, "http://x");
  const p = url.pathname;

  try {
    /* --- health --- */
    if (p === "/api/health" && req.method === "GET") return send(res, 200, { ok: true, service: "smm-enquiries", time: new Date().toISOString() });

    /* --- public: aaj ki vacancy (Maya isi se batati hai; sirf counts, koi guest data nahi) --- */
    if (p === "/api/availability" && req.method === "GET") {
      return send(res, 200, { ok: true, availability: readAV() });
    }

    /* --- public: create enquiry --- */
    if (p === "/api/enquiries" && req.method === "POST") {
      if (limited(ipOf(req))) return send(res, 429, { ok: false, error: "too-many-requests", retryAfterSec: 600 });
      const jb = await jsonBody(req);
      if (jb.tooLarge) return send(res, 413, { ok: false, error: "payload-too-large" });
      if (jb.bad) return send(res, 400, { ok: false, error: "bad-json" });
      const v = validateEnquiry(jb.json);
      if (!v.ok) return send(res, 400, { ok: false, error: "validation", fields: v.errors });
      const rows = readDB();
      const row = Object.assign({ id: crypto.randomUUID(), created: new Date().toISOString(), status: "pending", ip: sha(ipOf(req)).slice(0, 12) }, v.clean);
      rows.push(row); writeDB(rows);
      return send(res, 201, { ok: true, id: row.id, status: row.status, note: "Enquiry received. Booking/order is confirmed ONLY after hotel staff confirms." });
    }

    /* --- auth --- */
    if (p === "/api/auth/login" && req.method === "POST") {
      const jb = await jsonBody(req);
      if (jb.tooLarge) return send(res, 413, { ok: false, error: "payload-too-large" });
      if (jb.bad) return send(res, 400, { ok: false, error: "bad-json" });
      const given = sha(String(jb.json.password || ""));
      if (!crypto.timingSafeEqual(Buffer.from(given), Buffer.from(PASS_HASH))) return send(res, 401, { ok: false, error: "wrong-password" });
      const token = sign({ role: "owner", exp: Date.now() + TOKEN_TTL });
      return send(res, 200, { ok: true, token }, {
        "Set-Cookie": `smm_token=${token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${TOKEN_TTL / 1000}`,
      });
    }

    if (p === "/api/auth/logout" && req.method === "POST") {
      return send(res, 200, { ok: true }, { "Set-Cookie": "smm_token=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0" });
    }

    /* --- owner-only --- */
    /* token: header > query param > cookie (preview proxies kabhi header strip karti hain) */
    const cookieToken = (() => { const m = (req.headers.cookie || "").match(/smm_token=([^;]+)/); return m ? decodeURIComponent(m[1]) : ""; })();
    const auth = (req.headers.authorization || "").replace(/^Bearer\s+/i, "") || url.searchParams.get("token") || cookieToken;
    const session = verify(auth);
    const syncOk = !!process.env.AVAILABILITY_TOKEN &&
      (req.headers["x-sync-token"] || "") === process.env.AVAILABILITY_TOKEN &&
      p === "/api/availability" && req.method !== "GET";
    const needAuth = ((p.startsWith("/api/enquiries") && req.method !== "POST") || p === "/api/stats" ||
      (p === "/api/availability" && req.method !== "GET")) && !syncOk;
    if (needAuth && !session) return send(res, 401, { ok: false, error: "login-required" });

    if (p === "/api/enquiries" && req.method === "GET") {
      let rows = readDB().reverse();
      const st = url.searchParams.get("status");
      if (st) rows = rows.filter((r) => r.status === st);
      return send(res, 200, { ok: true, count: rows.length, enquiries: rows.map((r) => Object.assign({}, r, { ip: undefined })) });
    }
    const m = p.match(/^\/api\/enquiries\/([\w-]+)$/);
    if (m && req.method === "PATCH") {
      const jb = await jsonBody(req);
      if (jb.tooLarge) return send(res, 413, { ok: false, error: "payload-too-large" });
      if (jb.bad) return send(res, 400, { ok: false, error: "bad-json" });
      if (!["pending", "contacted", "closed"].includes(jb.json.status)) return send(res, 400, { ok: false, error: "bad-status" });
      const rows = readDB(); const row = rows.find((r) => r.id === m[1]);
      if (!row) return send(res, 404, { ok: false, error: "not-found" });
      row.status = jb.json.status; row.updated = new Date().toISOString(); writeDB(rows);
      return send(res, 200, { ok: true, id: row.id, status: row.status });
    }
    if (p === "/api/availability" && (req.method === "POST" || req.method === "PUT")) {
      const jb = await jsonBody(req);
      if (jb.tooLarge) return send(res, 413, { ok: false, error: "payload-too-large" });
      if (jb.bad) return send(res, 400, { ok: false, error: "bad-json" });
      const v = (jb.json || {}).vacant || {};
      const clean = {};
      for (const k of ["standard", "deluxe", "family"]) {
        const n = Number(v[k]);
        if (!Number.isInteger(n) || n < 0 || n > 10) return send(res, 400, { ok: false, error: "bad-vacant", field: k });
        clean[k] = n;
      }
      const rec = {
        updatedAt: new Date().toISOString(),
        source: String((jb.json || {}).source || "manual").slice(0, 40),
        vacant: clean,
        note: String((jb.json || {}).note || "").slice(0, 200),
      };
      writeAV(rec);
      return send(res, 200, { ok: true, availability: rec });
    }
    if (p === "/api/stats" && req.method === "GET") {
      const rows = readDB();
      const by = (k) => rows.reduce((a, r) => (a[r[k]] = (a[r[k]] || 0) + 1, a), {});
      return send(res, 200, { ok: true, total: rows.length, byStatus: by("status"), byType: by("type") });
    }

    /* --- friendly roots: backend URL khole to seedha dashboard --- */
    if (req.method === "GET" && (p === "/" || p === "" )) {
      res.writeHead(302, { Location: "/admin/" });
      return res.end();
    }
    if (req.method === "GET" && p === "/admin") {
      res.writeHead(302, { Location: "/admin/" });
      return res.end();
    }

    /* --- admin dashboard static --- */
    if (p === "/admin/" || p === "/admin/index.html") {
      const f = path.join(ADMIN_DIR, "index.html");
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8", "X-Frame-Options": "DENY", "Cache-Control": "no-store" });
      return res.end(fs.readFileSync(f));
    }
    if (p === "/admin/admin.js") {
      res.writeHead(200, { "Content-Type": "text/javascript; charset=utf-8", "Cache-Control": "no-store" });
      return res.end(fs.readFileSync(path.join(ADMIN_DIR, "admin.js")));
    }

    if (req.method === "GET" && !p.startsWith("/api/")) {
      const html = "<!doctype html><meta charset=utf-8><title>Shri Maha Maya Backend</title>" +
        "<body style='font:15px/1.7 system-ui,sans-serif;background:#FAF6EC;color:#241a1e;display:grid;place-items:center;min-height:90vh;margin:0'>" +
        "<div style='text-align:center;max-width:34rem;padding:24px'><h1 style='font-size:1.3rem'>श्री महा माया — Enquiry Backend</h1>" +
        "<p>Ye server sirf enquiries save karta hai. Owner dashboard yahan hai:</p>" +
        "<p><a style='background:#5E1628;color:#FAF6EC;padding:12px 22px;border-radius:999px;text-decoration:none' href='/admin/'>Open Owner Dashboard →</a></p>" +
        "<p style='opacity:.7;font-size:.85rem'>Developers: API docs — docs/SETUP-GUIDE.md</p></div></body>";
      res.writeHead(404, { "Content-Type": "text/html; charset=utf-8" });
      return res.end(html);
    }
    return send(res, 404, { ok: false, error: "not-found" });
  } catch (err) {
    return send(res, err.message === "too-large" ? 413 : 500, { ok: false, error: err.message === "too-large" ? "payload-too-large" : "server-error" });
  }
});

server.listen(PORT, "0.0.0.0", () => console.log(`✅ SMM enquiry backend on :${PORT} (admin at /admin/)`));
