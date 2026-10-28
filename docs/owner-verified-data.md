# Owner-Verified Business Data (recorded 2026-10-25)
Ye sab jaankari **owner ne khud confirm ki** — isi se `assets/js/knowledge.js` bhara gaya hai.
Koi bhi badlav ho to knowledge.js update karein aur `?v=` bump karein.

| # | Sawaal | Owner ka jawab | Bot me kahan |
|---|---|---|---|
| 1 | Check-in / check-out | Check-in: kabhi bhi (24×7) · Check-out: 11:00 AM | KB.checkInTime/checkOutTime |
| 2 | Occupancy (Std/Dlx/Fam) | 2–3 / 2–3 / 3–4 mehmaan | KB.rooms[].occupancy |
| 3 | Daam basis | Per room (per person nahi) | KB.priceBasis |
| 4 | Breakfast included? | Nahi — alag hai | KB.breakfastIncluded=false |
| 5 | Extra bed | ₹200 | KB.extraBed |
| 6 | ID proof | Aadhaar / DL / Voter ID | KB.idProofs |
| 7 | Kitchen timing | Subah 6:00 – raat 1:30 | KB.hours.restaurant |
| 8 | Jain food | Haan milta hai | KB.policies.jain |
| 9 | Home delivery | Nahi (parcel/takeaway haan) | KB.policies.homeDelivery |
| 10 | Payment | Cash + UPI | KB.policies.payment |
| 11 | Advance / cancellation | Advance: half ya usse zyada · Cancel within 20–30 min = full refund | KB.policies.advance/cancellation |
| 12 | Offers | "Not confirmed" → koi offer bot nahi bolega | KB.offers=[] |
| 13 | Pets | Haan allowed | KB.policies.pets |
| 14 | Rating badge | Jo hai wahi sahi (JustDial 4.2★/469) | KB.hotel.rating |
| 15 | Driver/staff stay | Nahi hai | KB.policies.driverStay |

| 16 | Room facilities (Standard) | AC, attached bathroom, geyser, room service | KB.rooms[standard] |
| 17 | Room facilities (Deluxe) | AC, attached bathroom, geyser, room service, balcony | KB.rooms[deluxe] |
| 18 | Room facilities (Family) | AC, attached bathroom, geyser, room service, table-chairs, 2 beds | KB.rooms[family] |

| 19 | Half portions (26-Oct-2026) | Paneer items: half = आधा दाम + ₹20; Masala items: half = आधा दाम + ₹10; baaki tabs me half nahi | menu.js `halfExtra` (20/10) |

**Ab sirf 1 cheez pending hai:** discounts/festive/group offers — jab owner confirm karein tab KB.offers me likhein.
(TV/Wi-Fi rooms me claim NAHI karte — owner ki list me nahi the; hotel-level Wi-Fi amenity site par bani hai.)
