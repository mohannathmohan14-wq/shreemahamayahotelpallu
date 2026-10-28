# Setup Guide (Beginner-friendly) — Website + AI Sales Agent + Backend
Shri Maha Maya Hotel & Restaurant · Pallu, Hanumangarh

> ⚠️ **Pehle ye padhein:** Live site (Netlify) ko tab tak re-deploy NA karein jab tak neeche ke
> tests pass na hon aur aap khud preview me satisfy na ho jaayein.

---

## A. Folder map (kya kya hai)

```
shri-maha-maya/
├── index.html                site (agent wired: knowledge.js + agent.js)
├── assets/js/knowledge.js    ⭐ business knowledge base (sachhi info yahan edit karein)
├── assets/js/menu.js         ⭐ menu + daam (pehle jaisa)
├── assets/js/agent.js        AI sales agent "Maya Sahayak" (chat widget)
├── assets/js/app.js          site engine + i18n + form validation
├── _headers, _redirects      Netlify security/redirect config
├── robots.txt, sitemap.xml   SEO
├── server/
│   ├── server.js             enquiry backend (zero-dependency Node)
│   ├── .env.example          env variables ka example
│   └── admin/                owner dashboard (login + enquiries + CSV)
└── docs/                     audit, plan, whatsapp plan, test results
```

## B. Website deploy (Netlify — jaisa abhi hai)
1. Poora `shri-maha-maya` folder zip karein (ya kholein).
2. netlify.com → **Deploys → drag & drop** folder (sirf site wali cheezein chahiye Netlify ko:
   index.html, assets/, images/, _headers, _redirects, robots.txt, sitemap.xml — `server/` aur
   `docs/` upload karne ki zaroorat NAHI).
3. Purana deploy replace ho jayega. Cache-bust versions (`?v=N`) already bumped hain.

## C. Backend chalana (enquiry storage + dashboard)

### Option 1 — Computer par test (5 minute)
```bash
cd shri-maha-maya/server
node -v                       # Node 18+ chahiye
OWNER_PASSWORD="apna-strong-password" PORT=8787 node server.js
# browser me:  http://localhost:8787/admin/
```

### Option 2 — Android phone par (Termux) — bilkul free
```bash
pkg update && pkg install nodejs -y
# folder phone par copy karein (e.g. ~/shri-maha-maya)
cd ~/shri-maha-maya/server
OWNER_PASSWORD="apna-strong-password" node server.js
# phone browser me: http://localhost:8787/admin/
```
Note: Termux wala server tab tak chalega jab tak Termux khula hai — permanent ke liye Option 3.

### Option 3 — Free cloud (Render.com recommended)
1. Render → **New → Web Service** → repo upload karein (sirf `server/` folder).
2. Build command: *(khali)* · Start command: `node server.js`
3. Environment me add karein: `OWNER_PASSWORD`, `ALLOWED_ORIGIN=https://shreemahamayahotelpallu.netlify.app`, `DATA_DIR=/tmp/data`
   (Render free tier restarts par /tmp saaf hota hai — production me Render Disk ya Railway MySQL use karein; docs/IMPLEMENTATION-PLAN.md me upgrade path).
4. URL milega jaise `https://smm-api.onrender.com`.

### Site ko backend se jodna
`index.html` me agent scripts se pehle ye line add karein (URL apna):
```html
<script>window.AGENT_CONFIG = { api: "https://smm-api.onrender.com" };</script>
```
Na jodein to agent **WhatsApp-only mode** me imaandari se chalega — dono halat safe hain.

## D. Environment variables (kabhi code me nahi likhne)
| Variable | Meaning | Example |
|---|---|---|
| PORT | backend port | 8787 |
| OWNER_PASSWORD | dashboard login | strong 12+ chars |
| DATA_DIR | enquiries.json folder | ./data ya /tmp/data |
| ALLOWED_ORIGIN | site origin (CORS) | https://shreemahamayahotelpallu.netlify.app |

## E. Database setup
- Abhi: **JSON file** (`server/data/enquiries.json`) — atomic write, backup = file copy.
- 500+ enquiries/month hone par: Railway/PlanetScale MySQL ya Supabase par shift (plan doc me steps).

## F. Test plan (har deploy se pehle)
1. `node --check` sab JS files par (syntax).
2. Site preview: hero, menu tabs, room swipe, language toggle, agent chat (EN+HI), booking form validation (khali form → error), form submit → WhatsApp khule.
3. Backend: health, enquiry POST (valid/invalid/duplicate), login wrong/right, list, status change, stats, CSV.
4. Mobile: 360px width par agent panel bottom-sheet, fab overlap nahi, menu leak nahi.
5. Dashboard: enquiry dikhe, WhatsApp button guest ke number par khule.
Results: `docs/TEST-RESULTS.md` (auto-generated + manual checklist).

## G. Manual checklist (phone par khud karein)
- [ ] Agent fab (baayein neeche) khulta/band hota hai
- [ ] Hindi toggle par agent bhi Hindi bolta hai
- [ ] "Book a room" flow: room → dates → guests → name → phone → WhatsApp
- [ ] Galat phone number par agent rokta hai
- [ ] "Payment/cancellation" poochhne par staff ke paas bhejta hai (andaaza nahi lagata)
- [ ] Booking form khali chhodne par laal error dikhta hai
- [ ] Popup block hone par direct WhatsApp link dikhta hai
