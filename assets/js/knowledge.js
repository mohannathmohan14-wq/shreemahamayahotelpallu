/* =====================================================================
   श्री महा माया होटल — BUSINESS KNOWLEDGE BASE (AI Sales Agent ka dimaag)
   ---------------------------------------------------------------------
   ✅ MALIK (owner) ke liye: is file me sirf SACHHI jaankari rakhein.
   - Menu ke DAAM yahan NAHI likhte — agent menu.js se padhta hai.
   - File badalne ke baad index.html me knowledge.js?v=N badha dein.
   ✔ Sabhi facts owner-confirm hain (25 Oct 2026 ko owner ne bataye).
   ===================================================================== */
window.KB = {
  hotel: {
    name: "Shri Maha Maya Hotel & Restaurant",
    nameHi: "श्री महा माया होटल एवं रेस्टोरेंट",
    tagline: "Rajasthan's warmth, pure vegetarian hospitality",
    taglineHi: "राजस्थान की अपनी गर्माहट, शुद्ध शाकाहारी मेहमाननवाज़ी",
    sinceYear: 2008,            // verified: owner (18 saal ka anubhav)
    pureVeg: true,              // verified: owner — 100% pure veg
    roomsTotal: 10,             // verified: owner
    languages: ["Hindi", "English", "Punjabi"],
    rating: { score: 4.2, count: 469, source: "JustDial listing" }, // verified: owner ("ye hi hai")
  },

  contact: {
    phonePrimary: "+91 99505 01306",  phonePrimaryRaw: "9950501306",
    phoneSecondary: "+91 96604 01306", phoneSecondaryRaw: "9660401306",
    whatsapp: "919950501306",
    email: "shreemahamayahotel@gmail.com",
    address: "Main Highway, near Indian Oil Fuel Station, Pallu, Hanumangarh, Rajasthan 335522",
    addressHi: "मेन हाईवे, इंडियन ऑयल फ्यूल स्टेशन के पास, पल्लू, हनुमानगढ़, राजस्थान 335522",
    coords: { lat: 28.938974, lng: 74.216543 },
    mapsListing: "https://www.google.com/maps/place/?q=place_id:0x3915cb5560ab22f7:0xd98ef3784c89800d",
    directions: "https://www.google.com/maps/dir/?api=1&destination=28.938974,74.216543",
  },

  rooms: [
    { id: "standard", name: "Standard AC", nameHi: "स्टैंडर्ड एसी", price: 1000,
      occupancy: { en: "2–3 guests", hi: "2–3 मेहमान" },
      facilities: ["Air conditioning", "Attached bathroom", "Geyser (hot water)", "Room service"],
      facilitiesHi: ["एयर कंडीशनिंग", "अटैच्ड बाथरूम", "गीज़र (गर्म पानी)", "रूम सर्विस"] },
    { id: "deluxe", name: "Deluxe AC", nameHi: "डीलक्स एसी", price: 1200,
      occupancy: { en: "2–3 guests", hi: "2–3 मेहमान" },
      facilities: ["Air conditioning", "Attached bathroom", "Geyser (hot water)", "Room service", "Balcony"],
      facilitiesHi: ["एयर कंडीशनिंग", "अटैच्ड बाथरूम", "गीज़र (गर्म पानी)", "रूम सर्विस", "बालकनी"] },
    { id: "family", name: "Family AC", nameHi: "फैमिली एसी", price: 1400,
      occupancy: { en: "3–4 guests", hi: "3–4 मेहमान" },
      facilities: ["Air conditioning", "Attached bathroom", "Geyser (hot water)", "Room service", "Table & chairs", "2 beds"],
      facilitiesHi: ["एयर कंडीशनिंग", "अटैच्ड बाथरूम", "गीज़र (गर्म पानी)", "रूम सर्विस", "टेबल-कुर्सी", "2 बेड"] },
  ],
  priceBasis: { en: "Prices are per room (not per person).", hi: "दााम प्रति कमरा हैं (व्यक्ति प्रति नहीं)।" },
  checkInTime:  { en: "Any time — front desk is open 24×7", hi: "कभी भी — फ्रंट डेस्क 24×7 खुला है" },
  checkOutTime: { en: "11:00 AM", hi: "सुबह 11:00 बजे" },
  extraBed:     { price: 200, en: "Extra bed: ₹200", hi: "अतिरिक्त बेड: ₹200" },
  idProofs:     ["Aadhaar", "Driving Licence", "Voter ID"],
  breakfastIncluded: false,   // verified: naashta alag hai, room rate me nahi

  hours: {
    frontDesk: "24×7",  frontDeskHi: "24×7 खुला",
    restaurant: "6:00 AM – 1:30 AM", restaurantHi: "सुबह 6:00 बजे से रात 1:30 बजे तक",
    roomService: "24×7", roomServiceHi: "24×7",
  },

  amenities: [
    { en: "Free parking", hi: "मुफ़्त पार्किंग" },
    { en: "AC rooms", hi: "एसी कमरे" },
    { en: "Wi-Fi", hi: "वाई-फ़ाई" },
    { en: "24×7 room service", hi: "24×7 रूम सर्विस" },
    { en: "100% pure veg kitchen", hi: "100% शुद्ध शाकाहारी रसोई" },
    { en: "Jain food available", hi: "जैन भोजन उपलब्ध" },
    { en: "Pets allowed", hi: "पेट्स की अनुमति" },
    { en: "Highway location near fuel station", hi: "हाईवे पर, फ्यूल स्टेशन के पास" },
    { en: "Family friendly", hi: "पारिवारिक माहौल" },
  ],

  policies: {
    pureVeg: "100% pure vegetarian — no egg, no meat, no alcohol on the premises.",
    pureVegHi: "100% शुद्ध शाकाहारी — अंडा, मांस या शराब नहीं।",
    jain: { en: "Jain food is available — just tell us while ordering.", hi: "जैन भोजन उपलब्ध है — ऑर्डर करते समय बता दीजिए।" },
    payment: { en: "We accept Cash and UPI.", hi: "नकद और UPI स्वीकार है।" },
    paymentModes: ["Cash", "UPI"],
    advance: { en: "Half (or more) of the room tariff is paid in advance at booking.", hi: "बुकिंग पर आधा (या उससे अधिक) किराया अग्रिम देना होता है।" },
    cancellation: { en: "Cancel within 20–30 minutes of booking for a complete refund; later than that please talk to staff.", hi: "बुकिंग के 20–30 मिनट के भीतर रद्द करने पर पूरा रिफ़ंड; उसके बाद स्टाफ़ से बात कीजिए।" },
    pets: { en: "Yes, pets are allowed.", hi: "जी हाँ, पेट्स की अनुमति है।" },
    homeDelivery: { en: "No home delivery — parcel/takeaway is available at the restaurant.", hi: "होम डिलीवरी नहीं — पार्सल/टेकअवे रेस्टोरेंट से मिलता है।" },
    driverStay: { en: "Separate driver/staff accommodation is not available.", hi: "ड्राइवर/स्टाफ़ के लिए अलग ठहराव उपलब्ध नहीं है।" },
  },

  offers: [],   // verified: owner — koi confirmed offer nahi ("not confirmed")

  faq: [
    { q: "Do you serve non-veg or egg?", qHi: "क्या नॉन-वेज या अंडा मिलता है?",
      a: "No. We are a 100% pure vegetarian hotel and restaurant — no egg, meat or alcohol.",
      aHi: "नहीं। हम 100% शुद्ध शाकाहारी होटल एवं रेस्टोरेंट हैं — अंडा, मांस या शराब नहीं।" },
    { q: "Where exactly are you located?", qHi: "आपकी लोकेशन कहाँ है?",
      a: "On the main highway near the Indian Oil fuel station, Pallu, Hanumangarh (Rajasthan) 335522. Tap Location on the site for the exact pin.",
      aHi: "मेन हाईवे पर, इंडियन ऑयल फ्यूल स्टेशन के पास, पल्लू, हनुमानगढ़ (राजस्थान) 335522। साइट पर Location दबाइए — सटीक पिन मिल जाएगा।" },
    { q: "Is parking available?", qHi: "पार्किंग है?",
      a: "Yes, free parking at the hotel.",
      aHi: "जी हाँ, होटल पर मुफ़्त पार्किंग है।" },
    { q: "Do you deliver or parcel food?", qHi: "खाना पार्सल या डिलीवरी होती है?",
      a: "No home delivery. Parcel/takeaway is available at the restaurant (6:00 AM – 1:30 AM).",
      aHi: "होम डिलीवरी नहीं। रेस्टोरेंट से पार्सल/टेकअवे मिलता है (सुबह 6:00 – रात 1:30)।" },
    { q: "Which ID is needed at check-in?", qHi: "चेक-इन पर कौन-सी आईडी लगती है?",
      a: "Any one government photo ID: Aadhaar, Driving Licence or Voter ID.",
      aHi: "कोई एक सरकारी फोटो आईडी: आधार, ड्राइविंग लाइसेंस या वोटर आईडी।" },
    { q: "Is breakfast included in room rent?", qHi: "क्या नाश्ता कमरे के किराए में है?",
      a: "No, breakfast is separate — the restaurant serves it from 6:00 AM.",
      aHi: "नहीं, नाश्ता अलग है — रेस्टोरेंट में सुबह 6:00 बजे से मिलता है।" },
  ],

  /* Ab sirf ye bacha hai owner-confirmation ke liye: */
  needsOwnerVerification: [
    "Discounts / festive / group offers (owner: 'not confirmed' — jab confirm ho tab yahan likhein)",
  ],
};
