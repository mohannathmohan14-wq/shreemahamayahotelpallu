/* Chat agent ka regression + recommend-flow test:  node tools/agent-test.js  (project root se) */
const fs = require("fs"), vm = require("vm"), path = require("path");
const root = path.join(__dirname, "..");
const files = ["assets/js/knowledge.js", "assets/js/menu.js", "assets/js/agent.js"];
function makeEl() { return { children: [], innerHTML: "", textContent: "", value: "", hidden: false, className: "", style: {}, dataset: {},
  appendChild(c){this.children.push(c);return c;}, setAttribute(){}, getAttribute(){return null;}, addEventListener(){}, focus(){}, scrollTop:0, scrollHeight:0, querySelectorAll(){return [];} }; }
const ids = {};
const document = { documentElement: { lang: "en" }, body: makeEl(), createElement: () => makeEl(),
  getElementById: (id) => (ids[id] = ids[id] || makeEl()), addEventListener: () => {}, dispatchEvent: () => {} };
const sandbox = { window: {}, document, console, setTimeout: (fn) => { fn(); return 0; }, clearTimeout: () => {}, setInterval: () => 0,
  fetch: () => Promise.resolve({ ok: false, json: () => ({}) }), encodeURIComponent, decodeURIComponent, Date, Math, JSON, Buffer };
sandbox.window = sandbox; vm.createContext(sandbox);
for (const f of files) vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), sandbox, { filename: f });
const msgs = ids["agent-msgs"];
const dump = () => msgs.children.map((c) => c.innerHTML).join(" | ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const ask = (q, d) => { msgs.children.length = 0; sandbox.SMM_AGENT.handle(q, d); return dump(); };
const tick = () => new Promise((r) => setImmediate(r));

const tests = [
  ["check in time kya hai?", ["any time", "11:00"]],
  ["family room me kitne log ruk sakte hain", ["3–4", "200"]],
  ["payment kaise kar sakte hain?", ["Cash", "UPI"]],
  ["cancellation policy?", ["refund", "20–30"]],
  ["extra bed charge?", ["200"]],
  ["breakfast included in room rent?", ["not included", "6:00"]],
  ["kaun si id chahiye check in par?", ["Aadhaar", "Voter ID"]],
  ["pets allowed?", ["pets are allowed"]],
  ["home delivery karte ho?", ["No home delivery", "parcel"]],
  ["kitchen timing?", ["6:00 AM – 1:30 AM"]],
  ["jain food milta hai?", ["Jain food is available"]],
  ["driver room available?", ["not available"]],
  ["koi offer chal raha hai?", ["No confirmed offer"]],
  ["deluxe room ka rate?", ["1,200", "2–3", "per room"]],
  ["kya best hai khane me?", ["Paneer items or Masala items"]],
];
(async () => {
let pass = 0;
for (const [q, expect] of tests) {
  const out = ask(q);
  const ok = expect.every((e) => out.toLowerCase().includes(e.toLowerCase()));
  console.log((ok ? "PASS" : "FAIL") + " | " + q + (ok ? "" : "  → got: " + out.slice(0, 140)));
  if (ok) pass++;
}
/* lead-capture flow: naam + mobile → WhatsApp message me */
ask("REC:paneer", "Paneer items");               // pref → full step
ask("REC:full", "See complete menu");            // flow close (null)
ask("deluxe room ka rate?");                     // topic set hota hai
let l1 = ask("LEAD:start", "Send my enquiry");
const lead1 = /name/i.test(l1);
let l2 = ask("Ramesh Kumar");
const lead2 = /mobile/i.test(l2);
let l3 = ask("12345");
const leadBad = /10/.test(l3) && /number/i.test(l3);      // validation rokta hai
ask("9876543210"); await tick(); const l4 = dump();
const l4raw = msgs.children.map((c) => c.innerHTML).join(" | ");
const leadOk = /Ramesh Kumar/.test(l4) && /9876543210/.test(l4) && /wa\.me/.test(l4raw);
for (const [n, ok] of [["lead: name poochha", lead1], ["lead: phone poochha", lead2], ["lead: galat phone roka", leadBad], ["lead: WhatsApp msg me name+mobile", leadOk]]) {
  console.log((ok ? "PASS" : "FAIL") + " | " + n); if (ok) pass++;
}

/* recommend pref step: dish questions must NOT be hijacked */
ask("kya best khana hai?");
const d1 = ask("kadai paneer h kya");
const esc1 = /Kadhai Paneer/.test(d1) && /250/.test(d1) && !/most-loved|हिट डिशेस/.test(d1);
const d2 = ask("mater paneer milega kya");
const esc2 = /Matar Paneer/.test(d2) && /210/.test(d2);
const d3 = ask("hello ji");
ask("REC:full"); // close any open flow
for (const [n, ok] of [["rec-pref: dish query escapes to item card", esc1], ["rec-pref: matar paneer availability", esc2]]) {
  console.log((ok ? "PASS" : "FAIL") + " | " + n); if (ok) pass++;
}

/* room facility answers */
const f1 = ask("deluxe room me kya suvidha hai?");
const fac1 = /Deluxe/.test(f1) && /Air conditioning|एयर कंडीशनिंग/.test(f1) && /Balcony|बालकनी/.test(f1) && !/TV|Work desk/.test(f1);
const f2 = ask("sab rooms me kya facilities hain?");
const fac2 = /Standard/.test(f2) && /Deluxe/.test(f2) && /Family/.test(f2) && /200/.test(f2);
for (const [n, ok] of [["rooms: single room facilities", fac1], ["rooms: all-room facilities + extra bed", fac2]]) {
  console.log((ok ? "PASS" : "FAIL") + " | " + n); if (ok) pass++;
}

/* parcel/pack intent + precise order parsing */
const p1 = ask("khana pack krvana h ho jayga kya");
const packOk = /pack ho jayega|we'll pack|पैक हो जाएगा/.test(p1) && /Just write|लिख दीजिए/.test(p1);
ask("cancel"); // escape order flow
ask("order karna hai");
const p2 = ask("Kadai paneer 1/2 , matar paneer 1 or tawa roti 10");
const parseOk = /Kadhai Paneer \(half\) × 1/.test(p2) && /145/.test(p2) && /Matar Paneer × 1/.test(p2) && /Tawa Roti × 10/.test(p2) &&
  /475/.test(p2) && !/Shahi|Bhurji|Parantha|Malai|Palak|Mix/.test(p2);
ask("cancel");

/* vacancy: no backend → honest fallback, no invented numbers */
const v1 = ask("aaj room vacant hai kya?");
const vacOk = /24×7|24x7/.test(v1) && /call|कॉल/i.test(v1) && !/vacant:|खाली:/.test(v1);
const v2 = ask("wifi available hai kya?");
const wifiOk = /Wi-Fi|वाईफ़ाई/.test(v2);
for (const [n, ok] of [["vacancy: no backend → honest 24×7 fallback", vacOk], ["vacancy: 'wifi available' stays amenities", wifiOk]]) {
  console.log((ok ? "PASS" : "FAIL") + " | " + n); if (ok) pass++;
}

/* half portions: paneer +20, masala +10 */
ask("order karna hai");
const h1 = ask("2 kadhai paneer half aur 1 dal makhani half");
const halfOk = /Kadhai Paneer \(half\) × 2 — ₹290/.test(h1) && /Dal Makhani \(half\) × 1 — ₹85/.test(h1) && /375/.test(h1);
ask("cancel");
const h2 = ask("kadai paneer ka rate kya hai");
const halfRate = /250/.test(h2) && /145/.test(h2);
for (const [n, ok] of [["half: order me half qty+price (paneer +20, masala +10)", halfOk],
                       ["half: rate jawab me full/half dono", halfRate]]) {
  console.log((ok ? "PASS" : "FAIL") + " | " + n); if (ok) pass++;
}
for (const [n, ok] of [["pack: 'khana pack krvana h' → confirm + order start", packOk],
                       ["order: 'kadai paneer 1/2, matar 1, roti 10' → exact cart ₹580", parseOk]]) {
  console.log((ok ? "PASS" : "FAIL") + " | " + n); if (ok) pass++;
}

/* simple order flow: likho → add → naam+mobile → WhatsApp */
ask("REC:full", "See complete menu");            // recommend flow close
const o1 = ask("order karna hai");
const ord1 = /2 थाली|2 thali/.test(o1);          // example ke saath simple ask
const o2 = ask("2 thali aur 1 kadhai paneer");
const ord2 = /× 2/.test(o2) && /530/.test(o2);   // 2*140 + 250
const o3 = ask("1 lassi");
const ord3 = /580/.test(o3);                     // +50
const o4 = ask("bas");
const ord4 = /name|नाम/i.test(o4) && /580/.test(o4);
ask("Ramesh 9876543210"); await tick();
const o5 = dump(); const o5raw = msgs.children.map((c) => c.innerHTML).join(" | ");
const ord5 = /Ramesh/.test(o5) && /9876543210/.test(o5) && /580/.test(o5) && /wa\.me/.test(o5raw);
for (const [n, ok] of [["order: simple ask + example", ord1], ["order: '2 thali aur 1 kadhai paneer' → ₹530", ord2], ["order: '1 lassi' add → ₹580", ord3], ["order: 'bas' → naam+mobile ask", ord4], ["order: final WA msg me name+mobile+total", ord5]]) {
  console.log((ok ? "PASS" : "FAIL") + " | " + n); if (ok) pass++;
}

/* recommend flow sequence */
ask("kya best hai khane me?");
let out = ask("REC:paneer", "Paneer items");
const seq1 = /Kadhai Paneer/.test(out) && /Palak Paneer/.test(out) && /Matar Paneer/.test(out);
out = ask("REC:full", "See complete menu");
const seq2 = /Thali/.test(out) && /Chai/.test(out) && (out.match(/•/g) || []).length >= 35;
ask("what do you recommend?");
out = ask("REC:masala", "Masala items");
const seq3 = /Dal Makhani/.test(out) && /Kadhi/.test(out);
ask("kya best hai?", );           // fresh recommend flow
out = ask("REC:both", "Best of both");
const seq4 = /Paneer:/.test(out) && /Masala:/.test(out);
for (const [n, ok] of [["flow: paneer hits+full list", seq1], ["flow: complete menu (35 items)", seq2], ["flow: masala hits", seq3], ["flow: both", seq4]]) {
  console.log((ok ? "PASS" : "FAIL") + " | " + n); if (ok) pass++;
}
const TOTAL = tests.length + 24;
/* vacancy: backend/apps-script se fresh counts */
sandbox.AGENT_CONFIG = { availabilityUrl: "mock://av" };
sandbox.fetch = () => Promise.resolve({ ok: true, json: () => ({ ok: true, availability: { updatedAt: new Date().toISOString(), source: "test", vacant: { standard: 4, deluxe: 0, family: 2 } } }) });
msgs.children.length = 0; sandbox.SMM_AGENT.handle("room vacant hai kya?");
await tick();
const v3 = dump();
const vacLive = /4 vacant|4 खाली/.test(v3) && /full|फुल/.test(v3) && /2 vacant|2 खाली/.test(v3);
console.log((vacLive ? "PASS" : "FAIL") + " | vacancy: live counts from configured source"); if (vacLive) pass++;
delete sandbox.AGENT_CONFIG;

console.log(`\n${pass}/${TOTAL} tests passed`);
process.exit(pass === TOTAL ? 0 : 1);
})();
