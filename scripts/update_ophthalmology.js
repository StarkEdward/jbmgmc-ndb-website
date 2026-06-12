const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/db.json');
let db = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const deptIndex = db.departments.findIndex(d => d.id === 'ophthalmology');

if (deptIndex !== -1) {
  const dept = db.departments[deptIndex];
  
  dept.fullDescription = "The Department of Ophthalmology at Government Medical College is committed to excellence in teaching, research, and patient care. Our department provides comprehensive ophthalmic education to undergraduate medical students and offers state-of-the-art diagnostic and therapeutic services to patients.";
  
  dept.doctors = [
    {
      name: "Dr. Deepali Gawai",
      designation: "Professor & Head",
      qualification: "MBBS, MS Ophthalmology",
      regNo: "1008/08/3047",
      experience: "Professor & Head"
    },
    {
      name: "Dr. Surajkumar Kuril",
      designation: "Associate Professor",
      qualification: "MBBS, MS Ophthalmology",
      experience: "Associate Professor"
    },
    {
      name: "Dr. Megha Kalam",
      designation: "Assistant Professor",
      qualification: "MBBS, MS Ophthalmology",
      regNo: "2017/08/4062",
      experience: "Assistant Professor"
    },
    {
      name: "Dr. Dinesh Patil",
      designation: "Assistant Professor",
      qualification: "MBBS, MS Ophthalmology",
      regNo: "2006/02/0447",
      experience: "Assistant Professor"
    },
    {
      name: "Dr. Harshvardhan Raghuwanshi",
      designation: "Senior Resident",
      qualification: "MBBS, DNB Ophthalmology",
      regNo: "2019/04/2353",
      experience: "Senior Resident"
    }
  ];

  dept.academicActivities = [
    "CBME-based structured teaching program including competencies as per NMC guidelines",
    "Teaching-learning methods: interactive lectures, SDL (Self-Directed Learning), DOAP (Demonstrate-Observe-Assist-Perform), and skill lab sessions",
    "Early Clinical Exposure (ECE) sessions integrated with basic sciences",
    "AETCOM (Attitude, Ethics, and Communication) module-based training",
    "Competency-based logbook maintenance and regular formative assessments",
    "Periodic feedback and mentorship for academic progress",
    "Use of simulation-based training for key skills like direct ophthalmoscopy, visual acuity testing, and slit lamp examination",
    "Integration with other departments for holistic understanding (horizontal and vertical integration)",
    "End-of-posting clinical assessment and internal assessment based on competencies"
  ];

  dept.facilities = [
    "Outpatient Department (OPD)",
    "Minor and Major Operation Theatres",
    "Refraction and Low Vision Aids Unit",
    "Indirect Ophthalmoscopy and direct Ophthalmoscopy",
    "Eye Donation Centre"
  ];

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
  console.log("Ophthalmology updated successfully.");
} else {
  console.log("Ophthalmology department not found.");
}
