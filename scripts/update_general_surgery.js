const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/db.json');
let db = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const deptIndex = db.departments.findIndex(d => d.id === 'general-surgery');

if (deptIndex !== -1) {
  const dept = db.departments[deptIndex];
  
  dept.fullDescription = "Department of surgery, GMC Nandurbar got established in 2019 with an aim to shoulder the responsibility of providing patient-centered care integrated with comprehensive undergraduate and postgraduate teaching, research and training using advanced learning and investigative tools that will result in stepwise achievement of milestones towards acquisition of competency in an Indian medical graduate. With a vision of becoming world-class leading institution, department of surgery promises to professionally train both undergraduate and postgraduate students with highest quality of skill through innovative and methodological teaching in most sophisticated and modest way. As a department in a premier educational and Health science institute, we will provide excellent patient care service through evidence based practice of surgery, and promoting training and research which is affordable, innovative and relevant to the needs of the society. We, as a team of Surgeons working in department of surgery have a vast teaching and clinical experience and our clinical objectives are achieved through close collaboration with other specialties and support departments. The department’s futuristic plans include procurement of laparoscopic simulators, a well established skills lab and to start robotic and bariatric surgeries. This incorporation and implementation of newer technology in teaching, learning and evaluation will result in making of globally competitive, competent and confident surgeons who will engage in ethical practice of the science and art of surgery.";
  
  dept.curriculumLink = "http://www.muhs.ac.in/upload/syllabus/Phase1_060810_16082012_1233.pdf";

  dept.facilities = [
    "OPD: 0900 to 1730h (Monday to Friday); 0900 to 1300h (Saturday)",
    "IPD: Total number of beds - 90 + 10 (10% PEDIATRIC SURGERY)",
    "Major OT & Minor OT: The department provides its operative services through 2 Modular OT, 1 Trauma OT and Emergency OT. Modular and Trauma OT operates from 09.00 AM - 05.00PM. Emergency OT operates 24 X 7 as per emergency surgeries posted by all surgical departments.",
    "Emergency services"
  ];

  // Mapping Vision to Goals
  dept.goals = [
    "VISION: To evolve into a tertiary care centre for providing state of the art care in the field of Minimal Access Surgery, Breast and Endocrine Surgery and all General Surgery.",
    "VISION: To become a centre of excellence for research with a rigorous academic programme for both undergraduates as well as postgraduate students."
  ];

  // Mapping Mission to Objectives
  dept.objectives = [
    "MISSION: To provide evidence-based patient care in the domain of General Surgery.",
    "MISSION: To provide a structured postgraduate training programme.",
    "MISSION: To conduct and organize training programs of Surgical Skills focusing on Open and Minimal Access surgery for the residents, nursing and paramedical staff and Surgeons in the region.",
    "MISSION: To provide speciality clinic services in Breast Cancer, Proctology and Stoma Care."
  ];

  dept.doctors = [
    {
      name: "Dr. Tushar Baburao Patil",
      designation: "Professor & HOD",
      qualification: "MBBS, MS",
      regNo: "MMC-2003/04/85207",
      experience: "19 Years",
      email: "tbpatil@gmail.com"
    },
    {
      name: "Dr. Shailesh Vishwas Patil",
      designation: "Assistant Professor",
      qualification: "MBBS, MS",
      regNo: "MMC-2015/04/2110",
      experience: "3 Years",
      email: "drshaileshpatil2@gmail.com"
    },
    {
      name: "Dr. Satish Naik",
      designation: "Senior Resident",
      qualification: "MBBS, MS",
      regNo: "MMC-2023/07/1833",
      experience: "1 Year",
      email: "Spnaikdragaon9@gmail.com"
    },
    {
      name: "Dr. Sudhir Desai",
      designation: "Junior Resident",
      qualification: "MBBS, MS",
      regNo: "MMC-2023/10/4712",
      experience: "2 Years",
      email: "Sudhir_desai2003@yahoo.com"
    }
  ];

  dept.courses = [
    {
      courseName: "DNB Gen Surgery training",
      intake: "2/year"
    }
  ];

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
  console.log("General Surgery updated successfully.");
} else {
  console.log("General Surgery department not found.");
}
