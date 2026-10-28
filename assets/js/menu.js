/* ============================================================
   श्री महा माया — असली मेनू (मालिक का मेनू)
   ------------------------------------------------------------
   ▪ Price बदलना: सिर्फ "₹..." बदल दें
   ▪ नया item जोड़ना: किसी भी list में नई line लिखें (कोमा न भूलें)
   ▪ Item हटाना: उसकी पूरी line delete कर दें
   ▪ featured = बड़े photo-card में दिखेगा, list = नीचे की सूची में
   ▪ photo बदलनी हो तो "img:" वाली line बदलें; photo नहीं है तो
     img वाली line हटा दें (सुनहरा चिह्न दिखेगा)
   ============================================================ */
window.MENU = {
  /* ---------- टैब 1: थाली स्पेशल ---------- */
  "tab-thali": {
    title: { en: "Thali Special", hi: "थाली स्पेशल" },
    featured: [
      {
        name: { en: "Thali", hi: "थाली" },
        price: "₹140", badge: true, hit: true,
        img: "images/food/food-thali.webp",
        desc: { en: "Dal, sabji, roti, dahi and salad — everything on one platter.", hi: "दाल, सब्ज़ी, रोटी, दही और सलाद — सब कुछ एक थाली में।" }
      }
    ],
    list: []
  },

  /* ---------- टैब 2: पनीर आइटम ---------- */
  "tab-paneer": {
    title: { en: "Paneer Items", hi: "पनीर आइटम" },
    /* हाफ पortion: आधा दाम + इतने extra (owner बदल सकते हैं) */
    halfExtra: 20,
    featured: [
      {
        name: { en: "Kadhai Paneer", hi: "कड़ाही पनीर" },
        price: "₹250", badge: true, hit: true,
        img: "images/food/food-paneer.webp",
        desc: { en: "Paneer tossed with capsicum, onion and kadhai masala — spicy, rich and made to order.", hi: "शिमला मिर्च, प्याज़ और कड़ाही मसाले में पका पनीर — तीखा, भरपूर और ऑर्डर पर ताज़ा।" }
      },
      {
        name: { en: "Shahi Paneer", hi: "शाही पनीर" },
        price: "₹230", badge: true, hit: true,
        img: "images/food/food-shahi-paneer.webp",
        desc: { en: "Rich, creamy and mildly sweet — a royal favourite with soft paneer.", hi: "मलाईदार, हल्की मीठी और शाही — नरम पनीर के साथ।" }
      },
      {
        name: { en: "Kaju Curry", hi: "काजू करी" },
        price: "₹280", hit: true,
        img: "images/food/food-kaju-curry.webp",
        desc: { en: "A rich cashew-gravy special — smooth, fragrant and worth every bite.", hi: "काजू की भरपूर ग्रेवी — मख़मली, खुशबूदार और हर निवाले के लायक।" }
      }
    ],
    list: [
      { name: { en: "Malai Kofta", hi: "मलाई कोफ्ता" }, price: "₹250", img: "images/food/food-malai-kofta.webp", hit: true },
      { name: { en: "Paneer Bhurji", hi: "पनीर भुर्जी" }, price: "₹240", img: "images/food/food-paneer-bhurji.webp", hit: true },
      { name: { en: "Matar Paneer", hi: "मटर पनीर" }, price: "₹210" },
      { name: { en: "Mix Veg Paneer", hi: "मिक्स वेज पनीर" }, price: "₹190", img: "images/food/food-mixveg-paneer.webp" },
      { name: { en: "Palak Paneer", hi: "पालक पनीर" }, price: "₹190", hit: true }
    ]
  },

  /* ---------- टैब 3: मसाला आइटम ---------- */
  "tab-masala": {
    title: { en: "Masala Items", hi: "मसाला आइटम" },
    /* हाफ portion: आधा दाम + इतने extra (owner बदल सकते हैं) */
    halfExtra: 10,
    featured: [
      {
        name: { en: "Dal Fry", hi: "दाल फ्राई" },
        price: "₹100", hit: true,
        img: "images/food/food-daltadka.webp",
        desc: { en: "Yellow dal tempered with ghee, garlic, cumin and red chillies.", hi: "घी, लहसुन, जीरे और लाल मिर्च की तड़के वाली दाल।" }
      },
      {
        name: { en: "Aloo Chola", hi: "आलू छोला" },
        price: "₹100", hit: true,
        img: "images/food/food-chole.webp",
        desc: { en: "Chickpeas and potatoes simmered in a hearty spiced gravy.", hi: "मसालेदार ग्रेवी में पके छोले और आलू।" }
      }
    ],
    list: [
      { name: { en: "Cheese Tomato", hi: "चीज़ टमाटर" }, price: "₹230", hit: true },
      { name: { en: "Shahi Gatta", hi: "शाही गट्टा" }, price: "₹180", hit: true },
      { name: { en: "Sev Malai", hi: "सेव मलाई" }, price: "₹180" },
      { name: { en: "Sev Bhaji", hi: "सेव भाजी" }, price: "₹120" },
      { name: { en: "Masala Bhindi", hi: "मसाला भिण्डी" }, price: "₹140" },
      { name: { en: "Tinda Tomato", hi: "टिण्डा टमाटर" }, price: "₹110" },
      { name: { en: "Kadhi", hi: "कढ़ी" }, price: "₹120", hit: true },
      { name: { en: "Dal Makhani", hi: "दाल मक्खनी" }, price: "₹150", hit: true },
      { name: { en: "Lahsun Chutney", hi: "लहसून चटनी" }, price: "₹150", img: "images/food/food-lahsun-chutney.webp", hit: true }
    ]
  },

  /* ---------- टैब 4: दही व चावल ---------- */
  "tab-dahichawal": {
    title: { en: "Dahi & Rice", hi: "दही व चावल" },
    featured: [
      {
        name: { en: "Sweet Lassi", hi: "लस्सी मीठी" },
        price: "₹50", hit: true,
        img: "images/food/food-lassi.webp",
        desc: { en: "Thick, chilled and topped with malai.", hi: "गाढ़ी, ठंडी, मलाईदार लस्सी।" }
      }
    ],
    list: [
      { name: { en: "Plain Dahi", hi: "प्लेन दही" }, price: "₹50" },
      { name: { en: "Veg Raita", hi: "वेज रायता" }, price: "₹90" },
      { name: { en: "Veg Pulao", hi: "वेज पुलाव" }, price: "₹120" },
      { name: { en: "Green Salad", hi: "ग्रीन सलाद" }, price: "₹60" }
    ]
  },

  /* ---------- टैब 5: रोटी व परांठा ---------- */
  "tab-roti": {
    title: { en: "Roti & Parantha", hi: "रोटी व परांठा" },
    featured: [],
    list: [
      { name: { en: "Mix Veg Parantha", hi: "मिक्स वेज परांठा" }, price: "₹90" },
      { name: { en: "Paneer Parantha", hi: "पनीर परांठा" }, price: "₹110", hit: true },
      { name: { en: "Tawa Roti", hi: "तवा रोटी" }, price: "₹12" },
      { name: { en: "Missi Roti", hi: "मिस्सी रोटी" }, price: "₹30" },
      { name: { en: "Pyaaz Roti", hi: "प्याज़ रोटी" }, price: "₹40" },
      { name: { en: "Masala Papad", hi: "मसाला पापड़" }, price: "₹80" }
    ]
  },

  /* ---------- टैब 6: फास्ट फूड ---------- */
  "tab-fastfood": {
    title: { en: "Fast Food", hi: "फास्ट फूड" },
    featured: [
      {
        name: { en: "Pyaaz Pakora", hi: "प्याज़ पकौड़ा" },
        price: "₹150", hit: true,
        img: "images/food/food-pakora.webp",
        desc: { en: "Crisp onion fritters fried fresh — best with chutney and chai.", hi: "ताज़ा तली कुरकुरी प्याज़ की पकौड़ियाँ — चटनी और चाय के साथ सर्वोत्तम।" }
      },
      {
        name: { en: "Chai", hi: "चाय" },
        price: "₹15", hit: true,
        img: "images/food/food-chai.webp",
        desc: { en: "Strong, milky and made the highway way.", hi: "कड़क, मलाईदार — हाईवे वाली चाय।" }
      }
    ],
    list: [
      { name: { en: "Maggi Plain", hi: "मैगी प्लेन" }, price: "₹70" },
      { name: { en: "Coffee", hi: "कॉफ़ी" }, price: "₹25" }
    ]
  }
};
