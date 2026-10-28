/* =====================================================================
   श्री महा माया — AI SALES AGENT ("Maya Sahayak")
   ---------------------------------------------------------------------
   ▪ Bilingual (Hindi/English) rule-based assistant — koi external API
     key nahi chahiye, mobile-light, site ke verified data se jawab.
   ▪ Data sources: window.KB (knowledge.js) + window.MENU (menu.js).
     Daam kabhi hard-code NAHI karte — menu.js se padhte hain.
   ▪ Backend optional: window.AGENT_CONFIG.api set ho to enquiries
     server par save hoti hain; na ho to WhatsApp-only mode (imaandari
     se batata hai).
   ▪ GUARDRAILS:
     - Booking/payment kabhi "confirmed" nahi bolta — hamesha kehta hai
       hotel staff confirm karega.
     - KB.needsOwnerVerification wale topics par answer nahi ghadhta —
       staff se baat karwata hai (escalation).
     - Offers tabhi batata hai jab KB.offers me owner-approved offer ho.
   ===================================================================== */
(function () {
  "use strict";

  /* ---------- config ---------- */
  window.AGENT_CONFIG = window.AGENT_CONFIG || { api: "" }; // e.g. "https://your-backend.onrender.com"

  const KB = window.KB, MENU = window.MENU || {};
  let lang = document.documentElement.lang === "hi" ? "hi" : "en";

  const T = {
    agentName:   { en: "Maya Sahayak", hi: "माया सहायक" },
    role:        { en: "Hotel sales assistant · online · v15", hi: "होटल सहायक · ऑनलाइन · v15" },
    open:        { en: "Chat with us", hi: "बात कीजिए" },
    close:       { en: "Close chat", hi: "चैट बंद करें" },
    placeholder: { en: "Type your question…", hi: "अपना सवाल लिखिए…" },
    send:        { en: "Send", hi: "भेजें" },
    typing:      { en: "typing…", hi: "लिख रही हूँ…" },
    greeting:    { en: "Namaste! 🙏 I am Maya, Shri Maha Maya Hotel's assistant. Ask me about rooms, rates, our pure-veg menu, location — or I can send your booking enquiry on WhatsApp.",
                   hi: "नमस्ते! 🙏 मैं माया हूँ, श्री महा माया होटल की सहायक। कमरे, दाम, शुद्ध शाकाहारी मेनू, लोकेशन — कुछ भी पूछिए, या आपकी बुकिंग enquiry व्हाट्सऐप पर भेज दूँ।" },
    chips:       { en: ["Rooms & rates", "Pure-veg menu", "Book a room", "Order food", "Location", "Call hotel"],
                   hi: ["कमरे और दाम", "शाकाहारी मेनू", "कमरा बुक करें", "खाना ऑर्डर करें", "लोकेशन", "होटल को कॉल"] },
    waBtn:       { en: "Continue on WhatsApp", hi: "व्हाट्सऐप पर जारी रखें" },
    callBtn:     { en: "Call the hotel", hi: "होटल को कॉल करें" },
    sentOk:      { en: "✅ Your enquiry is saved with the hotel. Staff will confirm on WhatsApp/call — your booking is confirmed ONLY after the hotel confirms.",
                   hi: "✅ आपकी enquiry होटल के पास सुरक्षित हो गई। स्टाफ़ व्हाट्सऐप/कॉल पर पुष्टि करेगा — बुकिंग पक्की तभी मानी जाएगी जब होटल-confirm करे।" },
    sentWaOnly:  { en: "Tap below to send this enquiry on WhatsApp — the hotel replies there. Nothing is booked until the hotel confirms.",
                   hi: "नीचे दबाकर यह enquiry व्हाट्सऐप पर भेजिए — होटल वहीं जवाब देगा। होटल की पुष्टि के बिना बुकिंग पक्की नहीं मानी जाएगी।" },
    sendFail:    { en: "⚠️ Could not reach the hotel server. Please send on WhatsApp or call — sorry for the trouble!",
                   hi: "⚠️ होटल सर्वर तक नहीं पहुँच पाई। कृपया व्हाट्सऐप या कॉल कीजिए — क्षमा कीजिए!" },
    escalate:    { en: "I don't want to guess this one — our staff will give the exact answer. Please call or WhatsApp:",
                   hi: "इसमें मैं अंदाज़ा नहीं लगाना चाहती — स्टाफ़ से सटीक जवाब मिलेगा। कृपया कॉल या व्हाट्सऐप कीजिए:" },
    complaint:   { en: "Sorry you faced trouble! 🙏 I'm passing this to the hotel manager right away. Meanwhile staff is on call 24×7:",
                   hi: "क्षमा कीजिए, आपको परेशानी हुई! 🙏 मैं तुरंत होटल मैनेजर तक पहुँचा रही हूँ। स्टाफ़ 24×7 कॉल पर है:" },
    thanks:      { en: "You're most welcome! Anything else — rooms, food, directions?", hi: "आपका स्वागत है! और कुछ — कमरे, खाना, रास्ता?" },
    fallback:    { en: "I'm still learning this one. I can help with rooms, rates, menu, booking, orders and location — or connect you to staff:",
                   hi: "यह मैं अभी सीख रही हूँ। कमरे, दाम, मेनू, बुकिंग, ऑर्डर और लोकेशन में मदद कर सकती हूँ — या स्टाफ़ से जोड़ दूँ:" },
    recAsk:      { en: "Lovely question! 😊 What do you feel like eating — Paneer items or Masala items? I'll suggest our hit dishes from there.",
                   hi: "बढ़िया सवाल! 😊 आपका मन क्या खाने का है — पनीर आइटम या मसाला आइटम? मैं वहाँ से हमारी हिट डिशेस सुझाऊँगी।" },
    ordCat:    { en: "Of course! Which category would you like to order from?", hi: "बिल्कुल! किस श्रेणी से ऑर्डर करना है?" },
    ordPick:   { en: "Tap items to add them to your order:", hi: "आइटम दबाकर ऑर्डर में जोड़िए:" },
    ordAdded:  { en: "Added:", hi: "जोड़ दिया:" },
    ordCartHead: { en: "Your order so far:", hi: "अब तक का आपका ऑर्डर:" },
    ordTotal:  { en: "Total", hi: "कुल" },
    ordEmpty:  { en: "Your cart is empty — please pick some items first.", hi: "कार्ट खाली है — पहले कुछ आइटम चुनिए।" },
    ordProceed: { en: "✅ Proceed to order", hi: "✅ ऑर्डर पक्का करें" },
    ordMore:   { en: "+ Add items", hi: "+ और आइटम" },
    ordView:   { en: "🛒 View cart", hi: "🛒 कार्ट देखें" },
    ordCats:   { en: "← Categories", hi: "← श्रेणियाँ" },
    leadName:  { en: "Of course! I'll forward your enquiry to the hotel on WhatsApp. Please write your name:",
                 hi: "बिल्कुल! मैं आपकी enquiry होटल को व्हाट्सऐप पर भेज दूँगी। कृपया अपना नाम लिखिए:" },
    leadPhone: { en: "And your mobile number?", hi: "और आपका मोबाइल नंबर?" },
    leadChip:  { en: "Send my enquiry", hi: "मेरी enquiry भेजें" },
    leadStaff: { en: "Send my enquiry to staff", hi: "मेरी enquiry स्टाफ को भेजें" },
    /* booking flow */
    bkRoom:   { en: "Which room would you like?", hi: "आपको कौन-सा कमरा चाहिए?" },
    bkDates:  { en: "Check-in and check-out dates? (e.g. 26 Oct – 27 Oct)", hi: "चेक-इन और चेक-आउट तारीख़? (जैसे 26 अक्टू – 27 अक्टू)" },
    bkGuests: { en: "How many guests?", hi: "कितने मेहमान?" },
    bkName:   { en: "Your name, please?", hi: "आपका नाम, कृपया?" },
    bkPhone:  { en: "And your mobile number?", hi: "और आपका मोबाइल नंबर?" },
    bkSummary:{ en: "Here is your enquiry — send it to the hotel:", hi: "यह रही आपकी enquiry — होटल को भेजिए:" },
    /* order flow */
    odItems:  { en: "What would you like to order? (dish names, e.g. Thali, Kadhai Paneer)", hi: "क्या-क्या ऑर्डर करना है? (व्यंजन के नाम, जैसे थाली, कड़ाही पनीर)" },
    odName:   { en: "Your name, please?", hi: "आपका नाम, कृपया?" },
    odPhone:  { en: "Mobile number for the order?", hi: "ऑर्डर के लिए मोबाइल नंबर?" },
    odSummary:{ en: "Your order enquiry — send it to the kitchen on WhatsApp:", hi: "आपका ऑर्डर — रसोई को व्हाट्सऐप पर भेजिए:" },
  };
  const t = (k) => (T[k] ? T[k][lang] || T[k].en : k);

  /* ---------- data helpers (prices sirf menu.js/KB se) ---------- */
  function menuItems() {
    const out = [];
    Object.keys(MENU).forEach((k) => {
      const cat = MENU[k] || {};
      (cat.featured || []).concat(cat.list || []).forEach((it) => out.push(it));
    });
    return out;
  }
  const norm = (s) => (s || "").toLowerCase().replace(/[?!.,;:'"’‘।،]/g, " ").replace(/\s+/g, " ").trim();
  const rupees = (p) => String(p).replace("₹", "₹ ");

  function findRoom(q) {
    return KB.rooms.find((r) =>
      q.includes(r.id) || q.includes(r.name.toLowerCase().replace(" ac", "")) ||
      q.includes(r.nameHi.replace(" एसी", "")) || (r.id === "family" && (q.includes("family") || q.includes("परिवार"))) ||
      (r.id === "deluxe" && q.includes("डीलक्स")) || (r.id === "standard" && (q.includes("स्टैंडर्ड") || q.includes("सादा"))));
  }
  const STOPW = new Set(["ka", "ki", "ke", "ko", "me", "mein", "se", "aur", "hai", "hain", "ho", "hoga", "h",
    "milega", "milegi", "milta", "milti", "kya", "kyu", "kaise", "karo", "chahiye", "chahta", "chahti", "please",
    "plz", "ek", "do", "teen", "char", "paanch", "kitna", "kitne", "wala", "wali", "wale", "to", "bhi", "na",
    "nahi", "nhi", "yes", "no", "the", "a", "an", "in", "is", "it", "of", "for", "with", "you", "have", "has",
    "i", "we", "my", "me", "sir", "ji", "jii", "bhaiya", "price", "rate", "cost", "daam", "dam", "kitne", "ka"]);
  function lev(a, b) {
    if (a === b) return 0;
    if (Math.abs(a.length - b.length) > 2) return 9;
    let prev = [];
    for (let j = 0; j <= b.length; j++) prev[j] = j;
    for (let i = 1; i <= a.length; i++) {
      const cur = [i];
      for (let j = 1; j <= b.length; j++)
        cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1));
      prev = cur;
    }
    return prev[b.length];
  }
  const fuzzy = (a, b) => a.length >= 4 && b.length >= 4 && a[0] === b[0] && lev(a, b) <= 1;
  function findDish(q) {
    const nq = norm(q);
    const qt = nq.split(/\s+/).filter((w) => w.length > 1 && !STOPW.has(w));
    if (!qt.length) return [];
    const scored = [];
    for (const it of menuItems()) {
      const en = norm(it.name.en), hi = norm(it.name.hi);
      let s = 0;
      if ((en.length > 2 && nq.includes(en)) || (hi.length > 1 && nq.includes(hi))) s = 100;
      else {
        const et = en.split(" "), ht = hi.split(" ");
        for (const w of qt) {
          let best = 0;
          for (const tk of et) if (w === tk) best = Math.max(best, 2); else if (fuzzy(w, tk)) best = Math.max(best, 1);
          for (const tk of ht) if (w === tk) best = Math.max(best, 2);
          s += best;
        }
      }
      if (s > 0) scored.push({ it, s });
    }
    if (!scored.length) return [];
    const max = Math.max(...scored.map((x) => x.s));
    return scored.filter((x) => x.s === max).map((x) => x.it).slice(0, 8);
  }

  /* ---------- intent engine ---------- */
  const INTENTS = [
    { id: "complaint", en: ["complaint", "problem", "issue", "dirty", "rude", "refund"], hi: ["शिकायत", "समस्या", "परेशानी", "गंदा", "बदतमीज़ी", "रिफंड"] },
    { id: "payment",   en: ["payment", "pay by", "upi", "card", "cash", "google pay", "phonepe"], hi: ["भुगतान", "पेमेंट", "यूपीआई", "कार्ड", "नकद", "कैश"] },
    { id: "policy",    en: ["cancel", "cancellation", "advance", "refund policy", "deposit"], hi: ["रद्द", "कैंसल", "पेशगी", "एडवांस", "जमा"] },
    { id: "occupancy", en: ["how many people", "occupancy", "extra bed", "extra person", "capacity"], hi: ["कितने लोग", "अतिरिक्त बेड", "एक्स्ट्रा बेड", "क्षमता"] },
    { id: "checkin",   en: ["check-in", "checkin", "check-out", "checkout", "check in", "check out", "check in time", "check out time"], hi: ["चेक इन", "चेक-इन", "चेक आउट", "चेक-आउट"] },
    { id: "offers",    en: ["offer", "offers", "discount", "deal", "cheap rate"], hi: ["ऑफर", "छूट", "डिस्काउंट", "सस्ता"] },
    { id: "pets",      en: ["pets", "pet", "dog", "cat"], hi: ["कुत्ता", "बिल्ली", "जानवर", "पालतू", "पेट"] },
    { id: "driver",    en: ["driver", "driver room", "staff room"], hi: ["ड्राइवर", "चालक"] },
    { id: "idproof",   en: ["id proof", "id", "identity", "aadhaar", "aadhar", "voter id", "id card", "licence", "license"], hi: ["आईडी", "आधार", "पहचान", "लाइसेंस"] },
    { id: "breakfast", en: ["breakfast", "nashta", "naashta"], hi: ["नाश्ता", "ब्रेकफास्ट"] },
    { id: "best",      en: ["best", "recommend", "recommendation", "suggest", "suggestion", "famous", "popular", "signature", "must try", "what to eat"], hi: ["बेस्ट", "मशहूर", "प्रसिद्ध", "सबसे अच्छा", "क्या खाएं", "क्या खाऊं", "सुझाव", "क्या खाना चाहिए", "कौन सी डिश"] },
    { id: "booking",   en: ["book", "reserve", "booking", "availability", "room available"], hi: ["बुक", "बुकिंग", "रिज़र्व", "खाली कमरा", "उपलब्ध"] },
    { id: "order",     en: ["order", "takeaway", "take away", "parcel", "deliver", "home delivery", "pack", "packing"], hi: ["ऑर्डर", "पार्सल", "टेकअवे", "डिलीवरी", "मंगवा", "पैक", "पैकिंग"] },
    { id: "vacancy",   en: ["vacant", "vacancy", "free room", "room available", "rooms available", "any room available", "availability", "room mil jayega"], hi: ["खाली", "वैकेंसी", "कमरा मिल जयega", "कमरा मिलेगा", "रूम खाली", "जगह खाली"] },
    { id: "roomprice", en: ["rate", "rates", "price", "prices", "charge", "charges", "cost", "kitna", "kitne"], hi: ["दाम", "कीमत", "किराया", "कितना", "कितने", "चार्ज"] },
    { id: "rooms",     en: ["room", "rooms", "stay", "night", "accommodation"], hi: ["कमरा", "कमरे", "रुकना", "ठहरना", "रात"] },
    { id: "menu",      en: ["menu", "food", "eat", "dinner", "lunch", "breakfast", "dish", "thali", "paneer", "veg items"], hi: ["मेनू", "खाना", "खाने", "व्यंजन", "थाली", "पनीर", "नाश्ता", "डिनर", "लंच"] },
    { id: "veg",       en: ["pure veg", "vegetarian", "non veg", "nonveg", "egg", "alcohol", "jain"], hi: ["शाकाहारी", "नॉनवेज", "अंडा", "शराब", "जैन", "शुद्ध"] },
    { id: "hours",     en: ["open", "hours", "timing", "time", "when", "24"], hi: ["समय", "टाइम", "कब", "खुला", "बंद"] },
    { id: "location",  en: ["where", "address", "location", "direction", "how to reach", "map", "pin"], hi: ["कहाँ", "कहां", "पता", "लोकेशन", "रास्ता", "नक्शा", "एड्रेस"] },
    { id: "amenities", en: ["parking", "wifi", "wi-fi", "ac", "air condition", "service", "facility", "facilities", "room facility"], hi: ["पार्किंग", "वाईफ़ाई", "वाइफ़ाई", "एसी", "सुविधा", "सुविधाएँ", "सर्विस"] },
    { id: "review",    en: ["rating", "review", "star", "google review"], hi: ["रेटिंग", "रिव्यू", "स्टार"] },
    { id: "contact",   en: ["call", "phone", "number", "whatsapp", "contact", "email"], hi: ["फोन", "नंबर", "संपर्क", "कॉल", "ईमेल", "व्हाट्सऐप"] },
    { id: "thanks",    en: ["thanks", "thank you", "ok thanks"], hi: ["धन्यवाद", "शुक्रिया", "धन्यवाद जी"] },
    { id: "greeting",  en: ["hi", "hello", "hey", "good morning", "good evening", "namaste"], hi: ["नमस्ते", "नमस्कार", "हैलो", "हेलो"] },
  ];

  const escRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  function detect(qRaw) {
    const q = norm(qRaw);
    if (!q) return null;
    for (const it of INTENTS) {
      const keys = (it.en || []).concat(it.hi || []);
      for (const k of keys) {
        const nk = norm(k);
        if (!nk) continue;
        const re = new RegExp("(^|\\s)" + escRe(nk) + "(\\s|$)");
        if (re.test(q)) return it.id;
      }
    }
    return null;
  }

  /* ---------- answer builders ---------- */
  const roomLine = (r) => `• ${lang === "hi" ? r.nameHi : r.name} — ₹${r.price.toLocaleString("en-IN")} / ${lang === "hi" ? "रात" : "night"} (${r.occupancy[lang]})`;
  async function vacancyAnswer() {
    const chips = [
      { label: lang === "hi" ? "कमरा बुक करें" : "Book a room", send: "ROOM:start" },
      { label: lang === "hi" ? "होटल को कॉल करें" : "Call the hotel", href: "tel:+919950501306" },
    ];
    const CFG0 = window.AGENT_CONFIG || {};
    const url = CFG0.availabilityUrl || (CFG0.api ? CFG0.api.replace(/\/$/, "") + "/api/availability" : "");
    if (!url) {
      bot(lang === "hi"
        ? "लाइव वैकेंसी मेरे पास नहीं है — फ्रंट डेस्क 24×7 खुली है, कॉल/व्हाट्सऐप पर तुरंत पक्की जानकारी मिल जाएगी:"
        : "I don't have live vacancy right now — the front desk is open 24×7 and will confirm instantly on call/WhatsApp:", chips);
      return;
    }
    let av = null;
    try {
      const r = await fetch(url);
      const j = await r.json();
      if (j && j.ok) av = j.availability;
    } catch (e) { av = null; }
    const fresh = av && av.updatedAt && (Date.now() - new Date(av.updatedAt).getTime()) < 24 * 3600 * 1000;
    if (!fresh) {
      bot(lang === "hi"
        ? "आज की वैकेंसी अभी अपडेट नहीं है — फ्रंट डेस्क 24×7 खुली है, कॉल/व्हाट्सऐप पर तुरंत बता देंगे:"
        : "Today's vacancy isn't updated yet — the front desk is open 24×7 and will confirm instantly on call/WhatsApp:", chips);
      return;
    }
    const t0 = new Date(av.updatedAt).toLocaleTimeString(lang === "hi" ? "hi-IN" : "en-IN", { hour: "2-digit", minute: "2-digit" });
    const line = (name, n) => `• ${name}: ${n > 0 ? (lang === "hi" ? n + " खाली" : n + " vacant") : (lang === "hi" ? "फुल" : "full")}`;
    bot((lang === "hi" ? `आज की वैकेंसी (${t0} अपडेट):\n` : `Today's vacancy (updated ${t0}):\n`) +
      line(lang === "hi" ? "स्टैंडर्ड एसी" : "Standard AC", av.vacant.standard) + "\n" +
      line(lang === "hi" ? "डीलक्स एसी" : "Deluxe AC", av.vacant.deluxe) + "\n" +
      line(lang === "hi" ? "फैमिली एसी" : "Family AC", av.vacant.family) + "\n" +
      (lang === "hi" ? "बुकिंग पर पक्की पुष्टि होटल करेगा — एडवांस आधा या उससे अधिक।" : "The hotel confirms every booking — advance is half or more."), chips);
  }
  function roomsAnswer(room) {
    if (room) {
      const f = (lang === "hi" ? room.facilitiesHi : room.facilities).join(", ");
      return `${lang === "hi" ? room.nameHi : room.name}: ₹${room.price.toLocaleString("en-IN")}/${lang === "hi" ? "रात" : "night"} (${room.occupancy[lang]}).\n${lang === "hi" ? "सुविधाएँ" : "Facilities"}: ${f}.\n${KB.extraBed[lang]} · ${KB.priceBasis[lang]}`;
    }
    return (lang === "hi"
      ? `हमारे ${KB.hotel.roomsTotal} एसी कमरे हैं (सभी शुद्ध शाकाहारी होटल में):\n`
      : `We have ${KB.hotel.roomsTotal} AC rooms in our pure-veg hotel:\n`) +
      KB.rooms.map(roomLine).join("\n") + "\n" + KB.priceBasis[lang] +
      (lang === "hi" ? "\nकिस कमरे की जानकारी चाहिए?" : "\nWhich room shall I tell you about?");
  }
  function menuAnswer(dishes) {
    if (dishes && dishes.length) {
      return dishes.map((d) => {
        const hp = halfPriceOf(d);
        return `• ${lang === "hi" ? d.name.hi : d.name.en} — ${rupees(d.price)}` +
          (hp ? (lang === "hi" ? ` / हाफ ₹${hp}` : ` / half ₹${hp}`) : "");
      }).join("\n") +
        (lang === "hi" ? "\nऑर्डर करना हो तो बताइए!" : "\nWant to order? Just say so!");
    }
    const cats = Object.keys(MENU).map((k) => MENU[k].title[lang] || MENU[k].title.en);
    return (lang === "hi"
      ? "हमारा 100% शुद्ध शाकाहारी मेनू — श्रेणियाँ:\n"
      : "Our 100% pure-veg menu — categories:\n") +
      cats.map((c) => "• " + c).join("\n") +
      (lang === "hi" ? "\nकिसी व्यंजन का नाम पूछिए, दाम बता दूँगी!" : "\nAsk any dish name and I'll tell you the price!");
  }
  function catItems(catKey) {
    const cat = MENU[catKey] || {};
    return (cat.featured || []).concat(cat.list || []);
  }
  function hitLines(catKey) {
    const all = catItems(catKey);
    const hits = all.filter((i) => i.hit);
    return (hits.length ? hits : all.slice(0, 6)).slice(0, 7)
      .map((i) => `🔥 ${lang === "hi" ? i.name.hi : i.name.en} — ${rupees(i.price)}`).join("\n");
  }
  function recHits(which) {
    const P = "tab-paneer", M = "tab-masala";
    if (which === "both") {
      return (lang === "hi" ? "हमारी सबसे हिट डिशेस:\n🧀 पनीर:\n" : "Our most-loved dishes:\n🧀 Paneer:\n") + hitLines(P) +
        (lang === "hi" ? "\n🍛 मसाला:\n" : "\n🍛 Masala:\n") + hitLines(M);
    }
    const ttl = which === "paneer" ? (lang === "hi" ? "पनीर" : "Paneer") : (lang === "hi" ? "मसाला" : "Masala");
    return (lang === "hi" ? `हमारी सबसे हिट ${ttl} डिशेस:\n` : `Our most-loved ${ttl} dishes:\n`) + hitLines(which === "paneer" ? P : M);
  }
  function catFull(catKey) {
    const cat = MENU[catKey]; if (!cat) return "";
    const t0 = cat.title ? (cat.title[lang] || cat.title.en) : catKey;
    return `📖 ${t0}:\n` + catItems(catKey).map((i) => {
      const hp = halfPriceOf(i);
      return `• ${lang === "hi" ? i.name.hi : i.name.en} — ${rupees(i.price)}` +
        (hp ? (lang === "hi" ? ` / हाफ ₹${hp}` : ` / half ₹${hp}`) : "");
    }).join("\n");
  }
  function fullMenuMessage() {
    return (lang === "hi" ? "📖 पूरा मेनू (100% शुद्ध शाकाहारी):\n\n" : "📖 Complete menu (100% pure veg):\n\n") +
      Object.keys(MENU).map(catFull).join("\n\n") +
      (lang === "hi" ? "\n\nसाइट के Dining सेक्शन में फोटो के साथ मेनू है। ऑर्डर करना हो तो बताइए!" : "\n\nThe site's Dining section has the photo menu. Want to order? Just say so!");
  }
  const waLink = (msg) => `https://wa.me/${KB.contact.whatsapp}?text=${encodeURIComponent(msg)}`;
  const actions = (waMsg) => [
    { label: t("waBtn"), href: waLink(waMsg), wa: true },
    { label: t("callBtn"), href: "tel:+91" + KB.contact.phonePrimaryRaw },
  ];

  /* ---------- enquiry submission (backend optional) ---------- */
  async function saveEnquiry(payload) {
    if (!window.AGENT_CONFIG.api) return { mode: "whatsapp-only" };
    try {
      const res = await fetch(window.AGENT_CONFIG.api.replace(/\/$/, "") + "/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      return { mode: "saved", data: await res.json() };
    } catch (e) {
      return { mode: "failed" };
    }
  }

  /* ================= UI ================= */
  const wrap = document.createElement("div");
  wrap.innerHTML = `
  <button class="agent-fab" id="agent-fab" aria-label="${t("open")}" aria-expanded="false">
    <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M21 12a8 8 0 0 1-8 8H4l2.2-2.6A8 8 0 1 1 21 12z"/><path d="M8.5 11h7M8.5 14h4.5"/></svg>
    <span class="agent-fab-dot" aria-hidden="true"></span>
  </button>
  <section class="agent-panel" id="agent-panel" role="dialog" aria-label="${t("agentName")}" hidden>
    <header class="agent-head">
      <span class="agent-ava" aria-hidden="true">म</span>
      <div class="agent-headtxt">
        <b>${t("agentName")}</b>
        <span id="agent-status">${t("role")}</span>
      </div>
      <button class="agent-close" id="agent-close" aria-label="${t("close")}">✕</button>
    </header>
    <div class="agent-msgs" id="agent-msgs" role="log" aria-live="polite"></div>
    <div class="agent-chips" id="agent-chips"></div>
    <form class="agent-input" id="agent-form">
      <input id="agent-text" type="text" autocomplete="off" placeholder="${t("placeholder")}" aria-label="${t("placeholder")}">
      <button type="submit" aria-label="${t("send")}">
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" stroke-width="1.9" aria-hidden="true"><path d="M4 12l16-8-6 16-2.5-6.5L4 12z"/></svg>
      </button>
    </form>
  </section>`;
  document.body.appendChild(wrap);

  const fab = document.getElementById("agent-fab");
  const panel = document.getElementById("agent-panel");
  const msgs = document.getElementById("agent-msgs");
  const chipsRow = document.getElementById("agent-chips");
  const form = document.getElementById("agent-form");
  const input = document.getElementById("agent-text");

  let opened = false, flow = null, draft = {};
  let topic = "", topicType = "general";

  function esc(s) { return String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  function addMsg(who, text, acts) {
    const d = document.createElement("div");
    d.className = "agent-msg " + who;
    d.innerHTML = `<p>${esc(text).replace(/\n/g, "<br>")}</p>` +
      (acts ? `<div class="agent-acts">${acts.map((a, i) =>
        `<a class="${a.wa ? "a-wa" : "a-call"}" href="${a.href}" ${a.wa ? 'target="_blank" rel="noopener"' : ""}>${esc(a.label)}</a>`).join("")}</div>` : "");
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
    return d;
  }
  function typing(on) {
    document.getElementById("agent-status").textContent = on ? t("typing") : t("role");
  }
  function bot(text, acts, delay) {
    typing(true);
    setTimeout(() => { typing(false); addMsg("bot", text, acts); }, delay || 420);
  }
  function setChips(list) {
    chipsRow.innerHTML = "";
    (list || []).forEach((c) => {
      const b = document.createElement("button");
      b.type = "button"; b.textContent = c.label;
      b.onclick = () => { chipsRow.innerHTML = ""; handle(c.send || c.label, c.label); };
      chipsRow.appendChild(b);
    });
  }
  const defaultChips = () => setChips(t("chips").map((c) => ({ label: c })).concat([{ label: t("leadChip"), send: "LEAD:start" }]));

  function openPanel() {
    panel.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    if (!opened) {
      opened = true;
      addMsg("bot", t("greeting"));
      defaultChips();
    }
    setTimeout(() => input.focus(), 250);
  }
  fab.onclick = () => (panel.hidden ? openPanel() : (panel.hidden = true, fab.setAttribute("aria-expanded", "false")));
  document.getElementById("agent-close").onclick = () => { panel.hidden = true; fab.setAttribute("aria-expanded", "false"); };
  document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !panel.hidden) panel.hidden = true; });

  /* ---------- flows ---------- */
  function startLead() {
    flow = { id: "lead", step: "name" };
    draft = { type: topicType || "general", note: topic };
    bot(t("leadName"));
  }
  async function finishLead() {
    const s = draft;
    const summary =
      `👤 Name: ${s.name}\n📞 Mobile: ${s.phone}\n📋 Topic: ${s.note || topic || "General enquiry"}`;
    const waMsg = `Namaste! 🙏 Website enquiry (Maya Sahayak bot se) — Shri Maha Maya Hotel, Pallu\n${summary}`;
    const res = await saveEnquiry({ name: s.name, phone: s.phone, type: s.type || "general", lang, source: "website-agent", details: summary });
    if (res.mode === "saved") bot(t("sentOk"), actions(waMsg));
    else if (res.mode === "failed") bot(t("sendFail") + "\n" + summary, actions(waMsg));
    else bot(t("sentWaOnly") + "\n" + summary, actions(waMsg));
    flow = null; draft = {};
    setTimeout(defaultChips, 800);
  }
  const recChips = () => [
    { label: lang === "hi" ? "पनीर आइटम" : "Paneer items", send: "REC:paneer" },
    { label: lang === "hi" ? "मसाली आइटम" : "Masala items", send: "REC:masala" },
    { label: lang === "hi" ? "दोनों के बेस्ट" : "Best of both", send: "REC:both" },
  ];
  function startRecommend() {
    flow = { id: "recommend", step: "pref" };
    bot(t("recAsk"));
    setChips(recChips());
  }
  function startBooking() {
    flow = { id: "booking", step: "room" }; draft = { type: "room" };
    bot(t("bkRoom"), KB.rooms.map((r) => ({
      label: `${lang === "hi" ? r.nameHi : r.name} · ₹${r.price.toLocaleString("en-IN")}`, send: "ROOM:" + r.id,
    })));
  }
  const WORD_NUM = { ek:1, one:1, do:2, two:2, teen:3, three:3, char:4, chaar:4, four:4, paanch:5, panch:5, five:5, chhe:6, chhah:6, six:6, saat:7, sat:7, seven:7, aath:8, eight:8, nau:9, nine:9, das:10, ten:10 };
  function allItems() {
    const out = [];
    Object.keys(MENU).forEach((k) => catItems(k).forEach((it, i) => out.push({ it, cat: k, idx: i })));
    return out;
  }
  const catOfIt = () => { const m = new Map(); allItems().forEach((x) => m.set(x.it, x.cat)); return m; };
  let CATMAP = null;
  function halfPriceOf(it) {
    if (!CATMAP) CATMAP = catOfIt();
    const ex = (MENU[CATMAP.get(it)] || {}).halfExtra;
    if (!ex) return null;
    return Math.round(Number(String(it.price).replace(/\D/g, "")) / 2) + ex;
  }
  const HALF_RE = /^(half|hf|adh|adha|aadha|हाफ|आधा|1\/2)$/;
  function parseOrderText(raw) {
    const toks = norm(raw).split(/\s+/).filter(Boolean);
    const clean = (t) => t.replace(/[^a-z0-9\u0900-\u097F]/g, "");
    const seqAt = (nt, i) => {
      for (let k = 0; k < nt.length; k++) {
        const w = clean(toks[i + k]);
        if (!(w === nt[k] || fuzzy(w, nt[k]))) return false;
      }
      return true;
    };
    const findSpan = (nts) => {
      for (const nt of nts) for (let i = 0; i + nt.length <= toks.length; i++) if (seqAt(nt, i)) return { s: i, e: i + nt.length - 1 };
      return null;
    };
    const nameToks = (it) => [norm(it.name.en), norm(it.name.hi)].map((n) => n.split(" ").filter((w) => w.length > 1));
    const items = allItems().map((x) => x.it);
    const found = [];
    for (const it of items) {                       // pass 1: poora naam
      const span = findSpan(nameToks(it));
      if (span) found.push({ it, span });
    }
    const overlaps = (a, b) => a.s <= b.e && b.s <= a.e;
    const groups = {};                              // pass 2: aakhiri token (jaise "lassi"), sirf agar unique ho
    for (const it of items) {
      if (found.some((f) => f.it === it)) continue;
      for (const nt0 of nameToks(it)) {
        if (nt0.length < 2) continue;
        const span = findSpan([nt0.slice(1)]);
        if (!span || found.some((f) => overlaps(f.span, span))) continue;
        const key = span.s + "-" + span.e;
        (groups[key] = groups[key] || []).push({ it, span });
        break;
      }
    }
    Object.values(groups).forEach((g) => { if (g.length === 1) found.push({ it: g[0].it, span: g[0].span }); });
    const kept = found.filter((f) => !found.some((o) => o !== f && o.span.s <= f.span.s && o.span.e >= f.span.e && (o.span.e - o.span.s) > (f.span.e - f.span.s)));
    const readNum = (t) => {
      if (!t) return null;
      const r = t.replace(/,/g, "");
      const c = clean(t);
      if (/^\d{1,2}$/.test(c)) return Number(c) || null;
      return WORD_NUM[c] || null;
    };
    return kept.map((f) => {
      const a1 = toks[f.span.e + 1], a2 = toks[f.span.e + 2], b1 = toks[f.span.s - 1];
      const isH = (t) => t && HALF_RE.test(String(t).toLowerCase().trim());
      let half = false, n = null;
      if (isH(a1)) { half = true; n = readNum(a2); if (n === null) n = readNum(b1); }
      else {
        n = readNum(a1);
        if (isH(a2)) half = true;
        if (n === null) { n = readNum(b1); if (isH(b1)) half = true; }
      }
      if (isH(b1) && half === false && n !== null && readNum(b1) === n) half = true;
      return { it: f.it, qty: n !== null ? Math.min(Math.max(n, 1), 99) : 1, explicit: n !== null, half };
    });
  }
  const isPhone = (s) => /^[6-9]\d{9}$/.test(String(s).replace(/\D/g, "").slice(-10));
  const cartTotal = () => (draft.cart || []).reduce((s, c) => s + c.price * c.qty, 0);
  const cartLines = (lng) => (draft.cart || []).map((c) =>
    `• ${lng === "hi" ? c.hi : c.en}${c.half ? (lng === "hi" ? " (हाफ)" : " (half)") : ""} × ${c.qty} — ₹${(c.price * c.qty).toLocaleString("en-IN")}`).join("\n");
  const popularChips = () => allItems().filter((x) => x.it.hit).slice(0, 8)
    .map((x) => ({ label: `${lang === "hi" ? x.it.name.hi : x.it.name.en} ${rupees(x.it.price)}`, send: `ADD:${x.cat}:${x.idx}` }));
  const doneChip = () => ({ label: lang === "hi" ? "✅ बस, ऑर्डर भेजें" : "✅ Send order", send: "ORD:done" });
  function askAdd(first) {
    bot(first
      ? (lang === "hi" ? "बिल्कुल! 😊 क्या चाहिए? बस लिख दीजिए — जैसे \"2 थाली, 1 कड़ाही पनीर हाफ, 4 तवा रोटी\"। (पनीर व मसाला आइटम फुल/हाफ मिलते हैं।) या नीचे से चुनिए:"
        : "Of course! 😊 What would you like? Just write it — e.g. \"2 thali, 1 kadhai paneer half, 4 tawa roti\". (Paneer & masala items come in full/half.) Or tap below:")
      : (lang === "hi" ? "और क्या चाहिए? लिखिए या नीचे चुनिए — हो जाए तो \"बस\" लिखिए:" : "What else? Write or tap below — write \"done\" when finished:"));
    setChips(popularChips().concat([doneChip()]));
  }
  function addToCart(list) {
    const found = { explicitQty: list.some((f) => f.explicit) };
    list.forEach(({ it, qty, half }) => {
      const full = Number(String(it.price).replace(/\D/g, "")) || 0;
      const price = half ? (halfPriceOf(it) || full) : full;
      const ex = (draft.cart || []).find((c) => c.en === it.name.en && !!c.half === !!half);
      if (ex) { if (found.explicitQty) ex.qty = qty; else ex.qty += qty; }
      else draft.cart.push({ en: it.name.en, hi: it.name.hi, price, qty, half: !!half });
    });
    bot((lang === "hi" ? "जोड़ दिया ✅\n" : "Added ✅\n") + cartLines(lang) + `\n💰 ${t("ordTotal")}: ₹${cartTotal().toLocaleString("en-IN")}`);
    setChips(popularChips().concat([doneChip()]));
  }
  function contactStep() {
    flow.step = "contact";
    bot(lang === "hi"
      ? `बढ़िया! कुल: ₹${cartTotal().toLocaleString("en-IN")}। अब नाम और मोबाइल नंबर एक साथ लिख दीजिए — जैसे \"रमेश 9876543210\":`
      : `Great! Total: ₹${cartTotal().toLocaleString("en-IN")}. Now write your name and mobile together — e.g. "Ramesh 9876543210":`);
  }
  function startOrder() {
    flow = { id: "order", step: "add" };
    draft = { type: "food", cart: [] };
    askAdd(true);
  }
  async function finishOrder() {
    const s = draft;
    const summary = `👤 Name: ${s.name}\n📞 Mobile: ${s.phone}\n🍽 Order:\n${cartLines("en")}\n💰 Total: ₹${cartTotal().toLocaleString("en-IN")}\n📦 Parcel/takeaway (no home delivery)`;
    const waMsg = `Namaste! 🙏 Food order (Maya Sahayak bot se) — Shri Maha Maya Restaurant, Pallu\n${summary}`;
    const res = await saveEnquiry({ name: s.name, phone: s.phone, type: "food", lang, source: "website-agent", details: summary });
    if (res.mode === "saved") bot(t("sentOk"), actions(waMsg));
    else if (res.mode === "failed") bot(t("sendFail") + "\n" + summary, actions(waMsg));
    else bot(t("sentWaOnly") + "\n" + summary, actions(waMsg));
    flow = null; draft = {};
    setTimeout(defaultChips, 800);
  }

  /* ---------- master handler ---------- */
  function handle(raw, display, noEcho) {
    const q = norm(raw);
    if (!noEcho) addMsg("user", display || raw);

    /* flow steps first */
    if (flow && flow.id === "lead") {
      if (flow.step === "name") { draft.name = raw; flow.step = "phone"; bot(t("leadPhone")); return; }
      if (flow.step === "phone") {
        if (!isPhone(raw)) { bot(lang === "hi" ? "कृपया सही 10 अंकों का मोबाइल नंबर लिखिए।" : "Please write a valid 10-digit mobile number."); return; }
        draft.phone = raw.replace(/\D/g, "").slice(-10); finishLead(); return;
      }
    }
    if (flow && flow.id === "recommend") {
      let which = null;
      if (raw === "REC:paneer" || /paneer|पनीर/.test(raw)) which = "paneer";
      else if (raw === "REC:masala" || /masala|मसाला/.test(raw)) which = "masala";
      else if (raw === "REC:both" || /both|dono|दोनों|all|सब/.test(raw)) which = "both";
      if (flow.step === "pref") {
        const isCode = raw === "REC:paneer" || raw === "REC:masala" || raw === "REC:both";
        const shortCat = /^(paneer|masala|both|dono|donon|all|sab|सब|दोनों|पनीर|मसाला)(\s*(items?|वाले?|इस?))?$/i.test(raw.trim());
        if (which && !isCode && !shortCat) {
          // "kadai paneer h kya" jaisa dish-sawaal → category nahi, item ka jawab do
          flow = null; return handle(raw, display, true);
        }
        if (!which) {
          const other = detect(raw);
          if (other && other !== "best") { flow = null; return handle(raw, display, true); }
          bot(t("recAsk")); setChips(recChips()); return;
        }
        flow.step = "full";
        bot(recHits(which));
        if (which !== "both") {
          setTimeout(() => bot(catFull(which === "paneer" ? "tab-paneer" : "tab-masala") +
            (lang === "hi" ? "\nऔर श्रेणियाँ: थाली स्पेशल, दही व चावल, रोटी व परांठा, फास्ट फूड।" : "\nOther categories: Thali Special, Dahi & Rice, Roti & Parantha, Fast Food.")), 700);
        }
        setChips([
          { label: lang === "hi" ? "पूरा मेनू देखें" : "See complete menu", send: "REC:full" },
          { label: lang === "hi" ? "ऑर्डर करें" : "Order now", send: "REC:order" },
        ]);
        return;
      }
      if (flow.step === "full") {
        if (raw === "REC:order" || /order|ऑर्डर/.test(raw)) { flow = null; startOrder(); return; }
        if (raw === "REC:full" || /full menu|complete menu|poora|पूरा मेनू|सारा मेनू/.test(raw)) {
          bot(fullMenuMessage()); flow = null; setTimeout(defaultChips, 600); return;
        }
        const o2 = detect(raw);
        if (o2 === "best") { startRecommend(); return; }
        if (o2) { flow = null; return handle(raw, display, true); }
        bot(lang === "hi" ? "😅 Ye samajh nahi aaya। नीचे chips से चुनिए, या 'order' लिखिए — या कोई dish का नाम पूछिए।"
                          : "😅 I didn't catch that. Pick a chip below, type 'order', or ask about any dish.");
        setChips([
          { label: lang === "hi" ? "पूरा मेनू देखें" : "See complete menu", send: "REC:full" },
          { label: lang === "hi" ? "ऑर्डर करें" : "Order now", send: "REC:order" },
        ]);
        return;
      }
    }
    if (flow) {
      if (flow.id === "booking") {
        if (flow.step === "room") {
          let r = raw.startsWith("ROOM:") ? KB.rooms.find((x) => x.id === raw.slice(5)) : findRoom(q);
          if (!r && q) r = null;
          if (!r) { bot(t("bkRoom")); return; }
          draft.roomName = (lang === "hi" ? r.nameHi : r.name) + " (₹" + r.price.toLocaleString("en-IN") + ")";
          flow.step = "dates"; bot(t("bkDates")); return;
        }
        if (flow.step === "dates") { draft.dates = raw; flow.step = "guests"; bot(t("bkGuests")); return; }
        if (flow.step === "guests") { draft.guests = raw; flow.step = "name"; bot(t("bkName")); return; }
        if (flow.step === "name") { draft.name = raw; flow.step = "phone"; bot(t("bkPhone")); return; }
        if (flow.step === "phone") {
          if (!isPhone(raw)) { bot(lang === "hi" ? "कृपया सही 10 अंकों का मोबाइल नंबर लिखिए।" : "Please write a valid 10-digit mobile number."); return; }
          draft.phone = raw.replace(/\D/g, "").slice(-10); finishBooking(); return;
        }
      }
      if (flow.id === "order") {
        if (flow.step === "add") {
          if (raw === "ORD:done" || /done|ho gaya|हो गया|complete|cart|कार्ट|send order|भेज/.test(raw) || /^bas$|^बस$/.test(raw)) {
            if (!(draft.cart || []).length) { bot(t("ordEmpty")); askAdd(true); return; }
            contactStep(); return;
          }
          if (raw.startsWith("ADD:") || raw.startsWith("ITEM:")) {
            const p = raw.split(":");
            const it = catItems(p[1])[Number(p[2])];
            if (it) addToCart([{ it, qty: 1 }]);
            return;
          }
          const found = parseOrderText(raw);
          if (found.length) { addToCart(found); return; }
          const oe = detect(raw);
          if (oe && oe !== "order" && oe !== "menu") { flow = null; return handle(raw, display, true); }
          bot(lang === "hi" ? "समझा नहीं 🙏 — व्यंजन का नाम लिखिए (जैसे \"2 थाली\") या नीचे दबाइए:" : "Didn't catch 🙏 — write the dish name (e.g. \"2 thali\") or tap below:");
          setChips(popularChips().concat([doneChip()]));
          return;
        }
        if (flow.step === "contact") {
          const digits = (raw.match(/\d{10}/) || [null])[0];
          if (!digits || !isPhone(digits)) { bot(lang === "hi" ? "कृपया नाम के साथ 10 अंकों का सही मोबाइल नंबर लिखिए:" : "Please write your name with a valid 10-digit mobile number:"); return; }
          draft.phone = digits;
          const name = raw.replace(digits, "").replace(/[,.\-+]/g, " ").replace(/\s+/g, " ").trim();
          if (name.length < 2) { flow.step = "nameOnly"; bot(lang === "hi" ? "नाम भी लिख दीजिए:" : "Your name too, please:"); return; }
          draft.name = name; finishOrder(); return;
        }
        if (flow.step === "nameOnly") { draft.name = raw; finishOrder(); return; }
      }
    }

    /* chip shortcuts */
    if (raw === "LEAD:start") { startLead(); return; }
    if (raw === "REC:full") { bot(fullMenuMessage()); defaultChips(); return; }
    if (raw === "REC:order") { startOrder(); return; }
    if (raw.startsWith("ROOM:")) { startBooking(); return; }

    let intent = detect(raw);
    const room = findRoom(q);
    const dishes = findDish(q);
    if (dishes.length && intent === "roomprice") intent = "menu"; // "kadai paneer ka rate" → dish ka rate, room ka nahi
    topic = raw;
    topicType = ["rooms", "roomprice", "booking", "checkin", "occupancy"].includes(intent) ? "room"
      : ["menu", "best", "order"].includes(intent) ? "food"
      : intent === "complaint" ? "complaint" : "general";

    switch (intent) {
      case "greeting": bot(t("greeting")); defaultChips(); return;
      case "thanks": bot(t("thanks")); return;
      case "complaint":
        bot(t("complaint"), actions(raw));
        setChips([{ label: t("leadStaff"), send: "LEAD:start" }]); return;
      case "payment": bot(KB.policies.payment[lang]); return;
      case "policy":
        bot((lang === "hi" ? "एडवांस: " : "Advance: ") + KB.policies.advance[lang] +
            "\n" + (lang === "hi" ? "कैंसलेशन: " : "Cancellation: ") + KB.policies.cancellation[lang]); return;
      case "occupancy":
        bot((lang === "hi" ? "प्रति कमरा मेहमान:\n" : "Guests per room:\n") +
            KB.rooms.map((r) => `• ${lang === "hi" ? r.nameHi : r.name}: ${r.occupancy[lang]}`).join("\n") +
            "\n" + KB.extraBed[lang]); return;
      case "checkin":
        bot((lang === "hi" ? "चेक-इन: " : "Check-in: ") + KB.checkInTime[lang] +
            "\n" + (lang === "hi" ? "चेक-आउट: " : "Check-out: ") + KB.checkOutTime[lang] +
            "\n" + (lang === "hi" ? "चेक-इन पर कोई एक सरकारी फोटो आईडी: " : "One government photo ID at check-in: ") + KB.idProofs.join(", ")); return;
      case "offers":
        if (KB.offers && KB.offers.length) { bot(KB.offers.map((o) => "• " + (lang === "hi" ? o.hi : o.en)).join("\n")); return; }
        bot(lang === "hi" ? "अभी कोई कन्फर्म ऑफर नहीं चल रहा। ग्रुप या स्पेशल रेट के लिए स्टाफ़ से बात कीजिए:" : "No confirmed offer is running right now. For group or special rates please talk to staff:", actions(raw));
        setChips([{ label: t("leadStaff"), send: "LEAD:start" }]); return;
      case "pets": bot(KB.policies.pets[lang]); return;
      case "driver": bot(KB.policies.driverStay[lang], actions(raw)); return;
      case "idproof": bot((lang === "hi" ? "चेक-इन पर कोई एक सरकारी फोटो आईडी: " : "One government photo ID at check-in: ") + KB.idProofs.join(", ")); return;
      case "breakfast": bot(lang === "hi" ? "नहीं, नाश्ता कमरे के किराए में शामिल नहीं — रेस्टोरेंट में सुबह 6:00 बजे से ताज़ा नाश्ता मिलता है।" : "No, breakfast is not included in the room rent — the restaurant serves fresh breakfast from 6:00 AM."); return;
      case "best": startRecommend(); return;
      case "booking": startBooking(); return;
      case "order": {
        const wantsPack = /pack|parcel|takeaway|take away|पैक|पार्सल|टेकअवे/.test(q);
        const asksDel = /delivery|deliver|डिलीवरी|मंगवा/.test(q);
        if (asksDel && !wantsPack) {
          bot(KB.policies.homeDelivery[lang] + (lang === "hi" ? "\nपार्सल ऑर्डर भेजना हो तो बताइए!" : "\nWant to place a parcel order? Just say so!"));
          return;
        }
        if (wantsPack) {
          bot(lang === "hi" ? "हाँ जी, बिल्कुल पैक हो जाएगा! 📦 (होम डिलीवरी नहीं — पार्सल/टेकअवे रेस्टोरेंट से मिलता है।)"
                            : "Yes, absolutely — we'll pack it for you! 📦 (No home delivery; parcel/takeaway from the restaurant.)");
        }
        startOrder(); return;
      }
      case "vacancy": vacancyAnswer(); return;
      case "roomprice": case "rooms": bot(roomsAnswer(room)); return;
      case "menu":
        if (/jain|जैन/.test(q)) { bot((lang === "hi" ? KB.policies.pureVegHi : KB.policies.pureVeg) + "\n" + KB.policies.jain[lang]); return; }
        bot(menuAnswer(dishes.length ? dishes : null)); return;
      case "veg": bot((lang === "hi" ? KB.policies.pureVegHi || KB.policies.pureVeg : KB.policies.pureVeg) + "\n" + KB.policies.jain[lang]); return;
      case "hours":
        bot(lang === "hi"
          ? `फ्रंट डेस्क: ${KB.hours.frontDeskHi}। रूम सर्विस: ${KB.hours.roomServiceHi}।\nरेस्टोरेंट/किचन: ${KB.hours.restaurantHi}।`
          : `Front desk: ${KB.hours.frontDesk}. Room service: ${KB.hours.roomService}.\nRestaurant/kitchen: ${KB.hours.restaurant}.`); return;
      case "location":
        bot((lang === "hi" ? KB.contact.addressHi : KB.contact.address) + "\n📍 " + (lang === "hi" ? "नीचे बटन से सटीक पिन खुलेगा:" : "Exact pin via the button below:"),
          [{ label: lang === "hi" ? "गूगल मैप पर देखें" : "Open in Google Maps", href: KB.contact.mapsListing, wa: true },
           { label: lang === "hi" ? "रास्ता (Directions)" : "Directions", href: KB.contact.directions, wa: true }]); return;
      case "amenities": {
        const r0 = findRoom(q);
        if (r0 || /room|rooms|kamra|kamre|कमरा|कमरे/.test(q)) {
          const list = r0 ? [r0] : KB.rooms;
          bot(list.map((r) => `🛏 ${lang === "hi" ? r.nameHi : r.name} (₹${r.price.toLocaleString("en-IN")}/${lang === "hi" ? "रात" : "night"}, ${r.occupancy[lang]}):\n` +
              (lang === "hi" ? r.facilitiesHi : r.facilities).map((f) => "   • " + f).join("\n")).join("\n\n") +
              "\n" + KB.extraBed[lang]);
          return;
        }
        bot((KB.amenities || []).map((a) => "• " + (lang === "hi" ? a.hi : a.en)).join("\n")); return;
      }
      case "review":
        bot((lang === "hi" ? `हमें ${KB.hotel.rating.score}★ रेटिंग मिली है (${KB.hotel.rating.count}+ रिव्यू, ${KB.hotel.rating.source})। आपका अनुभव कैसा रहा? गूगल पर रिव्यू लिखिए:` : `We are rated ${KB.hotel.rating.score}★ (${KB.hotel.rating.count}+ reviews, ${KB.hotel.rating.source}). How was your experience? Review us on Google:`),
          [{ label: lang === "hi" ? "गूगल पर रिव्यू लिखें" : "Write a Google review", href: "https://search.google.com/local/writereview?placeid=0x3915cb5560ab22f7:0xd98ef3784c89800d", wa: true }]); return;
      case "contact":
        bot((lang === "hi" ? "हमसे संपर्क कीजिए:" : "Reach us:") + `\n📞 ${KB.contact.phonePrimary}\n📞 ${KB.contact.phoneSecondary}\n📧 ${KB.contact.email}`, actions(raw)); return;
      default:
        if (dishes.length) { bot(menuAnswer(dishes)); return; }
        if (room) { bot(roomsAnswer(room)); return; }
        const faq = (KB.faq || []).find((f) => q.includes(norm(f.q)) || q.includes(norm(f.qHi)) || norm(f.q).split(" ").some((w) => w.length > 4 && q.includes(w)));
        if (faq) { bot(lang === "hi" ? faq.aHi : faq.a); return; }
        bot(t("fallback"), actions(raw));
        setChips([{ label: t("leadStaff"), send: "LEAD:start" }]); return;
    }
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const v = input.value.trim();
    if (!v) return;
    input.value = "";
    setChips(null);
    handle(v);
  });

  /* language switch live */
  document.addEventListener("smm:lang", (e) => {
    lang = e.detail === "hi" ? "hi" : "en";
    input.placeholder = t("placeholder");
    document.getElementById("agent-status").textContent = t("role");
    fab.setAttribute("aria-label", t("open"));
    if (opened && !msgs.children.length) addMsg("bot", t("greeting"));
  });

  window.SMM_AGENT = { open: openPanel, handle, version: "15" };
})();
