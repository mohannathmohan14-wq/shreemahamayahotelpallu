/* Owner dashboard logic — token sessionStorage me, API calls Bearer ke saath */
(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);
  const api = ""; // same-origin: backend khud dashboard serve karta hai
  /* safe storage: sandboxed iframes / private mode me sessionStorage throw kar sakta hai */
  const mem = {};
  const store = {
    get(k) { try { return sessionStorage.getItem(k); } catch (e) { return mem[k] || null; } },
    set(k, v) { try { sessionStorage.setItem(k, v); } catch (e) { mem[k] = v; } },
    del(k) { try { sessionStorage.removeItem(k); } catch (e) { delete mem[k]; } },
  };
  let token = store.get("smm-token") || "";

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const fmtDate = (iso) => { try { return new Date(iso).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" }); } catch { return iso; } };

  async function call(path, opts) {
    const sep = path.includes("?") ? "&" : "?";
    const full = api + path + (token ? sep + "token=" + encodeURIComponent(token) : "");
    const res = await fetch(full, Object.assign({
      headers: Object.assign({ "Content-Type": "application/json" }, token ? { Authorization: "Bearer " + token } : {}),
    }, opts || {}));
    return { status: res.status, data: await res.json().catch(() => ({})) };
  }

  function showDash() {
    $("#loginbox").classList.add("hidden");
    $("#dash").classList.remove("hidden");
    $("#logout").classList.remove("hidden");
    $("#who").textContent = "· logged in";
    loadStats(); loadRows(); loadAv();
  }
  function showLogin(err) {
    token = ""; store.del("smm-token");
    $("#loginbox").classList.remove("hidden");
    $("#dash").classList.add("hidden");
    $("#logout").classList.add("hidden");
    $("#who").textContent = "";
    if (err) { $("#lerr").textContent = err; $("#lerr").classList.remove("hidden"); }
  }

  async function loadStats() {
    const r = await call("/api/stats");
    if (r.status === 401) return showLogin("Session khatam — dobara login karein.");
    const d = r.data, bs = d.byStatus || {}, bt = d.byType || {};
    $("#stats").innerHTML =
      `<div class="stat"><b>${d.total || 0}</b>Total</div>` +
      `<div class="stat"><b>${bs.pending || 0}</b>Pending</div>` +
      `<div class="stat"><b>${bs.contacted || 0}</b>Contacted</div>` +
      `<div class="stat"><b>${bt.room || 0}</b>Room enquiries</div>` +
      `<div class="stat"><b>${bt.food || 0}</b>Food orders</div>`;
  }

  async function loadAv() {
    const r = await call("/api/availability");
    const av = r.data && r.data.availability;
    if (av && av.vacant) {
      $("#av-standard").value = av.vacant.standard != null ? av.vacant.standard : 0;
      $("#av-deluxe").value = av.vacant.deluxe != null ? av.vacant.deluxe : 0;
      $("#av-family").value = av.vacant.family != null ? av.vacant.family : 0;
      $("#avwhen").textContent = av.updatedAt ? "· updated " + fmtDate(av.updatedAt) : "";
    } else { $("#avwhen").textContent = "· abhi set nahi"; }
  }
  async function saveAv() {
    const body = { vacant: {
      standard: Number($("#av-standard").value || 0),
      deluxe: Number($("#av-deluxe").value || 0),
      family: Number($("#av-family").value || 0),
    }, source: "dashboard" };
    const r = await call("/api/availability", { method: "POST", body: JSON.stringify(body) });
    if (r.status === 401) return showLogin("Session khatam — dobara login karein.");
    $("#avmsg").textContent = r.status === 200 ? "✅ Save ho gaya — Maya ab yahi batayegi." : "❌ Save nahi hua (" + r.status + ")";
    if (r.status === 200) loadAv();
  }

  async function loadRows() {
    const st = $("#filter").value;
    const r = await call("/api/enquiries" + (st ? "?status=" + st : ""));
    if (r.status === 401) return showLogin("Session khatam — dobara login karein.");
    const rows = r.data.enquiries || [];
    $("#count").textContent = "(" + rows.length + ")";
    $("#empty").textContent = rows.length ? "" : "Koi enquiry nahi mili.";
    $("#rows").innerHTML = rows.map((e) => `
      <tr>
        <td>${fmtDate(e.created)}</td>
        <td><span class="badge b-${esc(e.type)}">${esc(e.type)}</span></td>
        <td>${esc(e.name)}<br><a href="tel:+91${esc(e.phone)}">${esc(e.phone)}</a></td>
        <td><pre>${esc(e.details)}</pre><span class="muted">${esc(e.lang)} · ${esc(e.source)}</span></td>
        <td><span class="badge b-${esc(e.status)}">${esc(e.status)}</span></td>
        <td><div class="rowacts">
          <a class="wa" target="_blank" rel="noopener" href="https://wa.me/91${esc(e.phone)}?text=${encodeURIComponent("Namaste! Shri Maha Maya Hotel, Pallu se baat ho rahi hai — aapki enquiry ke baare me:")}">WhatsApp</a>
          ${e.status !== "contacted" ? `<button data-id="${esc(e.id)}" data-st="contacted">Mark contacted</button>` : ""}
          ${e.status !== "closed" ? `<button class="ghost" data-id="${esc(e.id)}" data-st="closed">Close</button>` : ""}
        </div></td>
      </tr>`).join("");
    $("#rows").querySelectorAll("button[data-id]").forEach((b) => b.onclick = async () => {
      await call("/api/enquiries/" + b.dataset.id, { method: "PATCH", body: JSON.stringify({ status: b.dataset.st }) });
      loadStats(); loadRows(); loadAv();
    });
  }

  $("#login").onclick = async () => {
    let r;
    try {
      r = await call("/api/auth/login", { method: "POST", body: JSON.stringify({ password: $("#pw").value }) });
    } catch (e) { showLogin("Server se connection nahi hua — page refresh karke dobara koshish karein."); return; }
    if (r.data.ok) { token = r.data.token; store.set("smm-token", token); $("#pw").value = ""; showDash(); }
    else showLogin("Galat password — dobara koshish karein.");
  };
  $("#pw").addEventListener("keydown", (e) => { if (e.key === "Enter") $("#login").click(); });
  $("#avsave").onclick = saveAv;
  $("#logout").onclick = async () => { try { await fetch(api + "/api/auth/logout", { method: "POST" }); } catch (e) {} showLogin(); };
  $("#refresh").onclick = () => { loadStats(); loadRows(); };
  $("#filter").onchange = loadRows;
  $("#csv").onclick = async () => {
    const r = await call("/api/enquiries");
    const rows = r.data.enquiries || [];
    const head = "created,type,name,phone,lang,status,details";
    const csv = [head].concat(rows.map((e) => [e.created, e.type, `"${e.name}"`, e.phone, e.lang, e.status, `"${String(e.details).replace(/"/g, '""')}"`].join(","))).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = "enquiries-" + new Date().toISOString().slice(0, 10) + ".csv";
    a.click();
  };

  /* session check on load */
  (async () => {
    if (!token) return showLogin();
    try {
      const r = await call("/api/stats");
      r.status === 200 ? showDash() : showLogin();
    } catch (e) { showLogin("Server se connection nahi hua — page refresh karein."); }
  })();
})();
