/* ============================================================
   Shri Maha Maya — app.js
   i18n (EN/HI), nav, hero slider, reveal, parallax, counters,
   menu tabs, lightbox, testimonials, booking form.
   ============================================================ */
"use strict";

/* ---------- Config (owner: edit phone & WhatsApp here) ---------- */
const CONFIG = {
  phone: "9950501306",
  phoneDisplay: "+91 99505 01306 · +91 96604 01306",
  whatsapp: "919950501306",
  email: "shreemahamayahotel@gmail.com",
};

const WA_BASE = "https://wa.me/" + CONFIG.whatsapp + "?text=";
const waMsg = (lang, textEn, textHi) =>
  WA_BASE + encodeURIComponent(lang === "hi" ? textHi : textEn);

/* ---------- SVG icons ---------- */
const S = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">';
const F = '<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" aria-hidden="true">';
const ICONS = {
  parking: S + '<rect x="4" y="4" width="16" height="16" rx="2.5"/><path d="M9.5 16.5V8h3.3a2.6 2.6 0 0 1 0 5.2H9.5"/></svg>',
  wifi: S + '<path d="M2.5 9a15 15 0 0 1 19 0"/><path d="M5.5 12.5a11 11 0 0 1 13 0"/><path d="M8.5 16a7 7 0 0 1 7 0"/><circle cx="12" cy="19.4" r="1" fill="currentColor" stroke="none"/></svg>',
  ac: S + '<path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4"/><path d="M12 3l-1.6 1.6M12 3l1.6 1.6M12 21l-1.6-1.6M12 21l1.6-1.6"/></svg>',
  clock: S + '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/></svg>',
  leaf: S + '<path d="M5 20c0-9 5-15 15-17-1 11-6 17-15 17z"/><path d="M5 20c5-6 8-11 13-16"/></svg>',
  utensils: F + '<path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z"/></svg>',
  bed: F + '<path d="M21 10.78V8c0-1.65-1.35-3-3-3h-4c-.77 0-1.47.3-2 .78-.53-.48-1.23-.78-2-.78H6C4.35 5 3 6.35 3 8v2.78c-.61.55-1 1.34-1 2.22v6h2v-2h16v2h2v-6c0-.88-.39-1.67-1-2.22zM14 7h4c.55 0 1 .45 1 1v2h-6V8c0-.55.45-1 1-1zM5 8c0-.55.45-1 1-1h4c.55 0 1 .45 1 1v2H5V8z"/></svg>',
  tv: S + '<rect x="3.5" y="6.5" width="17" height="11" rx="2"/><path d="M8.5 21h7M12 17.5V21"/></svg>',
  bath: S + '<path d="M4 12h16v4.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 4 16.5V12z"/><path d="M6 12V8.5a4.5 4.5 0 0 1 9 0"/><circle cx="18.5" cy="6" r="1.2" fill="currentColor" stroke="none"/><path d="M18.5 4.5V3"/></svg>',
  tea: S + '<path d="M4 5h13v8a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V5z"/><path d="M17 8.5h2.5a2 2 0 0 1 0 4H17"/><path d="M7 20.5h7"/></svg>',
  laundry: S + '<rect x="4" y="2.5" width="16" height="19" rx="2"/><circle cx="12" cy="13" r="4.2"/><path d="M8 6.5h2.6"/></svg>',
  fuel: S + '<path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16"/><path d="M3 21h14"/><path d="M15 11h3.5a2 2 0 0 1 2 2v3.6a2.2 2.2 0 0 1-4.4 0V11"/><path d="M9 7h2M9 11h2"/></svg>',
  route: S + '<circle cx="5.5" cy="18.5" r="2.3"/><circle cx="18.5" cy="5.5" r="2.3"/><path d="M7.5 17C10 13.5 13 10 16 7.5" stroke-dasharray="2.5 3"/></svg>',
  shield: S + '<path d="M12 2.5l7.5 3v5.5c0 5-3.2 9.3-7.5 10.5-4.3-1.2-7.5-5.5-7.5-10.5V5.5l7.5-3z"/><path d="M9 12l2 2 4-4.5"/></svg>',
  chef: S + '<path d="M6.5 20h11"/><path d="M7.5 20v-2.2c0-1.6.4-3 1.4-4.1.9-1 2.2-1.4 3.1-1.4s2.2.4 3.1 1.4c1 1.1 1.4 2.5 1.4 4.1V20"/><path d="M12 12.3V9.8"/><path d="M12 9.8c-2-1.3-4.6.9-5.8 2.2M12 9.8c2-1.3 4.6.9 5.8 2.2"/></svg>',
  family: S + '<circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><circle cx="17.2" cy="10" r="2.4"/><path d="M14.6 14.6a5.3 5.3 0 0 1 5.4 5.4"/></svg>',
  star: F + '<path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"/></svg>',
  pin: F + '<path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>',
  phone: F + '<path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z"/></svg>',
  mail: S + '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3.5 7l8.5 6 8.5-6"/></svg>',
  whatsapp: F + '<path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.297-.497.1-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/></svg>',
  arrow: S + '<path d="M4 12h15M13 6l6 6-6 6"/></svg>',
  check: S + '<path d="M4 12.5l5 5L20 6.5"/></svg>',
  chevL: S + '<path d="M15 5l-7 7 7 7"/></svg>',
  chevR: S + '<path d="M9 5l7 7-7 7"/></svg>',
  close: S + '<path d="M6 6l12 12M18 6L6 18"/></svg>',
  zoom: S + '<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/><path d="M8.5 11h5M11 8.5v5"/></svg>',
  calendar: S + '<rect x="3.5" y="5" width="17" height="16" rx="2"/><path d="M3.5 10h17M8 3v4M16 3v4"/></svg>',
  users: S + '<circle cx="9" cy="8" r="3"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><path d="M16 5.5a3 3 0 0 1 0 5.5M17.5 14.6a5.5 5.5 0 0 1 3.5 5.4"/></svg>',
  diamond: S + '<path d="M6 4h12l4 6-10 10L2 10l4-6z"/><path d="M2 10h20M12 20L8.5 10 12 4l3.5 6L12 20"/></svg>',
  up: S + '<path d="M12 19V5M6 11l6-6 6 6"/></svg>',
  facebook: F + '<path d="M13.5 21v-7h2.4l.4-2.9h-2.8V9.2c0-.8.3-1.4 1.5-1.4h1.4V5.2c-.3 0-1.1-.1-2-.1-2 0-3.4 1.2-3.4 3.5v2.5H8.6V14H11v7h2.5z"/></svg>',
  instagram: S + '<rect x="3.5" y="3.5" width="17" height="17" rx="4.5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"/></svg>',
  youtube: S + '<rect x="2.5" y="6" width="19" height="12" rx="3.5"/><path d="M10.5 9.5l5 2.5-5 2.5z" fill="currentColor" stroke="none"/></svg>',
  direction: S + '<path d="M12 2l4 8h-3v12h-2V10H8l4-8z"/></svg>',
};
function injectIcons(root) {
  (root || document).querySelectorAll("[data-icon]").forEach((el) => {
    const k = el.getAttribute("data-icon");
    if (ICONS[k]) el.innerHTML = ICONS[k];
  });
}

/* ---------- i18n dictionary ---------- */
const I18N = {
  "page.title": { en: "Shri Maha Maya Hotel & Restaurant | Pure Veg Hotel in Pallu, Hanumangarh", hi: "श्री महा माया होटल एण्ड रेस्टोरेंट | पल्लू, हनुमानगढ़ में शुद्ध शाकाहारी होटल" },
  "hero.eyebrow": { en: "Pallu · Hanumangarh · Rajasthan", hi: "पल्लू · हनुमानगढ़ · राजस्थान" },
  "hero.tag": { en: "Rajasthan’s warmth, pure vegetarian hospitality", hi: "राजस्थान की गर्मजोशी, शुद्ध शाकाहारी आतिथ्य" },
  "hero.desc": { en: "A restful stop at Pallu for highway travellers, families and pilgrims — comfortable rooms, an honest pure-veg kitchen and hospitality that feels like home.", hi: "पल्लू में हाईवे यात्रियों, परिवारों और श्रद्धालुओं के लिए सुकून भरा पड़ाव — आरामदायक कमरे, शुद्ध शाकाहारी रसोई और अपनेपन भरा आतिथ्य।" },
  "hero.cta1": { en: "Book Now", hi: "अभी बुक करें" },
  "hero.cta2": { en: "Order Food", hi: "खाना ऑर्डर करें" },
  "hero.seal": { en: "100% Pure Vegetarian Kitchen", hi: "100% शुद्ध शाकाहारी रसोई" },
  "hero.since": { en: "Since 2008 · 18 years of service", hi: "2008 से · सेवा में 18 वर्ष" },
  "nav.home": { en: "Home", hi: "होम" },
  "nav.about": { en: "About", hi: "परिचय" },
  "nav.rooms": { en: "Rooms", hi: "कक्ष" },
  "nav.dining": { en: "Dining", hi: "भोजन" },
  "nav.amenities": { en: "Amenities", hi: "सुविधाएँ" },
  "nav.gallery": { en: "Gallery", hi: "गैलरी" },
  "nav.contact": { en: "Contact", hi: "संपर्क" },
  "nav.book": { en: "Book Now", hi: "बुक करें" },
  "about.kicker": { en: "Our Story", hi: "हमारी कहानी" },
  "about.title": { en: "A home on the highway, the Rajasthani way", hi: "हाईवे पर एक घर — राजस्थानी अंदाज़ में" },
  "about.p1": { en: "At the edge of the highway at Pallu, where the desert road runs towards Hanumangarh, stands Shri Maha Maya — a family-run hotel and restaurant built on one simple promise: treat every guest like a guest of the house.", hi: "पल्लू में हाईवे के किनारे, जहाँ रेगिस्तानी राह हनुमानगढ़ की ओर बढ़ती है, श्री महा माया स्थित है — एक पारिवारिक होटल और रेस्टोरेंट, जो एक सरल वचन पर टिका है: हर अतिथि का स्वागत घर के सदस्य जैसा।" },
  "about.p2": { en: "Our kitchen is 100% pure vegetarian — no eggs, no compromises. Flour from the local mill, desi ghee, spices ground by hand. From a full thali to soft phulkas, kadhi and seasonal greens, every plate tastes like it was cooked for family — because it is.", hi: "हमारी रसोई 100% शुद्ध शाकाहारी है — न अंडा, न कोई समझौता। आटा स्थानीय चक्की का, देसी घी, हाथ से पीसे मसाले। भरपूर थाली से लेकर फुल्के, कढ़ी और मौसमी साग तक — हर थाली का स्वाद घर जैसा, क्योंकि वह घर के लिए ही बनती है।" },
  "about.p3": { en: "Atithi Devo Bhava — the guest is God — is not a slogan on our wall; it is the way we run every room, every table and every early-morning chai.", hi: "अतिथि देवो भव — यह हमारी दीवार पर लिखा नारा नहीं, बल्कि हर कमरे, हर थाली और हर सुबह की चाय में बसी हमारी परंपरा है।" },
  "about.promise.t": { en: "A promise to every guest", hi: "हर अतिथि से एक वादा" },
  "about.promise.d": { en: "Spotless rooms, honest prices and pure-veg food cooked fresh — whether you arrive at noon or midnight.", hi: "साफ़-सुथरे कमरे, पारदर्शी दाम और ताज़ा शुद्ध शाकाहारी भोजन — चाहे आप दोपहर आएँ या आधी रात।" },
  "about.stat1.l": { en: "Guest Rooms", hi: "अतिथि कक्ष" },
  "about.stat2.l": { en: "Dining Seats", hi: "भोजन सीटें" },
  "about.stat3.l": { en: "Years of Service", hi: "सेवा के वर्ष" },
  "about.cap1": { en: "The courtyard", hi: "प्रांगण" },
  "about.cap2": { en: "Our welcome", hi: "हमारा स्वागत" },
  "band.title": { en: "Every journey deserves a rest that feels royal.", hi: "हर यात्रा का हक़ है एक आराम, जो शाही एहसास दे।" },
  "band.text": { en: "Long highway miles end here — with a clean bed, a hot thali and a smile at the door.", hi: "लंबी हाईवे यात्रा की थकान यहीं उतरती है — साफ़ बिस्तर, गरम थाली और दरवाज़े पर मुस्कान के साथ।" },
  "band.btn": { en: "Plan Your Stay", hi: "अपना प्रवास प्लान करें" },
  "rooms.kicker": { en: "Stay With Us", hi: "हमारे साथ ठहरें" },
  "rooms.title": { en: "Rooms that let the highway melt away", hi: "ऐसे कमरे जहाँ सफ़र की थकान उतर जाए" },
  "rooms.lede": { en: "Every room is air-conditioned, spotlessly clean and quietly comfortable — with pure-veg room service just a call away.", hi: "हर कमरा वातानुकूलित, एकदम साफ़ और आरामदायक — और शुद्ध शाकाहारी रूम सर्विस बस एक कॉल दूर।" },
  "rooms.check": { en: "Check Availability", hi: "उपलब्धता देखें" },
  "rooms.from": { en: "from", hi: "से शुरू" },
  "rooms.note": { en: "Rates vary with season and availability. Call or WhatsApp for today’s best price.", hi: "दाम मौसम और उपलब्धता के अनुसार बदलते हैं। आज के सर्वोत्तम दाम के लिए कॉल या व्हाट्सऐप करें।" },
  "r.standard.n": { en: "Standard AC Room", hi: "स्टैण्डर्ड एसी कमरा" },
  "r.standard.m": { en: "Queen bed · Sleeps 2", hi: "क्वीन बेड · 2 व्यक्ति" },
  "r.standard.d": { en: "Simple, spotless and easy on the pocket — a good bed, cool air and a quiet night after a long drive.", hi: "सादा, साफ़ और किफ़ायती — अच्छा बिस्तर, ठंडी हवा और लंबी ड्राइव के बाद चैन की रात।" },
  "r.deluxe.n": { en: "Deluxe AC Room", hi: "डीलक्स एसी कमरा" },
  "r.deluxe.m": { en: "King bed · Sleeps 2", hi: "किंग बेड · 2 व्यक्ति" },
  "r.deluxe.d": { en: "More room to breathe — a writing desk, tea tray, plush bedding and extra care in every corner.", hi: "थोड़ी और राहत — राइटिंग डेस्क, चाय की ट्रे, आरामदायक बिस्तर और हर कोने में अतिरिक्त ध्यान।" },
  "r.family.n": { en: "Family AC Room", hi: "फ़ैमिली एसी कमरा" },
  "r.family.m": { en: "2 Queen beds · Sleeps 4", hi: "2 क्वीन बेड · 4 व्यक्ति" },
  "r.family.d": { en: "Two queen beds, space for the children and all the calm a travelling family needs.", hi: "दो क्वीन बेड, बच्चों के लिए जगह और यात्रा करते परिवार को चाहिए पूरी शांति।" },
  "food.kicker": { en: "Our Kitchen", hi: "हमारी रसोई" },
  "food.title": { en: "Pure vegetarian, cooked with pride", hi: "शुद्ध शाकाहारी, गर्व से परोसा गया" },
  "food.lede": { en: "From a full Rajasthani thali to late-night chai and pakoras — everything is made in our own pure-veg kitchen, fresh for every order.", hi: "राजस्थानी थाली से लेकर रात की चाय-पकौड़े तक — सब कुछ हमारी शुद्ध शाकाहारी रसोई में हर ऑर्डर पर ताज़ा बनता है।" },
  "food.badge": { en: "Chef’s Special", hi: "शेफ़ की सिफ़ारिश" },
  "food.half":  { en: "half", hi: "हाफ" },
  "food.note": { en: "All prices include GST. Menu changes with the season — ask our team about today’s specials.", hi: "सभी दाम GST सहित हैं। मेनू मौसम के अनुसार बदलता है — आज के विशेष व्यंजन के बारे में हमारी टीम से पूछें।" },
  "food.fullmenu": { en: "Get the Full Menu on WhatsApp", hi: "पूरा मेनू व्हाट्सऐप पर माँगें" },
  "gallery.kicker": { en: "Moments", hi: "झलकियाँ" },
  "gallery.title": { en: "A look around Shri Maha Maya", hi: "श्री महा माया की एक झलक" },
  "gallery.lede": { en: "Rooms, the restaurant, the courtyard and the little details that make a highway stop feel like a destination.", hi: "कमरे, रेस्टोरेंट, प्रांगण और वे छोटी बातें जो एक हाईवे पड़ाव को मंज़िल बना देती हैं।" },
  "amen.kicker": { en: "Comforts", hi: "सुविधाएँ" },
  "amen.title": { en: "Everything a road-weary traveller needs", hi: "थके यात्री के लिए हर सुविधा" },
  "amen.lede": { en: "Thoughtful comforts at honest prices — so you can rest, refuel and drive on.", hi: "सोच-समझकर जुटाई सुविधाएँ, सही दाम पर — ताकि आप आराम करें, ईंधन भरें और चल पड़ें।" },
  "amen.a1.t": { en: "Ample Parking", hi: "विशाल पार्किंग" },
  "amen.a1.d": { en: "Easy parking for cars, SUVs and buses, right off the highway.", hi: "कार, एसयूवी और बसों के लिए हाईवे से सटी आसान पार्किंग।" },
  "amen.a2.t": { en: "Pure Veg Kitchen", hi: "शुद्ध शाकाहारी रसोई" },
  "amen.a2.d": { en: "100% vegetarian, no eggs — cooked fresh for every order, day or night.", hi: "100% शाकाहारी, अंडा रहित — दिन हो या रात, हर ऑर्डर ताज़ा बनता है।" },
  "amen.a3.t": { en: "AC Rooms", hi: "वातानुकूलित कक्ष" },
  "amen.a3.d": { en: "Every room air-conditioned, with hot water and modern bathrooms.", hi: "हर कमरा एसी, गर्म पानी और आधुनिक बाथरूम के साथ।" },
  "amen.a4.t": { en: "24×7 Room Service", hi: "24×7 रूम सर्विस" },
  "amen.a4.d": { en: "Chai at 5 am or dinner at midnight — the kitchen never sleeps.", hi: "सुबह 5 बजे चाय या आधी रात का खाना — रसोई कभी नहीं सोती।" },
  "amen.a5.t": { en: "Free Wi-Fi", hi: "निःशुल्क वाई-फ़ाई" },
  "amen.a5.d": { en: "Stay connected in rooms, the lobby and the restaurant.", hi: "कमरों, लॉबी और रेस्टोरेंट में इंटरनेट की सुविधा।" },
  "amen.a7.t": { en: "Laundry Service", hi: "लॉन्ड्री सेवा" },
  "amen.a7.d": { en: "Same-day washing and ironing for long-stay guests.", hi: "लंबे प्रवास के मेहमानों के लिए उसी दिन धुलाई-इस्त्री।" },
  "amen.a8.t": { en: "CCTV & Security", hi: "सीसीटीवी व सुरक्षा" },
  "amen.a8.d": { en: "Round-the-clock security and monitored premises for peace of mind.", hi: "चौबीसों घंटे सुरक्षा और निगरानी — निश्चिंत रहें।" },
  "amen.a9.t": { en: "On the Highway", hi: "हाईवे पर स्थित" },
  "amen.a9.d": { en: "Beside the Indian Oil fuel station at Pallu — fuel up, freshen up, move on.", hi: "पल्लू में इंडियन ऑयल पेट्रोल पंप के पास — ईंधन भरें, तरोताज़ा हों, आगे बढ़ें।" },
  "amen.cta.t": { en: "Need something specific?", hi: "कुछ ख़ास चाहिए?" },
  "amen.cta.d": { en: "Ask us on WhatsApp", hi: "व्हाट्सऐप पर पूछें" },
  "testi.kicker": { en: "Guest Words", hi: "मेहमानों की ज़ुबानी" },
  "testi.title": { en: "What travellers say about us", hi: "यात्री हमारे बारे में क्या कहते हैं" },
  "testi.lede": { en: "Real words from families, pilgrims and highway regulars — as shared on Google.", hi: "परिवारों, श्रद्धालुओं और हाईवे के नियमित मेहमानों के शब्द — गूगल पर साझा किए गए।" },
  "testi.t1": { en: "Stopped here late at night on our way to Hanumangarh. Rooms were spotless, the staff polite, and the hot thali at breakfast was just like home. Easy parking for our Innova too.", hi: "देर रात हनुमानगढ़ जाते हुए यहीं रुके। कमरे एकदम साफ़, स्टाफ़ विनम्र और सुबह की गरम थाली बिल्कुल घर जैसी। इनोवा की पार्किंग भी आसानी से मिली।" },
  "testi.t2": { en: "Travelling with my parents, we needed pure veg food and clean rooms — Maha Maya gave us both. The thali is generous and the ghevar was fresh. Highly recommended for family stops.", hi: "माता-पिता के साथ यात्रा थी, शुद्ध शाकाहारी खाना और साफ़ कमरे चाहिए थे — महा माया ने दोनों दिए। थाली भरपूर और घेवर ताज़ा। परिवार के साथ रुकने के लिए बेहतरीन।" },
  "testi.t3": { en: "Right beside the fuel station, easy to find. Rooms are neat, the AC works well, and the front desk arranged tea at 5 am before our early drive.", hi: "पेट्रोल पंप के ठीक पास, ढूँढना आसान। कमरे साफ़, एसी बढ़िया और सुबह 5 बजे ड्राइव से पहले चाय का इंतज़ाम कर दिया।" },
  "testi.t4": { en: "The staff treated us like family. We were worried about veg options on the highway — here the whole kitchen is pure veg. The children loved the pav bhaji.", hi: "स्टाफ़ ने परिवार जैसा ख़याल रखा। हाईवे पर शुद्ध खाने की चिंता थी — यहाँ पूरी रसोई शाकाहारी है। बच्चों को पाव भाजी बहुत पसंद आई।" },
  "testi.t5": { en: "Good value, clean bathrooms, hot water and a proper thali at a fair price. The staff even helped us plan the road ahead.", hi: "सही दाम में अच्छी सुविधा, साफ़ बाथरूम, गर्म पानी और भरपूर थाली। स्टाफ़ ने आगे के रास्ते की जानकारी देकर भी मदद की।" },
  "testi.t6": { en: "We come every month for the thali. The taste never changes. The new rooms are comfortable and quiet despite being on the highway.", hi: "हम हर महीने थाली खाने आते हैं। स्वाद कभी नहीं बदलता। नए कमरे हाईवे के पास होते हुए भी आरामदायक और शांत हैं।" },
  "testi.meta1": { en: "Google review · Family trip", hi: "गूगल समीक्षा · पारिवारिक यात्रा" },
  "testi.meta2": { en: "Google review · With parents", hi: "गूगल समीक्षा · माता-पिता के साथ" },
  "testi.meta3": { en: "Google review · Business trip", hi: "गूगल समीक्षा · कार्य यात्रा" },
  "testi.meta4": { en: "Google review · Family", hi: "गूगल समीक्षा · परिवार" },
  "testi.meta5": { en: "Google review · Highway stop", hi: "गूगल समीक्षा · हाईवे पड़ाव" },
  "testi.meta6": { en: "Google review · Regular guest", hi: "गूगल समीक्षा · नियमित मेहमान" },
  "testi.review": { en: "Write a Review on Google", hi: "गूगल पर समीक्षा लिखें" },
  "testi.review.note": { en: "Your kind words help fellow travellers find us on the highway.", hi: "आपके शब्द दूसरे यात्रियों को हाईवे पर हम तक पहुँचने में मदद करते हैं।" },
  "testi.rating.lbl": { en: "· 469+ Google reviews", hi: "· 469+ गूगल समीक्षाएँ" },
  "map.open": { en: "Open in Google Maps", hi: "गूगल मैप्स में खोलें" },
  "map.rate": { en: "Rate Us on Google", hi: "गूगल पर रेटिंग दें" },
  "map.load": { en: "Load Interactive Map", hi: "मैप खोलें" },
  "loc.kicker": { en: "Find Us", hi: "हमें कैसे पाएँ" },
  "loc.title": { en: "Easy to find, hard to leave", hi: "ढूँढना आसान, जाने का मन नहीं करता" },
  "loc.p": { en: "We sit right on the highway at Pallu, beside the Indian Oil fuel station — a natural halt for every traveller heading towards Bikaner, Hanumangarh and beyond.", hi: "हम पल्लू में हाईवे पर ही हैं, इंडियन ऑयल पेट्रोल पंप के बगल में — बीकानेर, हनुमानगढ़ और आगे जाने वाले हर यात्री का स्वाभाविक पड़ाव।" },
  "loc.chip1": { en: "Indian Oil fuel station next door", hi: "इंडियन ऑयल पेट्रोल पंप बगल में" },
  "loc.chip2": { en: "On the main highway", hi: "मुख्य हाईवे पर" },
  "loc.chip3": { en: "Bus parking available", hi: "बस पार्किंग उपलब्ध" },
  "loc.directions": { en: "Get Directions", hi: "रास्ता देखें" },
  "loc.call": { en: "Call the Hotel", hi: "होटल को कॉल करें" },
  "contact.kicker": { en: "Book Your Stay", hi: "बुकिंग करें" },
  "contact.title": { en: "We reply within minutes", hi: "हम मिनटों में जवाब देते हैं" },
  "contact.p": { en: "Call, WhatsApp or send the form — our front desk will confirm your room and share today’s best rates.", hi: "कॉल करें, व्हाट्सऐप करें या फ़ॉर्म भेजें — हमारा फ़्रंट डेस्क आपका कमरा कन्फ़र्म करेगा और आज के सर्वोत्तम दाम बताएगा।" },
  "contact.way1.t": { en: "Call us", hi: "कॉल करें" },
  "contact.way1.d": { en: CONFIG.phoneDisplay + " · 24×7 front desk", hi: CONFIG.phoneDisplay + " · 24×7 फ़्रंट डेस्क" },
  "contact.way2.t": { en: "WhatsApp", hi: "व्हाट्सऐप" },
  "contact.way2.d": { en: "Fastest for bookings & menu queries", hi: "बुकिंग और मेनू के सवालों के लिए सबसे तेज़" },
  "contact.way3.t": { en: "Email", hi: "ईमेल" },
  "contact.way3.d": { en: CONFIG.email + " — replies within a day", hi: CONFIG.email + " — एक दिन में जवाब" },
  "form.title": { en: "Booking enquiry", hi: "बुकिंग पूछताछ" },
  "form.sub": { en: "Fill this in and it opens directly in WhatsApp — no waiting, no spam.", hi: "भरते ही यह सीधे व्हाट्सऐप पर खुल जाता है — न इंतज़ार, न स्पैम।" },
  "form.name": { en: "Your name", hi: "आपका नाम" },
  "form.phone": { en: "Phone number", hi: "मोबाइल नंबर" },
  "form.email": { en: "Email (optional)", hi: "ईमेल (वैकल्पिक)" },
  "form.checkin": { en: "Check-in date", hi: "चेक-इन तिथि" },
  "form.checkout": { en: "Check-out date", hi: "चेक-आउट तिथि" },
  "form.guests": { en: "Guests", hi: "व्यक्ति" },
  "form.rooms": { en: "Rooms", hi: "कमरे" },
  "form.message": { en: "Message (optional)", hi: "संदेश (वैकल्पिक)" },
  "form.submit": { en: "Send via WhatsApp", hi: "व्हाट्सऐप से भेजें" },
  "form.err.name": { en: "Please write your name.", hi: "कृपया अपना नाम लिखिए।" },
  "form.err.phone": { en: "Please write a valid 10-digit mobile number.", hi: "कृपया सही 10 अंकों का मोबाइल नंबर लिखिए।" },
  "form.err.dates": { en: "Please choose check-in and check-out dates.", hi: "कृपया चेक-इन और चेक-आउट तारीख़ चुनिए।" },
  "form.popup": { en: "WhatsApp did not open? Tap here to send your enquiry:", hi: "व्हाट्सऐप नहीं खुला? यहाँ दबाकर enquiry भेजिए:" },
  "form.privacy": { en: "Your details are used only to reply to this enquiry and are never sold or shared.", hi: "आपकी जानकारी केवल इस enquiry का जवाब देने के लिए उपयोग होती है — बेची या साझा नहीं की जाती।" },
  "form.note": { en: "Prefer to talk? Call " + CONFIG.phoneDisplay + " — we speak Hindi, English and Punjabi.", hi: "बात करना चाहें? " + CONFIG.phoneDisplay + " पर कॉल करें — हम हिंदी, अंग्रेज़ी और पंजाबी बोलते हैं।" },
  "footer.blurb": { en: "A family-run pure-vegetarian hotel and restaurant on the highway at Pallu — where Rajasthani warmth meets a comfortable bed and an honest thali.", hi: "पल्लू में हाईवे पर एक पारिवारिक शुद्ध शाकाहारी होटल व रेस्टोरेंट — जहाँ राजस्थानी आतिथ्य, आरामदायक बिस्तर और सच्ची थाली मिलती है।" },
  "footer.explore": { en: "Explore", hi: "जानें" },
  "footer.contact": { en: "Contact", hi: "संपर्क" },
  "footer.hours": { en: "Hours", hi: "समय" },
  "footer.h1": { en: "Restaurant: 7:00 am – 11:00 pm", hi: "रेस्टोरेंट: सुबह 7 – रात 11" },
  "footer.h2": { en: "Room service: 24 × 7", hi: "रूम सर्विस: 24 × 7" },
  "footer.h3": { en: "Front desk: 24 × 7", hi: "फ़्रंट डेस्क: 24 × 7" },
  "footer.rights": { en: "© 2026 Shri Maha Maya Hotel & Restaurant. All rights reserved.", hi: "© 2026 श्री महा माया होटल एण्ड रेस्टोरेंट। सर्वाधिकार सुरक्षित।" },
  "footer.credit": { en: "Crafted with ♥ in Rajasthan", hi: "राजस्थान में ♥ से निर्मित" },
  "fab.tip": { en: "Book instantly on WhatsApp", hi: "व्हाट्सऐप पर तुरंत बुक करें" },
};

/* ---------- Language ---------- */
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) { /* storage unavailable */ } },
};
let lang = store.get("mm-lang");
if (!lang) lang = (navigator.language || "").toLowerCase().startsWith("hi") ? "hi" : "en";

function applyLang() {
  document.documentElement.lang = lang === "hi" ? "hi" : "en";
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const k = el.getAttribute("data-i18n");
    if (I18N[k] && I18N[k][lang]) el.textContent = I18N[k][lang];
  });
  document.querySelectorAll("[data-i18n-ph]").forEach((el) => {
    const k = el.getAttribute("data-i18n-ph");
    if (I18N[k] && I18N[k][lang]) el.placeholder = I18N[k][lang];
  });
  const titleKey = I18N["page.title"][lang];
  if (titleKey) document.title = titleKey;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute("content", lang === "hi"
    ? "पल्लू, हनुमानगढ़ (राजस्थान) में हाईवे के किनारे शुद्ध शाकाहारी होटल व रेस्टोरेंट — एसी कमरे, राजस्थानी थाली, बैंक्वेट हॉल। बुकिंग के लिए कॉल करें।"
    : "Pure-vegetarian hotel & restaurant on the highway at Pallu, Hanumangarh (Rajasthan) — AC rooms, Rajasthani thali & warm hospitality. Book now.");
  // language buttons
  document.querySelectorAll(".lang-btn .cur").forEach((b) => { b.textContent = lang === "hi" ? "English" : "हिंदी"; });
  document.dispatchEvent(new CustomEvent("smm:lang", { detail: lang }));
  // re-render menu in the current language
  if (typeof renderMenu === "function") renderMenu();
  // dynamic WhatsApp links
  document.querySelectorAll("[data-wa]").forEach((a) => {
    const en = a.getAttribute("data-wa-en");
    const hi = a.getAttribute("data-wa-hi") || en;
    a.href = waMsg(lang, en, hi);
  });
}
function toggleLang() {
  lang = lang === "en" ? "hi" : "en";
  store.set("mm-lang", lang);
  applyLang();
}
document.querySelectorAll("[data-lang-toggle]").forEach((b) => b.addEventListener("click", toggleLang));

/* ---------- Navbar ---------- */
const nav = document.getElementById("nav");
const onScrollNav = () => nav.classList.toggle("scrolled", window.scrollY > 40);
window.addEventListener("scroll", onScrollNav, { passive: true });
onScrollNav();

const mMenu = document.getElementById("mmenu");
document.querySelectorAll("[data-open-menu]").forEach((b) =>
  b.addEventListener("click", () => { mMenu.classList.add("open"); document.body.style.overflow = "hidden"; })
);
document.querySelectorAll("[data-close-menu]").forEach((b) =>
  b.addEventListener("click", () => { mMenu.classList.remove("open"); document.body.style.overflow = ""; })
);
mMenu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => { mMenu.classList.remove("open"); document.body.style.overflow = ""; })
);

// active section highlight
const secObs = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) {
      document.querySelectorAll(".nav-links a").forEach((a) => {
        a.classList.toggle("active", a.getAttribute("href") === "#" + en.target.id);
      });
    }
  });
}, { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section[id]").forEach((s) => secObs.observe(s));

/* ---------- Hero slider ---------- */
const slides = [...document.querySelectorAll(".hero-slide")];
const dotsWrap = document.getElementById("hero-dots");
let cur = 0, heroTimer;
slides.forEach((_, i) => {
  const b = document.createElement("button");
  b.setAttribute("aria-label", "Slide " + (i + 1));
  b.addEventListener("click", () => goSlide(i));
  dotsWrap.appendChild(b);
});
const dots = [...dotsWrap.children];
function goSlide(i) {
  cur = (i + slides.length) % slides.length;
  slides.forEach((s, j) => s.classList.toggle("active", j === cur));
  dots.forEach((d, j) => d.classList.toggle("active", j === cur));
}
function heroAuto() { clearInterval(heroTimer); heroTimer = setInterval(() => goSlide(cur + 1), 6500); }
document.getElementById("hero-prev").addEventListener("click", () => { goSlide(cur - 1); heroAuto(); });
document.getElementById("hero-next").addEventListener("click", () => { goSlide(cur + 1); heroAuto(); });
goSlide(0); heroAuto();
window.addEventListener("load", () => document.querySelector(".hero").classList.add("loaded"));
setTimeout(() => document.querySelector(".hero").classList.add("loaded"), 600); // safety

/* ---------- Reveal on scroll ---------- */
const revObs = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (en.isIntersecting) { en.target.classList.add("in-view"); revObs.unobserve(en.target); }
  });
}, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
if ("IntersectionObserver" in window) {
  document.querySelectorAll(".reveal").forEach((el) => revObs.observe(el));
} else {
  document.querySelectorAll(".reveal").forEach((el) => el.classList.add("in-view"));
}
// fail-safe: never leave content invisible
setTimeout(() => {
  document.querySelectorAll(".reveal:not(.in-view)").forEach((el) => el.classList.add("in-view"));
}, 2500);

/* ---------- Parallax bands ---------- */
const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pBands = [...document.querySelectorAll("[data-parallax]")];
let ticking = false;
function parallax() {
  if (reduced || window.innerWidth < 920) { pBands.forEach((b) => (b.style.transform = "translateY(0)")); return; }
  const vh = window.innerHeight;
  pBands.forEach((b) => {
    const r = b.parentElement.getBoundingClientRect();
    const off = (r.top + r.height / 2 - vh / 2) * -0.12 * parseFloat(b.dataset.parallax || 1);
    b.style.transform = `translate3d(0, ${off.toFixed(1)}px, 0)`;
  });
  ticking = false;
}
window.addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(parallax); ticking = true; } }, { passive: true });
parallax();

/* ---------- Animated counters ---------- */
const countObs = new IntersectionObserver((entries) => {
  entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target, target = parseInt(el.dataset.count, 10);
    const t0 = performance.now(), dur = 1600;
    const step = (t) => {
      const p = Math.min((t - t0) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))) + (el.dataset.suffix || "");
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
    countObs.unobserve(el);
  });
}, { threshold: 0.6 });
document.querySelectorAll("[data-count]").forEach((el) => countObs.observe(el));

/* ---------- Menu: rendered from menu.js (owner-editable) ---------- */
const menuTabsWrap = document.getElementById("food-tabs");
const menuBodyWrap = document.getElementById("food-tabs-body");
let activeMenuTab = null;
const t = (obj) => (obj && obj[lang]) || (obj && obj.en) || "";

function renderMenu() {
  if (!window.MENU || !menuTabsWrap || !menuBodyWrap) return;
  const tabs = Object.entries(window.MENU);
  if (!activeMenuTab || !window.MENU[activeMenuTab]) activeMenuTab = tabs[0][0];
  menuTabsWrap.innerHTML = "";
  menuBodyWrap.innerHTML = "";

  tabs.forEach(([id, tab]) => {
    const btn = document.createElement("button");
    btn.dataset.tab = id;
    btn.textContent = t(tab.title) || id;
    btn.classList.toggle("active", id === activeMenuTab);
    menuTabsWrap.appendChild(btn);

    const panel = document.createElement("div");
    panel.className = "food-tab" + (id === activeMenuTab ? " active" : "");
    panel.id = id;

    const halfTag = (tb, d) => {
      if (!tb.halfExtra) return "";
      const hp = Math.round(Number(String(d.price).replace(/\D/g, "")) / 2) + tb.halfExtra;
      return `<small class="pr-half"> / ${t(I18N["food.half"])} ₹${hp}</small>`;
    };
    if (tab.featured && tab.featured.length) {
      const feat = document.createElement("div");
      feat.className = "food-featured";
      tab.featured.forEach((d) => {
        const card = document.createElement("article");
        card.className = "dish";
        const badge = d.badge ? '<span class="dish-badge">' + t(I18N["food.badge"]) + '</span>' : "";
        card.innerHTML = `
          <div class="dish-img">
            <div class="dish-ph" data-icon="utensils"></div>
            ${d.img ? `<img src="${d.img}" alt="${t(d.name).replace(/"/g, "&quot;")}" loading="lazy" decoding="async" onerror="this.remove()">` : ""}
            ${badge}
          </div>
          <div class="dish-body">
            <div class="row"><h4>${t(d.name)}</h4><span class="price">${d.price}${halfTag(tab, d)}</span></div>
            ${d.desc ? `<p>${t(d.desc)}</p>` : ""}
          </div>`;
        feat.appendChild(card);
      });
      panel.appendChild(feat);
    }

    if (tab.list && tab.list.length) {
      const ul = document.createElement("ul");
      ul.className = "menu-list";
      tab.list.forEach((it) => {
        const li = document.createElement("li");
        li.innerHTML = `<span class="nm"><i class="veg-dot"></i>${t(it.name)}</span><span class="dots"></span><span class="pr">${it.price}${halfTag(tab, it)}</span>`;
        if (it.img) {
          const th = document.createElement("img");
          th.className = "menu-thumb";
          th.src = it.img; th.alt = t(it.name); th.loading = "lazy"; th.decoding = "async";
          th.onerror = function () { this.remove(); };
          li.insertBefore(th, li.firstChild);
        }
        ul.appendChild(li);
      });
      panel.appendChild(ul);
    }

    menuBodyWrap.appendChild(panel);
  });
  injectIcons(menuBodyWrap);
}

if (menuTabsWrap) {
  menuTabsWrap.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-tab]");
    if (!btn) return;
    activeMenuTab = btn.dataset.tab;
    renderMenu();
  });
}

/* ---------- Lightbox (gallery + room galleries) ---------- */
const lb = {
  el: document.getElementById("lightbox"),
  stage: document.getElementById("lb-stage-img"),
  counter: document.getElementById("lb-counter"),
  caption: document.getElementById("lb-cap"),
  thumbs: document.getElementById("lb-thumbs"),
  info: document.getElementById("lb-room-info"),
  slides: [], idx: 0,
  open(slides, idx, opts = {}) {
    this.slides = slides; this.idx = idx;
    this.info.classList.toggle("hidden", !opts.info);
    if (opts.info) this.info.innerHTML = opts.info;
    this.thumbs.classList.toggle("hidden", slides.length < 2);
    this.thumbs.innerHTML = slides.map((s, i) =>
      `<img src="${s.src}" alt="" class="${i === idx ? "active" : ""}" data-i="${i}" loading="lazy">`).join("");
    this.thumbs.querySelectorAll("img").forEach((im) => im.addEventListener("click", () => this.show(+im.dataset.i)));
    this.el.classList.add("open");
    document.body.style.overflow = "hidden";
    this.show(idx);
  },
  show(i) {
    this.idx = i;
    const s = this.slides[i];
    this.stage.src = s.src;
    this.counter.textContent = this.slides.length > 1 ? String(i + 1).padStart(2, "0") + " / " + String(this.slides.length).padStart(2, "0") : "";
    this.caption.textContent = s.cap || "";
    this.thumbs.querySelectorAll("img").forEach((im, j) => im.classList.toggle("active", j === i));
  },
  next() { this.show((this.idx + 1) % this.slides.length); },
  prev() { this.show((this.idx - 1 + this.slides.length) % this.slides.length); },
  close() { this.el.classList.remove("open"); document.body.style.overflow = ""; this.stage.src = ""; },
};
document.getElementById("lb-close").addEventListener("click", () => lb.close());
document.getElementById("lb-prev").addEventListener("click", () => lb.prev());
document.getElementById("lb-next").addEventListener("click", () => lb.next());
document.getElementById("lightbox").addEventListener("click", (e) => { if (e.target === lb.el) lb.close(); });
document.addEventListener("keydown", (e) => {
  if (!lb.el.classList.contains("open")) return;
  if (e.key === "Escape") lb.close();
  if (e.key === "ArrowRight") lb.next();
  if (e.key === "ArrowLeft") lb.prev();
});

/* gallery masonry items */
document.querySelectorAll("[data-gallery]").forEach((it) => {
  it.addEventListener("click", () => {
    const group = document.querySelectorAll(`[data-gallery="${it.dataset.gallery}"]`);
    const slides = [...group].map((g) => ({ src: g.dataset.full, cap: g.dataset.cap }));
    lb.open(slides, [...group].indexOf(it));
  });
});

/* room galleries: swipeable mini-carousel on card + lightbox */
document.querySelectorAll("[data-room]").forEach((card) => {
  const imgs = JSON.parse(card.dataset.imgs);
  const media = card.querySelector(".room-media");

  const openModal = (startIdx) => {
    const nameKey = card.dataset.i18nName;
    const name = I18N[nameKey][lang];
    const info = `
      <h3>${name} <span style="color:var(--gold)">·</span> <span style="color:var(--gold)">${card.dataset.price}</span></h3>
      <p>${I18N[card.dataset.i18nDesc][lang]}</p>
      <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
        <a class="btn btn-gold btn-sm" target="_blank" rel="noopener"
           href="${waMsg(lang, "Namaste! I would like to check availability for the " + name + " at Shri Maha Maya Hotel, Pallu. Please share today's rates.",
                 "नमस्ते! मैं श्री महा माया होटल, पल्लू में " + name + " की उपलब्धता जानना चाहता/चाहती हूँ। कृपया आज के दाम बताएं।")}">
          <span data-icon="whatsapp" style="width:16px;height:16px;display:inline-flex"></span>
          ${I18N["rooms.check"][lang]}
        </a>
        <a class="btn btn-outline btn-sm" href="tel:+91${CONFIG.phone}">
          <span data-icon="phone" style="width:16px;height:16px;display:inline-flex"></span> ${CONFIG.phoneDisplay}
        </a>
      </div>`;
    lb.open(imgs, startIdx || 0, { info });
    injectIcons(lb.info);
  };

  card.querySelector("[data-open-room]").addEventListener("click", () => openModal(0));

  /* ---- build swipe track from data-imgs ---- */
  media.querySelectorAll("img").forEach((i) => i.remove());
  const track = document.createElement("div");
  track.className = "room-track";
  imgs.forEach((s, i) => {
    const slide = document.createElement("div");
    slide.className = "room-slide";
    const img = document.createElement("img");
    img.src = s.src; img.alt = s.cap || ""; img.loading = "lazy"; img.decoding = "async";
    slide.appendChild(img);
    track.appendChild(slide);
  });
  media.insertBefore(track, media.firstChild);

  let idx = 0;
  let dots = [];
  let countEl = null;
  const update = () => {
    track.style.transform = "translateX(-" + idx * 100 + "%)";
    dots.forEach((d, i) => d.classList.toggle("active", i === idx));
    if (countEl) countEl.textContent = (idx + 1) + " / " + imgs.length;
  };

  if (imgs.length > 1) {
    const dotsWrap = document.createElement("div");
    dotsWrap.className = "room-dots";
    dots = imgs.map((_, i) => {
      const b = document.createElement("button");
      b.setAttribute("aria-label", "Photo " + (i + 1));
      b.addEventListener("click", (e) => { e.stopPropagation(); idx = i; update(); });
      dotsWrap.appendChild(b);
      return b;
    });
    media.appendChild(dotsWrap);

    countEl = document.createElement("span");
    countEl.className = "room-count";
    media.appendChild(countEl);

    const mkNav = (cls, dir) => {
      const b = document.createElement("button");
      b.className = "room-nav " + cls;
      b.setAttribute("data-icon", dir > 0 ? "chevR" : "chevL");
      b.setAttribute("aria-label", dir > 0 ? "Next photo" : "Previous photo");
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        idx = (idx + dir + imgs.length) % imgs.length;
        update();
      });
      media.appendChild(b);
    };
    mkNav("prev", -1);
    mkNav("next", 1);
    injectIcons(media);

    /* ---- swipe engine: pointer events OR touch+mouse fallback ---- */
    let suppressClick = false;
    let dragging = false, sx = 0, sy = 0, moved = false, movedAt = 0;

    const dragStart = (x, y) => {
      dragging = true; moved = false; sx = x; sy = y; movedAt = Date.now();
      track.style.transition = "none";
    };
    const dragMove = (x, y) => {
      if (!dragging) return;
      const dx = x - sx, dy = y - sy;
      if (!moved && Math.abs(dx) > 8 && Math.abs(dx) > Math.abs(dy) * 1.2) moved = true;
      if (moved) {
        track.style.transform = "translateX(calc(" + (-idx * 100) + "% + " + dx + "px))";
      }
      return moved; // caller uses this to decide preventDefault
    };
    const dragEnd = (x) => {
      if (!dragging) return;
      const dx = x - sx;
      const dt = Math.max(1, Date.now() - movedAt);
      const vel = dx / dt; // px per ms (flick detection)
      dragging = false;
      track.style.transition = "";
      if (moved) {
        suppressClick = true;
        if (dx <= -30 || vel <= -0.45) idx = Math.min(imgs.length - 1, idx + 1);
        else if (dx >= 30 || vel >= 0.45) idx = Math.max(0, idx - 1);
      }
      update();
    };
    const dragCancel = () => {
      if (!dragging) return;
      dragging = false; moved = false;
      track.style.transition = "";
      update();
    };

    if (window.PointerEvent) {
      media.addEventListener("pointerdown", (e) => {
        suppressClick = false;
        dragStart(e.clientX, e.clientY);
        if (e.pointerType === "mouse") { try { media.setPointerCapture(e.pointerId); } catch (_) {} }
      });
      media.addEventListener("pointermove", (e) => { dragMove(e.clientX, e.clientY); });
      media.addEventListener("pointerup", (e) => { dragEnd(e.clientX); });
      media.addEventListener("pointercancel", dragCancel);
    } else {
      media.addEventListener("touchstart", (e) => {
        if (e.touches.length !== 1) return;
        suppressClick = false;
        dragStart(e.touches[0].clientX, e.touches[0].clientY);
      }, { passive: true });
      media.addEventListener("touchmove", (e) => {
        if (e.touches.length !== 1) return;
        const movedNow = dragMove(e.touches[0].clientX, e.touches[0].clientY);
        if (movedNow && e.cancelable) e.preventDefault(); // stop page scroll only for horizontal swipe
      }, { passive: false });
      media.addEventListener("touchend", (e) => {
        if (e.changedTouches.length) dragEnd(e.changedTouches[0].clientX);
        else dragCancel();
      });
      media.addEventListener("touchcancel", dragCancel);
      media.addEventListener("mousedown", (e) => { suppressClick = false; dragStart(e.clientX, e.clientY); });
      media.addEventListener("mousemove", (e) => { dragMove(e.clientX, e.clientY); });
      media.addEventListener("mouseup", (e) => { dragEnd(e.clientX); });
      media.addEventListener("mouseleave", dragCancel);
    }

    media.addEventListener("click", (e) => {
      if (suppressClick) { suppressClick = false; return; }
      openModal(idx);
    });
  } else {
    media.addEventListener("click", () => openModal(0));
  }
  update();
});

/* ---------- Testimonials carousel ---------- */
const track = document.getElementById("testi-track");
const tDotsWrap = document.getElementById("testi-dots");
const tCards = [...track.children];
let tAuto;
tCards.forEach((_, i) => {
  const b = document.createElement("button");
  b.setAttribute("aria-label", "Review " + (i + 1));
  b.addEventListener("click", () => { tCards[i].scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" }); });
  tDotsWrap.appendChild(b);
});
const tDots = [...tDotsWrap.children];
function syncDots() {
  const c = Math.round(track.scrollLeft / (tCards[0].getBoundingClientRect().width + 24));
  tDots.forEach((d, i) => d.classList.toggle("active", i === c));
}
track.addEventListener("scroll", syncDots, { passive: true });
function tAutoStart() { clearInterval(tAuto); tAuto = setInterval(() => {
  const max = track.scrollWidth - track.clientWidth;
  track.scrollBy({ left: track.scrollLeft + 10 >= max - 4 ? -max : track.scrollLeft + (tCards[0].getBoundingClientRect().width + 24), behavior: "smooth" });
}, 4200); }
tAutoStart();
track.addEventListener("mouseenter", () => clearInterval(tAuto));
track.addEventListener("mouseleave", tAutoStart);
track.addEventListener("touchstart", () => clearInterval(tAuto), { passive: true });
syncDots();


/* ---------- Booking form → WhatsApp ---------- */
document.getElementById("booking-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const f = e.target;
  const v = (id) => f.querySelector(id).value.trim();
  const errEl = document.getElementById("form-err");
  const fail = (key) => {
    if (errEl) { errEl.textContent = I18N[key] ? I18N[key][lang] : key; errEl.hidden = false; }
    return false;
  };
  if (errEl) errEl.hidden = true;
  if (v("#f-name").length < 2) return fail("form.err.name");
  if (!/^[6-9]\d{9}$/.test(v("#f-phone").replace(/\D/g, "").slice(-10))) return fail("form.err.phone");
  if (!v("#f-checkin") || !v("#f-checkout")) return fail("form.err.dates");
  const lines = [
    "Namaste! 🙏 New booking enquiry — Shri Maha Maya Hotel, Pallu",
    "👤 Name: " + (v("#f-name") || "-"),
    "📞 Phone: " + (v("#f-phone") || "-"),
    "📧 Email: " + (v("#f-email") || "-"),
    "🗓 Check-in: " + (v("#f-checkin") || "-"),
    "🗓 Check-out: " + (v("#f-checkout") || "-"),
    "👥 Guests: " + (v("#f-guests") || "-") + " · Rooms: " + (v("#f-rooms") || "1"),
  ];
  const msg = v("#f-message");
  if (msg) lines.push("📝 " + msg);
  const waUrl = WA_BASE + encodeURIComponent(lines.join("\n"));
  const w = window.open(waUrl, "_blank");
  if (!w) {  /* popup blocked — give a direct tap link instead of losing the enquiry */
    if (errEl) {
      errEl.innerHTML = "";
      const a = document.createElement("a");
      a.href = waUrl; a.target = "_blank"; a.rel = "noopener";
      a.textContent = I18N["form.popup"][lang] + " WhatsApp →";
      errEl.appendChild(a); errEl.hidden = false;
    }
  }
});

/* ---------- Map: click-to-load (fast on mobile, never looks empty) ---------- */
const locMapEl = document.getElementById("loc-map");
const mapStaticEl = document.getElementById("map-static");
const mapIframe = document.getElementById("map-iframe");
if (locMapEl && mapIframe) {
  const loadMap = () => {
    if (!mapIframe.getAttribute("src") && mapIframe.dataset.src) mapIframe.src = mapIframe.dataset.src;
    mapIframe.classList.remove("hidden");
    locMapEl.classList.add("map-on");
  };
  if (mapStaticEl) mapStaticEl.addEventListener("click", loadMap);
  const mapLoadBtn = document.getElementById("map-load");
  if (mapLoadBtn) mapLoadBtn.addEventListener("click", (e) => { e.stopPropagation(); loadMap(); });
}

/* ---------- Back to top ---------- */
const fabTop = document.getElementById("fab-top");
window.addEventListener("scroll", () => fabTop.classList.toggle("show", window.scrollY > 900), { passive: true });
fabTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

/* ---------- Footer year ---------- */
document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- Boot ---------- */
injectIcons();
applyLang();
