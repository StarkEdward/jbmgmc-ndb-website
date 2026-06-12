const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/db.json');
let db = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const deptIndex = db.departments.findIndex(d => d.id === 'psychiatry');

if (deptIndex !== -1) {
  const dept = db.departments[deptIndex];
  
  dept.doctors = [
    {
      name: "Dr. Vijaya Gangode",
      designation: "Assistant Professor",
      qualification: "MBBS, MD Psychiatry",
      regNo: "2014/03/0660",
      experience: "Assistant Professor Regular MPSC GMC Nandurbar since 03/07/2024. Previously Senior Resident GMC Nandurbar, Senior Resident SBHGMC Dhule, Junior Resident LTMMC & Sion Hospital Mumbai. Lectures: 1) Introduction of Psychiatry. 2) Learning, Memory Emotions. 3) Schizophrenia & Psychotic disorders 4) Depression & related disorders. 5)Personality & Motivation Disorders. 6) Psychosomatic Disorder. 7) Psychosexual & Gender Identity. 8) Alcohol & Substance Abuse Disorders. 9) Eating Disorders. 10) Child Psychiatry. 11) Mental Retardation. 12)Psychiatric Emergencies."
    },
    {
      name: "Dr. Dinesh Valvi",
      designation: "Assistant Professor",
      qualification: "MBBS, MD Psychiatry",
      regNo: "2022/03/0599",
      experience: "Assistant Professor GMC Nandurbar since 25/04/2022. Previously Senior Resident Pramukh Swami Medical College Gujarat, Junior Resident B.J.Medical College Ahmadabad. Lectures: 1)History taking & MSE. 2) Bipolar Mood Disorder. 3)Anxiety disorder. 4) OCD. 5)Somatoform Disorder. 6)Sleep Disorder. 7)Psychopharmacology. 8) Organic Mental Disorder. 9)ECT. 10) community Psychiatry 11) Trauma & Stress Related Disorders. 12) Scales used in Psychiatric disorders."
    }
  ];

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
  console.log("Psychiatry updated successfully.");
} else {
  console.log("Psychiatry department not found.");
}
