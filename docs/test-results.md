# Acceptance Test Results — AI Sales Agent + Backend
**Date:** 2026-10-25 · **Environment:** sandbox Node v20.20.2, Python http.server (site), backend on :8787
**Backend under test:** `server/server.js` (zero-dep) · **Site under test:** static build with agent wired

## Automated results (all executed, output verbatim summary)

| # | Test | Expected | Got | Pass |
|---|---|---|---|---|
| T01 | GET /api/health | 200 | 200 | ✅ |
| T02 | POST enquiry, bad phone + short name | 400 validation | 400 (`name`,`phone` invalid) | ✅ |
| T03 | POST enquiry, invalid type | 400 | 400 | ✅ |
| T04 | POST valid enquiry (room, hi) | 201 + id + honest note | 201 | ✅ |
| T05 | POST malformed JSON | 400 bad-json | 400 | ✅ |
| T06 | POST 12 KB body | 413 payload-too-large | 413 | ✅ |
| T07 | Login wrong password | 401 | 401 | ✅ |
| T08 | Login correct password | token | 92-char HMAC token | ✅ |
| T09 | GET enquiries without token | 401 | 401 | ✅ |
| T10 | GET enquiries with token | 200 + rows | 200 | ✅ |
| T11 | PATCH status → contacted | 200 | 200 | ✅ |
| T12 | PATCH invalid status | 400 | 400 | ✅ |
| T13 | GET /api/stats | 200 counts | 200 | ✅ |
| T14 | GET /admin/ dashboard | 200 | 200 | ✅ |
| T15 | Path traversal /api/../server/server.js | 404 | 404 | ✅ |
| T16 | CORS preflight | 204 | 204 | ✅ |
| T17 | Rate limit burst (6/10 min per IP) | 429 after quota | 201 then 429×6 | ✅ |
| T18 | JSON persistence after restart-safe atomic write | rows on disk | 2 rows | ✅ |
| T19 | Static site / | 200 | 200 | ✅ |
| T20 | agent.js served (v1) | 200 | 200 | ✅ |
| T21 | knowledge.js served (v1) | 200 | 200 | ✅ |

Syntax: `node --check` passed for app.js, agent.js, knowledge.js, menu.js, server.js, admin/admin.js.

## Booking-confirmation rule (guardrail) verification
- API response on create: `"note": "Enquiry received. Booking/order is confirmed ONLY after hotel staff confirms."` ✅
- Agent copy (`sentOk`, `sentWaOnly`) never uses the word confirmed for the guest's booking; dashboard shows the same warning. ✅
- Escalation intents (payment, cancellation, occupancy, check-in times, offers, complaints) return staff handoff, never invented answers. ✅ (code-level; see agent.js INTENTS + KB.needsOwnerVerification)

## Manual checklist — OWNER KO PHONE PAR KARNI HAI (not yet done)
- [ ] Agent fab khulna/band hona (baayein neeche gol button)
- [ ] EN ↔ HI toggle par agent ki bhasha badalna
- [ ] "Book a room" flow end-to-end → WhatsApp message sahi details ke saath
- [ ] "Order food" flow → kitchen enquiry WhatsApp par
- [ ] Galat phone par agent ka rokna
- [ ] Booking form khali → laal error; popup block → direct WhatsApp link
- [ ] 360px screen par panel bottom-sheet, koi overlap nahi
- [ ] Dashboard login → enquiry dikhna → WhatsApp button guest ke number par
**Jab ye ho jayein, is file me tick karke date likh dein.**

## Known limitations (honest)
1. WhatsApp automation **connected NAHI** — click-to-chat only (see WHATSAPP-BUSINESS-PLAN.md).
2. Backend storage JSON file — free-tier restarts par data reset ho sakta hai; production me Disk/MySQL (plan doc).
3. Agent rule-based hai — LLM nahi; upgrade path plan doc me.
4. KB me 9 business facts owner-verification ke intezaar me (knowledge.js me flagged).
5. Live Netlify site abhi tak purana build hai — **re-deploy owner ki approval ke baad hi**.
