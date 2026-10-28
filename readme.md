# 🏨 श्री महा माया होटल वेबसाइट — मालिक की गाइड

Aapki website **poori tarah taiyaar hai**. Ye file batati hai ki ise live kaise karein aur aage khud kya-kya badal sakte hain.

---

## 📁 Is package me kya-kya hai

```
shri-maha-maya/
├── index.html              ← पूरी वेबसाइट (एक ही page)
├── assets/
│   ├── css/style.css       ← डिज़ाइन (colors, fonts, layout)
│   ├── js/app.js           ← साइट का इंजन (भाषा, फॉर्म, गैलरी...)
│   └── js/menu.js          ← ⭐ पूरा मेनू (items + price यहीं बदलें)
├── images/                 ← सारी फोटो (hero, rooms, food, map)
├── tools/optimize.py       ← नई फोटो डालने पर चलाने वाला टूल
├── MENU-GUIDE.md           ← मेनू बदलने की पूरी गाइड
└── README.md               ← यही फाइल
```

---

## 🌐 वेबसाइट LIVE करने के 3 आसान तरीके

### Option 1 — Hostinger / GoDaddy (सबसे आम, ₹100-300/महीना)
1. Hostinger.in / GoDaddy.in से hosting + domain खरीदें (domain: `shrimahamayahotel.com` जैसा)
2. उनके cPanel में जाएं → **File Manager** → `public_html` फोल्डर खोलें
3. इस पूरे फोल्डर की सारी files upload करें (index.html सबसे बाहर होनी चाहिए)
4. बस! Domain खोलने पर वेबसाइट दिखेगी

### Option 2 — Netlify (FREE, सबसे आसान)
1. `netlify.com` पर free account बनाएं
2. Login करके **"Add new site" → "Deploy manually"** चुनें
3. इस पूरे `shri-maha-maya` फोल्डर को खींच कर छोड़ दें (drag & drop)
4. Netlify एक link देगा (जैसे `shrimahamaya.netlify.app`) — वही आपकी वेबसाइट है
5. बाद में अपना domain (₹500-700/साल) भी जोड़ सकते हैं

### Option 3 — GitHub Pages (FREE)
1. `github.com` पर free account बनाएं
2. New repository बनाएं → सारी files upload करें
3. Settings → Pages → Deploy from branch → main
4. `आपका-नाम.github.io/...` पर साइट live हो जाएगी

> 💡 **सलाह:** शुरुआत के लिए Netlify सबसे आसान है — 2 मिनट में live, कोई पैसा नहीं।

---

## 🔧 खुद क्या-क्या बदल सकते हैं (बिना developer के)

| क्या बदलना है | कहाँ बदलें |
|---|---|
| **मेनू items / price** | `assets/js/menu.js` — पूरी गाइड `MENU-GUIDE.md` में है |
| **फोन नंबर / WhatsApp** | `assets/js/app.js` — सबसे ऊपर `CONFIG` में |
| **फोटो बदलना** | `images/` फोल्डर में नई photo डालें (जिस फाइल का नाम बदलना है उसी नाम से) |
| **रूम की photos** | `images/rooms/` में |
| **खाने की photos** | `images/food/` में + `menu.js` में `img:` लाइन |

### ⚠️ जरूरी: Domain लगाने के बाद एक काम जरूर करें
`index.html` के सबसे ऊपर कुछ SEO links हैं जिनमें `https://www.shrimahamayahotel.com` लिखा है (canonical, og:url, schema @id/url)। अपना असली domain लगने के बाद वहाँ अपना domain डाल दें — Google में ranking और WhatsApp/Facebook share के लिए जरूरी है। नहीं समझे तो मुझसे करवा लेना।

---

## 📞 साइट में पहले से लगा है (आपका असली डेटा)

- फोन: 99505 01306 · 96604 01306 (call + WhatsApp)
- Email: shreemahamayahotel@gmail.com
- पता: Main Highway, near Indian Oil Fuel Station, Pallu, Hanumangarh, Rajasthan 335522
- Map pin: exact (28.938974, 74.216543) + Google listing + review button
- Rooms: 10 (Standard ₹1,000 / Deluxe ₹1,200 / Family ₹1,400)
- Menu: पूरा असली मेनू (6 tabs, 35 items)
- Hindi ↔ English toggle, WhatsApp booking form, mobile-fast loading

---

## 🛠️ नई फोटो डालने का तरीका (साइज बड़ी हो तो)
1. `images/` के सही फोल्डर में photo (jpg/png) डालें
2. Computer पर Python हो तो: `python3 tools/optimize.py` चलाएं (photo compress होकर webp बन जाएगी)
3. या squoosh.app पर compress करके सीधे .webp में डालें

कुछ भी अटके तो फोटो/सवाल मुझे भेज देना — मैं कर दूंगा। 🙏
