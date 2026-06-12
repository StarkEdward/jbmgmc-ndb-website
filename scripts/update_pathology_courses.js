const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/db.json');
let db = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const pathologyIndex = db.departments.findIndex(d => d.id === 'pathology');

if (pathologyIndex !== -1) {
  const pathology = db.departments[pathologyIndex];
  
  if (!pathology.fullDescription.includes("The faculty have presented their work")) {
    pathology.fullDescription += " The faculty have presented their work at various national and international conferences and also published in scientific journals.";
  }

  pathology.courses = [
    {
      courseName: "MBBS",
      intake: "100/year"
    }
  ];

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
  console.log("Pathology courses and overview updated successfully.");
} else {
  console.log("Pathology department not found.");
}
