const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/db.json');
let db = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const deptIndex = db.departments.findIndex(d => d.id === 'orthopedics');

if (deptIndex !== -1) {
  const dept = db.departments[deptIndex];
  
  dept.doctors = [
    {
      name: "Dr. Joti Bagul",
      designation: "Professor & HOD",
      qualification: "MBBS, MS Orthopedics",
      regNo: "2000/00/0741",
      experience: "Professor GMC Nandurbar since 08/01/2024. Previously Professor GMC Jalgaon, Associate Professor SBHGMC Dhule. Lectures: 1) Fracture distal end radius 2) shoulder dislocation type: classification & reduction technique 3) fracture fore arm bans"
    },
    {
      name: "Dr. Mahesh Mutha",
      designation: "Associate Professor",
      qualification: "MBBS, MS Orthopedics",
      regNo: "8166",
      experience: "Associate Professor GMC Nandurbar since 22/08/2023. Previously Associate/Assistant Professor SBHGMC Dhule. Lectures: 1) Supracondylar fracture lower in children 2) intertrochanteric fracture femur clinical feature investigation & treatment 3) intracapsular fracture neck femur activity classification investigation 4) intracapsular fracture femur treatment in various age groups"
    },
    {
      name: "Dr. Yogendra Nehete",
      designation: "Assistant Professor",
      qualification: "MBBS, MS Orthopedics",
      regNo: "2002031217",
      experience: "Assistant Professor GMC Nandurbar since 11/07/2024. Previously Assistant Professor/Senior Resident GMC Jalgaon. Lectures: 1) Prolapse intervertebral disc Spine 2) Fracture around distal Radius"
    },
    {
      name: "Dr. Abhijit Mahajan",
      designation: "Senior Resident",
      qualification: "MBBS, MS Orthopedics",
      regNo: "2018/08/4299",
      experience: "Senior Resident GMC Nandurbar since 06/10/2023. Previously Junior Resident SKN MC GH Pune."
    },
    {
      name: "Dr. Dilip Bassi",
      designation: "Junior Resident",
      qualification: "MBBS, MS Orthopedics",
      regNo: "2017/06/2382",
      experience: "Junior Resident GMC Nandurbar since 20/06/2023. Previously Junior Resident GMC Akola & K.B.B.H Municipal Hospital Kurla."
    }
  ];

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
  console.log("Orthopedics updated successfully.");
} else {
  console.log("Orthopedics department not found.");
}
