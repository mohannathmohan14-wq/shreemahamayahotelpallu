# Room Availability — Maya ko live vacancy kaise milegi

**Rule (kabhi nahi tootega):** Maya vacancy ka number tabhi bolegi jab data **fresh (24 ghante ke andar)** ho.
Data nahi/purana ho to wo saaf bolti hai: *"Front desk 24×7 khuli hai — call/WhatsApp par turant confirm ho jayega."*
Wo kabhi apni taraf se room available/full **guess nahi karti**.

## Pipeline (ban gaya ✅, agent v14 + backend)

```
[Data source]  →  backend store (availability.json)  →  GET /api/availability (public)  →  Maya bot
```

- **Backend endpoints** (`server/server.js`):
  - `GET /api/availability` — public, sirf counts (koi guest data nahi): `{ok, availability:{updatedAt, source, vacant:{standard, deluxe, family}, note}}`
  - `POST /api/availability` — **Bearer token zaroori** (owner login): `{vacant:{standard:0-10, deluxe:0-10, family:0-10}, source?, note?}`
    - galat value → `400`; bina token → `401`
- **Owner dashboard** (`/admin/`): naya card **"Aaj ki vacancy"** — 3 number boxes (Standard/Deluxe/Family khali) + Save.
  Roz subah (ya jab badle) update kar dijiye; Maya wahi bolegi, update-time ke saath.
- **Website bot** (`agent.js` v14): intent `vacancy` — "room vacant hai?", "खाली कमरा?", "room mil jayega kya", "availability"...
  - `window.AGENT_CONFIG.api` set ho → fetch → fresh ho to counts + "final confirmation hotel karega"
  - api na ho / data purana ho → honest fallback + Call/Book chips

## Billing app se connect karne ke raaste

### Rasta 1a — Google Sheets bridge (RECOMMENDED, server-free ✅ BAN GAYA)
`apps-script/Code.gs` = chhota bridge: billing-app POST karta hai (token body me) → Apps Script sheet
"Maya-Vacancy-Shri-Maha-Maya" me counts save → Maya `AGENT_CONFIG.availabilityUrl` se GET karti hai.
Manual update: sheet me row 2 edit karein, ya `/exec?action=set&token=..&s=&d=&f=` bookmark link.
Setup 8 click: `apps-script/README-APPS-SCRIPT.md`. Billing snippet dono targets bolta hai
(Apps Script YA hamara backend — X-Sync-Token header + body token dono bhejta hai).

## Baaki raaste

### Rasta 1 — Billing app push adapter (BAN GAYA ✅ — HotelBill Pro ke liye)
Aapka billing app offline PWA hai (data sirf phone ke localStorage me), isliye **app khud push karti hai**:
`billing-patch/index.html` = poora billing app + sync snippet jo har save (check-in/out, room status) ke baad
`POST /api/availability` bhejta hai, header `X-Sync-Token: <env AVAILABILITY_TOKEN>` ke saath (bearer token ka alternative).
Sirf khali kamron ki ginti jaati hai (source: "billing-app"); guest data kabhi nahi.
Poore deploy steps: `billing-patch/README-BILLING-PATCH.md`.
Tested: galat token → 401, sahi token → 200 + public GET par counts ✅

### Rasta 2 — App report export karta hai (CSV/PDF/email)
- CSV: dashboard par ek "Import CSV" button ya server par drop-folder parser — columns map karke `vacant{}` nikalta hai.
- Sirf PDF/email ho to: roz ek forward/parse step lag sakta hai, par ye sabse zyada maintenance maangta hai.

### Rasta 3 — Koi API/export nahi (abhi ka default)
Dashboard card par **30 second me manual update** — bilkul safe, kyunki Maya stale data par number nahi bolti.

## Freshness & safety
- `updatedAt` 24 ghante purana → bot fallback par chala jata hai (galat number bolne se behtar).
- Public endpoint me sirf khali kamron ki ginti hai — na guest naam, na phone, na booking details.
- Booking confirmation hamesha hotel karta hai; Maya "confirmed" kabhi nahi bolti.

## Test
- `node tools/agent-test.js` → 38/38 (vacancy fallback + wifi-available regression included)
- curl suite: GET null → POST 401 (no token) → POST 200 → GET values → POST 400 (bad value) ✅
