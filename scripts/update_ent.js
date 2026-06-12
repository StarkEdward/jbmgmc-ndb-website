const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/db.json');
let db = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const deptIndex = db.departments.findIndex(d => d.id === 'ent');

if (deptIndex !== -1) {
  const dept = db.departments[deptIndex];
  
  dept.doctors = [
    {
      name: "Dr. Sunil Khot",
      designation: "Associate Professor",
      qualification: "MBBS, MS ENT",
      regNo: "2010/03/0487",
      experience: "Associate Professor GMC Nandurbar since 17/02/2025. Previously Assistant Professor GMC Miraj. Lectures: 5/year (Anatomy of Ear and nose, Tinnitus, Nasal Polyps)"
    },
    {
      name: "Dr. Anil Jatal",
      designation: "Assistant Professor",
      qualification: "MBBS, MS ENT",
      regNo: "2015/08/4458",
      experience: "Assistant Professor GMC Nandurbar since 09/12/2022. Previously Senior Resident/Asst Prof SBHGMC Dhule & VD GMC Latur. Lectures: 40/year (CSOM, Otitis Externa, Epistaxis, FB-ENT, Hearing aid, Tonsillitis, FESS)"
    },
    {
      name: "Dr. Harshala Valvi",
      designation: "Senior Resident",
      qualification: "MBBS, MS ENT",
      regNo: "2012/07/2178",
      experience: "Senior Resident GMC Nandurbar since 11/10/2021. Previously Junior Resident GMC Latur. Lectures: 5/year (DNS, ASOM, OME, CT PNS)"
    }
  ];

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
  console.log("ENT updated successfully with lectures.");
} else {
  console.log("ENT department not found.");
}
