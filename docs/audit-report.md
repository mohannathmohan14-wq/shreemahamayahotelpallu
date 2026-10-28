# Code Audit Report — Shri Maha Maya Hotel & Restaurant Website
**Audit date:** 2026-10-25 · **Auditor:** Arena Agent · **Live URL:** https://shreemahamayahotelpallu.netlify.app/
**Scope:** Full frontend codebase in `/home/user/shri-maha-maya/` (the source of the live Netlify deploy), pre-modification, for AI Sales Agent integration.

---

## 1. Project structure & framework

| Item | Finding |
|---|---|
| Framework | **None** — plain static HTML + CSS + vanilla JS (no build step, no bundler, no npm deps). Ideal for low-end Android + slow networks. |
| Pages | Single page (`index.html`) with 8 anchored sections (hero, about, rooms, dining, amenities, gallery, testimonials, location, contact). |
| Styles | `assets/css/style.css` (one design-system file, cache-busted `?v=7`). |
| Scripts | `assets/js/app.js` (behaviour + EN/HI i18n, `?v=11`), `assets/js/menu.js` (owner-editable menu data, `?v=4`). |
| Data files | `menu.js` is the single source of truth for menu items/prices (rendered by `app.js`). |
| Images | 25 WebP/JPG assets, all lazy-loaded, all referenced files exist (0 broken refs). |
| Hosting config | **None found** — no `netlify.toml`, no `_redirects`, no `_headers`. Netlify is serving the folder as-is (drag-drop deploy). |
| Docs | `README.md` (owner deploy guide), `MENU-GUIDE.md` (Hindi menu-editing guide). |

## 2. Contact links, booking form & WhatsApp integration

| Surface | Behaviour | Submits data anywhere? |
|---|---|---|
| Booking form `#booking-form` (name, phone, email, check-in/out, guests, rooms, message) | `preventDefault()` → builds a pre-filled WhatsApp text → `window.open(wa.me/919950501306?text=…)` | **No** — enquiry exists only as a WhatsApp draft on the guest's phone. Nothing is stored, emailed or logged. |
| 18 WhatsApp click-to-chat links (`wa.me` / `data-wa-*` bilingual pre-filled messages) | Open WhatsApp with prefilled EN/HI text | No |
| 3 `tel:` links (9950501306 / 9660401306) | Phone dialer | No |
| 2 `mailto:` links (shreemahamayahotel@gmail.com) | Mail app | No |
| Floating WhatsApp button | Click-to-chat | No |
| Google review / listing / directions buttons | External Google URLs (place id `0x3915cb5560ab22f7:0xd98ef3784c89800d`) | No |

**Conclusion:** the site is 100% "click-to-chat". There is **zero server-side enquiry capture** today.

## 3. Missing backend services (pre-existing gaps)

- **No backend/API** — no `fetch()`, no `XMLHttpRequest` anywhere in the codebase.
- **No database** — enquiries, bookings and orders are never persisted.
- **No authentication** — no owner login, no admin area.
- **No server for API keys** — none needed today (also none available for an LLM integration).
- **Only client storage:** `localStorage` for the language preference, wrapped in try/catch (safe).
- **No analytics, no cookies, no third-party trackers** (privacy-positive, but no enquiry funnel visibility).

## 4. Issues found (before any modification)

| # | Severity | Issue | Status |
|---|---|---|---|
| 1 | High | **SEO URLs are placeholders.** `canonical`, `og:url`, `og:image`, `twitter:image` and JSON-LD `@id`/`url`/`image` all point to `https://www.shrimahamayahotel.com/` (never registered), while the live site is the Netlify URL. Shares/SEO credit go to a dead domain. | **Fixed in this change-set** (re-pointed to the live Netlify URL; swap again when a custom domain is bought). |
| 2 | High | **Booking form has no validation.** `novalidate` + handler reads values with `"-"` fallbacks → an empty form produces a WhatsApp draft full of dashes. No inline error messages. | **Fixed** (required-field validation + Hindi/English error hints added). |
| 3 | High | **Enquiry loss risk.** `window.open()` can be blocked by in-app browsers/popup blockers → guest thinks enquiry sent, hotel receives nothing, no fallback. | **Mitigated** (form now also offers copy-text fallback; new AI agent stores enquiries in backend when configured and always shows WhatsApp as backup). |
| 4 | Medium | **No server-side record of any enquiry** — owner cannot see missed bookings, cannot follow up. | **Addressed by Phase 4 backend + dashboard (new).** |
| 5 | Medium | **No security headers** (no Netlify `_headers`) — missing CSP, X-Frame-Options etc. | **Added** `_headers` + `_redirects` in this change-set. |
| 6 | Medium | **No `robots.txt` / `sitemap.xml`.** | **Added** in this change-set. |
| 7 | Low | Manual cache-busting (`?v=N`) — worked, but relies on remembering to bump. | Accepted practice; documented. |
| 8 | Low | Menu prices exist only in `menu.js` (good) — any new feature must **read** it, never duplicate prices. | Enforced: AI agent reads `window.MENU` at runtime. |
| 9 | Low | Mobile-menu contact lines once leaked over the navbar on some phones. | Fixed earlier (`style.css?v=7`, `visibility:hidden` guard). |
| 10 | Info | Map iframe previously blank on slow networks. | Fixed earlier (click-to-load real-map card). |
| 11 | Info | No privacy policy text although the form collects name/phone (India DPDP Act 2023 relevance). | **Added** one-line privacy note under the form. |

## 5. What already works well (preserve!)

- Bilingual EN/HI toggle with full i18n dictionary (131 keys) and menu re-render.
- Owner-editable menu (`menu.js`) + Hindi guide — non-technical workflow proven.
- Real photos, real prices, real coordinates, real Google place id — no invented data.
- Mobile-first performance: lazy images, ~4.3 MB total imagery, no frameworks.
- Swipeable room galleries, lightbox, reveal fail-safes, floating WhatsApp button.
- Guard-rails already respected: no banquet/Maharaja-suite/dal-baati claims anywhere.

## 6. Readiness verdict for AI Sales Agent

**Ready, with conditions.** The static architecture can host a client-side bilingual assistant immediately (Phase 3). True enquiry storage, owner login and dashboard require the new lightweight backend (Phase 4) deployed separately; until then the agent must run in **WhatsApp-only mode** and say so honestly. Official WhatsApp automation is **not** connected and must not be claimed (Phase 5 plan documents the path).

*End of audit.*
