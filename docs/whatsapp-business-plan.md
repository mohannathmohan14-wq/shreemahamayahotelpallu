# WhatsApp Integration Plan — Shri Maha Maya Hotel & Restaurant
**Status today: CLICK-TO-CHAT ONLY.** Site par jo WhatsApp buttons hain wo guest ke phone me
WhatsApp kholte hain pre-filled message ke saath. **Koi automated WhatsApp messaging connected
NAHI hai aur test NAHI hui hai.** Jab tak connect + test na ho, kisi ko (guest/owner) ye claim
NAHI karni chahiye ki "bot WhatsApp par reply karta hai".

---

## 1. What works today (retain)
- 18+ click-to-chat links with bilingual pre-filled messages (rooms, orders, menu, booking form).
- AI agent on site collects enquiries → sends guest to WhatsApp with the full enquiry text.
- Optional backend stores every enquiry so nothing is lost even if WhatsApp fails.

## 2. Official WhatsApp Business Platform — what you need
| Step | Kya karna hai | Kaun karega |
|---|---|---|
| 1 | **WhatsApp Business App** se shuruat karein (free) — profile, catalogue, quick replies set karein. Abhi ke liye yahi kaafi hai. | Owner |
| 2 | Meta **Business Manager** account + business verification (GST/PAN/UDYAM document). | Owner |
| 3 | Ek **BSP (Business Solution Provider)** chunein — jaise AiSensy, WATI, 360dialog, Twilio, Gupshu. Ye webhook + API access dete hain (₹500–3,000/month typical). | Owner + developer |
| 4 | Naya phone number jo WhatsApp par registered NA ho (ya existing number migrate karein — 14 din ka window). | Owner |
| 5 | **Message templates** approve karwayein (booking confirm, order update, reminder). Category + Hindi/English text Meta approve karta hai. | Developer submits |
| 6 | Backend me **webhook endpoint** banayein (neeche sketch) jo BSP ke messages receive kare. | Developer |
| 7 | **Opt-in** lein: guest site/form par checkbox se WhatsApp updates ki haan de (DPDP Act 2023). **Opt-out**: "STOP" message par turant band. | Developer + owner policy |
| 8 | **Human handover**: jab bot confident na ho ya guest "staff se baat karni hai" bole → conversation owner ke WhatsApp Business App/inbox par aa jaye. | Rule in code |

## 3. Webhook sketch (server/server.js me aage add hoga — ABHI CONNECT NAHI)
```
POST /api/wa/webhook            ← BSP calls this
  • verify X-Hub-Signature-256 (Webhook secret se HMAC compare)
  • message type text? → agent intent engine (assets/js/agent.js logic port to Node)
  • answer KB se → BSP send API se reply (session message, 24h window free)
  • uncertain/complaint → owner ko forward + status "human"
```
Secrets (`WA_WEBHOOK_SECRET`, `WA_TOKEN`) **sirf server env me**, kabhi frontend me nahi.

## 4. Rules jo humesha lagoo rahenge (guardrails)
1. Booking/payment "confirmed" message **sirf tab** jab owner/staff dashboard se confirm kare.
2. Templates sirf approved ones; promotional template bina opt-in ke nahi.
3. Har automated message me opt-out hint ("STOP likh kar band karein").
4. Complaint = turant human handover, bot debate nahi karega.
5. Guest ka number kabhi third-party ko nahi diya jayega (privacy note site par hai).

## 5. Cost & time expectation (indicative, verify before buying)
- WhatsApp Business App: free.
- BSP platform: ₹500–3,000/month.
- Meta conversation charges: service conversations ~free window ke andar; marketing templates paid (India rates Meta ki site par dekhein).
- Setup time: 1–3 weeks (business verification + template approval dependent).

*Document version 1 — connection ke baad is file me "CONNECTED & TESTED on <date>" likha jayega.*
