# Implementation Plan — AI Sales Agent Integration
Companion to `AUDIT-REPORT.md`. Status column = done in this change-set.

| Phase | Work item | How | Status |
|---|---|---|---|
| 1 | Code audit | Full-tree inspection, form/network grep, hosting config check | ✅ Done (audit report) |
| 1 | Fix high-sev audit issues | canonical/og → live Netlify URL; form validation; popup-blocker fallback; `_headers`, `_redirects`, robots, sitemap; privacy note | ✅ Done |
| 2 | Verified knowledge base | `assets/js/knowledge.js` (owner-editable, HI+EN); prices NOT duplicated (agent reads `menu.js`); 9 items flagged `needsOwnerVerification` | ✅ Done |
| 3 | Website AI assistant | `assets/js/agent.js` — bilingual rule-based intents (19), booking & order flows with phone validation, escalation guardrails, WhatsApp handoff, optional backend POST, follows site language live | ✅ Done |
| 3 | Agent UI | Floating chat button (left) + bottom-sheet/panel (mobile-first), chips, a11y (role=log, Esc, focus), reduced-motion safe | ✅ Done |
| 4 | Enquiry backend | `server/server.js` — zero-dep Node: validated POST /api/enquiries, rate limit, HMAC owner tokens, PATCH status, stats, atomic JSON store, security headers | ✅ Done |
| 4 | Owner dashboard | `server/admin/` — login, stats, filter, status actions, WhatsApp reply link, CSV export; token in sessionStorage only | ✅ Done |
| 4 | API-key hygiene | Secrets env-only (`.env.example`); frontend holds ZERO secrets; AGENT_CONFIG.api is public URL only | ✅ Done |
| 5 | WhatsApp | Click-to-chat retained; official Business Platform path documented (webhook sketch, templates, opt-in/out, human handover, costs); **not connected — not claimed** | ✅ Doc done, connection pending |
| 6 | Testing | Automated backend tests + static checks → `docs/TEST-RESULTS.md`; manual phone checklist in SETUP-GUIDE | ✅ Auto done, manual pending owner |
| 6 | Deployment | Netlify (site) + Render/Termux/VPS (backend) steps; live site untouched until approved | ✅ Docs done |

## Upgrade path (jab zaroorat ho)
1. **DB scale:** JSON → SQLite (better-sqlite3) → MySQL/Supabase; sirf `readDB/writeDB` functions badalne hain.
2. **Real LLM brain:** backend par proxy endpoint `/api/ask` jo OpenAI/Gemini key (server env me) use kare; agent.js fallback chain: KB → LLM → escalation. Frontend kabhi key nahi dekhega.
3. **WhatsApp automation:** WHATSAPP-BUSINESS-PLAN.md ke steps; webhook + templates + opt-in ke baad hi "automated" claim.
4. **Notifications:** nayi enquiry par owner ko WhatsApp/email push (backend cron + BSP API).

## Owner-verification queue (business side, code ready)
KB.needsOwnerVerification: occupancy per room, check-in/out times, kitchen hours, payment modes,
advance/cancellation, extra-bed charge, pet policy, Google review count, offers.
Jab owner bataye → `knowledge.js` me value bharein aur `?v=` bump karein; agent turant sahi jawab dega.
