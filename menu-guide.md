# 🍽️ Menu Badalne Ka Tarika — Step by Step

Menu ki saari cheezein ek hi file me hain:
**`assets/js/menu.js`**

## Step 1 — File kholo
Computer ya laptop pe `menu.js` ko kisi bhi text editor me kholo:
- **Notepad** (Windows) — file pe right-click → "Open with" → Notepad
- **TextEdit** (Mac)
- Phone pe bhi khol sakte ho (kisi bhi code editor app se)

## Step 2 — Price badalna
Har item ke saath `price` likha hota hai:

```
{ name: { en: "Rajasthani Thali", hi: "राजस्थानी थाली" }, price: "₹199" },
```

Price badalna hai toh sirf `"₹199"` ko badlo, jaise:

```
{ name: { en: "Rajasthani Thali", hi: "राजस्थानी थाली" }, price: "₹250" },
```

⚠️ **Rules:**
- `₹` ka chinh zaroor rakho
- Quotes `"..."` ke andar hi likho
- Line ke aakhir me comma `,` rakhna (aakhri item me optional hai)

## Step 3 — Naya item add karna
Kisi bhi `list:` ke andar nayi line likh do:

```
list: [
  { name: { en: "Ker Sangri", hi: "केर सांगरी" }, price: "₹149" },
  { name: { en: "Naya Item", hi: "नया आइटम" }, price: "₹120" },
]
```

- `en:` me English naam, `hi:` me Hindi naam
- **Featured** (bade photo wale card) me add karna ho toh wahan photo bhi chahiye — photo `images/food/` folder me daalo aur `img: "images/food/photo-ka-naam.webp"` likho
- Photo nahi hai toh `img` wali line mat likho — wahan apne aap sundar sona (gold) chihn dikhega, khali nahi

## Step 4 — Item hatana
Uski **poori line** delete kar do (shuru ke `{` se aakhri `},` tak).

## Step 5 — Save karo
File save karo (Ctrl+S) → site refresh karo → menu update ho jayega.

---

## Common Mistakes ⚠️

| Galti | Kya hoga | Sahi |
|---|---|---|
| Comma `,` bhool gaye | Menu dikhna band | Har line ke aakhir me comma rakho |
| `₹` nahi likha | Price bina chinh ke dikhega | `"₹120"` likho |
| Quotes `"` hat gaye | Menu nahi dikhega | Naam price dono quotes me |

---

## Aasan Tarika (agar file nahi badalna chahte)

Apna **asli menu** (items + price) mujhe WhatsApp/chat me bhej do — main khud update kar dunga, 5 minute ka kaam hai. Format aisa:

```
Thali - 200
Dal Baati - 150
Paneer - 180
...
```

---

## Photos Badalna
- Nayi photo `images/food/` folder me daalo (naam me spaces nahi, jaise `food-thali2.webp`)
- `menu.js` me us dish ki `img: "..."` line me naya naam likho
- Photo ka size 1200px se bada ho toh pehle compress kar lena (www.squoosh.app se, WebP format best)
