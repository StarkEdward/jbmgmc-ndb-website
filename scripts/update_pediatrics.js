const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/db.json');
let db = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const deptIndex = db.departments.findIndex(d => d.id === 'pediatrics');

if (deptIndex !== -1) {
  const dept = db.departments[deptIndex];
  
  dept.fullDescription = "The Department of Pediatrics focuses on the health and medical care of infants, children, and adolescents. The teaching should be aligned and integrated horizontally and vertically in order to provide comprehensive care for neonates, infants, children and adolescents based on a sound knowledge of growth, development, disease and their clinical, social, emotional, psychological correlates in the context of national health priorities.";

  dept.objectives = [
    "Describe the normal Growth and Development during fetal life, Neonatal period, Childhood and Adolescence and deviations there of.",
    "Describe the common Pediatric disorders and emergencies in terms of Epidemiology, Etiopathogenesis, Clinical manifestations, Diagnosis and also describe the rational therapy and rehabilitation services.",
    "Workout age related requirement of calories, nutrients, fluids, dosages of drugs etc. in health and disease.",
    "Describe preventive strategies for common infectious disorders, Malnutrition.",
    "Outline national programs related to child health including Immunization programs."
  ];

  dept.skills = [
    "Ability to assess and promote optimal growth, development and nutrition of children and adolescents and identify deviations from normal.",
    "Ability to recognize and provide emergency and routine ambulatory and First Level Referral Unit care for neonates, infants, children and adolescents and refer as may be appropriate.",
    "Ability to perform procedures as indicated for children of all ages in the primary care setting.",
    "Ability to recognize children with special needs and refer appropriately.",
    "Ability to promote health and prevent diseases in children.",
    "Ability to participate in National Programmes related to child health and in conformation with the Integrated Management of Neonatal and Childhood illnesses (IMNCI) Strategy.",
    "Ability to communicate appropriately and effectively.",
    "Take detailed Pediatric and Neonatal history and conduct an appropriate physical examination of children and neonates, make clinical diagnosis, conduct common bedside investigative procedures, interpret common laboratory investigations, plan and institute therapy.",
    "Take anthropometric measurements, resuscitate newborn, prepare oral rehydration solution, perform tuberculin test, administer vaccines available under current National programs. Perform venesection, start intravenous fluids and provide nasogastric feeding.",
    "Conduct diagnostic procedures such as lumbar puncture, liver and kidney biopsy, bone marrow aspirations, pleural and ascetic tap.",
    "Distinguish between normal Newborn babies and those requiring special care and institute early care to all newborn babies including care of preterm and low birth weight babies, provide correct guidance and counselling about breastfeeding and Complementary feeding.",
    "Provide ambulatory care to all not so sick children, identify indications for specialized/impatient care and ensure timely referral to those who require hospitalization."
  ];

  dept.doctors = [
    {
      name: "Dr. Yogesh Salunkhe",
      designation: "Associate Professor & HOD",
      qualification: "MD Pediatrics",
      regNo: "2005/01/0190",
      experience: "12 years",
    },
    {
      name: "Dr. Sudhakar Bantewad",
      designation: "Assistant Professor",
      qualification: "MD Pediatrics",
      regNo: "2012/10/2984",
      experience: "8 years",
    }
  ];

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
  console.log("Pediatrics updated successfully.");
} else {
  console.log("Pediatrics department not found.");
}
