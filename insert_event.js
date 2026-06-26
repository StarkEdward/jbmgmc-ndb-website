const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data', 'news_events.json');
const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));

const newItem = {
  id: Date.now(),
  title: "🩸 BLOOD DONATION CAMP 🩸 On the Occasion of Doctors' Day",
  date: "2026-06-30",
  description: "MARD (Maharashtra Association of Resident Doctors), Jannayak Birsa Munda Government Medical College Nandurbar cordially invites all eligible students, interns, resident doctors, faculty members and staff to participate in the Blood Donation Camp.",
  type: "event",
  showInBanner: true,
  isUrgent: true,
  showInPopup: true,
  popupType: "important",
  popupStartDate: "2026-06-26",
  popupEndDate: "2026-06-30",
  fullArticle: `On the Occasion of Doctors' Day

MARD (Maharashtra Association of Resident Doctors), Jannayak Birsa Munda Government Medical College Nandurbar cordially invites all eligible students, interns, resident doctors, faculty members and staff to participate in the Blood Donation Camp.

📅 Date: 30/06/2026 (Tuesday)
🕙 Time: 10:00 AM – 4:00 PM
📍 Venue: Blood Bank, Jannayak Birsa Munda Government Medical College, Nandurbar

📝 Registration:
Kindly register by scanning the QR code provided in the poster. If the QR code does not work on your device please register using the link below:

🔗 Registration Link:
https://forms.gle/LdgYCD4Lzkwvs9hDA

Eligibility:
• 18 – 65 years
• Weight at least 50 kg
• Hemoglobin above 12.5 g/dl
• In good health

Why Donate Blood?
✔ Saves lives in emergencies
✔ Helps patients in surgeries, accidents & thalassemia
✔ Regular donation improves heart health
✔ It's safe, quick & selfless

🩸 Every unit of blood donated can help save multiple lives. Be a hero—donate blood and make a difference. Every Drop Counts. Be Someone's Reason to Live.

Organized by:
MARD – Maharashtra Association of Resident Doctors
Jannayak Birsa Munda Government Medical College, Nandurbar.`
};

// Add to the front of the list
data.newsEvents.unshift(newItem);

fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
console.log("Successfully added Blood Donation Camp event!");
