const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/db.json');
let db = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const pathologyIndex = db.departments.findIndex(d => d.id === 'pathology');

if (pathologyIndex !== -1) {
  const pathology = db.departments[pathologyIndex];
  
  pathology.fullDescription = "The Department of Pathology was established in the year 2021. Since its inception, the department has been committed to imparting quality medical education, delivering efficient diagnostic services, and engaging in meaningful research. Currently, the department has a faculty strength of four. The department is engaged in diagnostic reporting of surgical pathology, cytopathology, and hematology specimens, besides teaching undergraduate MBBS and performing quality research activities in diverse clinical domains. The department offers state-of-the-art diagnostic services and has well- equipped histopathology, cytopathology, and hematology labs. The Cytopathology lab performs conventional cytology for gynecological smears. The hematology lab is well equipped with a fully automated 3 part and 5 part cell counters and performs HPLC for diagnosing various hemoglobinopathies. The coagulation lab offers PT-INR and APTT tests with specialized factor assays. The department also offers clinical autopsy services for determining the cause of death.\\n\\nThe undergraduate teaching programs are planned according to the guidelines outline in the competency- based medical curriculum so that the student not only acquire the requesite knowledge and skills pertaining to cognitive and psychomotor domain but also develops competencies in attitudinal, ethical, and communication domains. The department actively takes part in community outreach activities to increase awareness regarding screening of common cancers.";
  
  pathology.doctors = [
    {
      name: "Dr. Santosh N. Pawar",
      designation: "Associate Professor & HOD",
      qualification: "MBBS, MD (PATHOLOGY)",
      experience: "8 Years 11 Months",
      email: "santoshpawargp@yahoo.co.in",
      regNo: "MMC-2011/05/1515"
    },
    {
      name: "Dr. Rajesh Thakur",
      designation: "Assistant Professor",
      qualification: "MBBS MD (PATHOLOGY)",
      experience: "9 Years 11 Months",
      email: "drrajeshyt@gmail.com",
      regNo: "MMC-2010/03/0669"
    },
    {
      name: "Dr. Suhas Kokani",
      designation: "Assistant Professor",
      qualification: "MBBS MD (PATHOLOGY)",
      experience: "11 Months",
      email: "sbkkokani@gmail.com",
      regNo: "MMC-2013/10/3234"
    },
    {
      name: "Dr. Gaurav Deshmukh",
      designation: "Senior Resident",
      qualification: "MBBS MD (PATHOLOGY)",
      experience: "11 Months",
      email: "gauravdeshmukh78@gmail.com",
      regNo: "MMC-2013/11/3352"
    }
  ];

  pathology.nonTeachingStaff = [
    { post: "Technician", name: "Shri. Jitendra Wani" },
    { post: "Technician", name: "Shri. Yogendrasing Rajput" },
    { post: "Junior clerk", name: "Shri. Sohan Kokani" },
    { post: "Peon", name: "Shri. Ravindra Ahire" },
    { post: "Sweeper", name: "Shri. Gautam Baisane" }
  ];

  pathology.services = [
    {
      name: "Hematology",
      description: "HB, CBC, Platelet Count, RETICULOCYTE COUNT, PT INR, BT CT, SOLUBILITY TEST (SICKLE CELL), Nestroff test, ESR, BLOOD GROUP, PS for MALARIA, PS for EO, URINE ANALYSIS, UPT. The Hematology section offers comprehensive blood analysis, focusing on diagnosing blood disorders, including anemias and malignancies."
    },
    {
      name: "Cytopathology",
      description: "FNAC, PAP SMEAR. Cytopathology focuses on examining cells from various body sites to detect cancer and precancerous conditions, infectious benign disorders. Techniques like facilitating early detection and treatment of disease."
    },
    {
      name: "Clinical Pathology",
      description: "PLURAL FLUID CYTOLOGY, ASCITIC FLUID CYTOLOGY, CSF FLUID CYTOLOGY, SYNOVIAL FLUID CYTOLOGY. Clinical pathology division specializes in the analysis of urine, body fluids and semen analysis. This is essential for the accurate diagnosis and monitoring of various medical conditions, ensuring effective patient care."
    },
    {
      name: "Histopathology",
      description: "Histopathology of various surgical specimens. Histopathology division provides detailed tissue analysis, identifying pathological conditions through microscopic examination."
    },
    {
      name: "Clinical Autopsy",
      description: "Clinical Autospy service is dedicated to understanding the cause of death through comprehensive post-mortem examination."
    }
  ];

  pathology.labInvestigations = [
    { year: "2022", ipdOpd: "124153", histopathology: "-", cytology: "-", total: "124153" },
    { year: "2023", ipdOpd: "172799", histopathology: "368", cytology: "39", total: "173206" },
    { year: "Till 30 June, 2024", ipdOpd: "100681", histopathology: "594", cytology: "105", total: "101380" }
  ];

  pathology.researchPublications = [
    {
      doctorName: "Dr. Santosh Pawar",
      publications: [
        {
          title: "Sensitivity and specificity of cell block method in diagnosis of lung malignancies",
          journal: "IOSR-journal of dental and medical Sciences",
          database: "Index Copernicus, Google Scholar, Indian Citation Index",
          indexed: "International, Original Article, Print"
        },
        {
          title: "A 3 years retrospective Histopathological study of autopsy findings",
          journal: "Indian journal of Forensic Medicine and pathology",
          database: "Index Copernicus, Google Scholar, Scopes",
          indexed: "National, Original Article, Print"
        },
        {
          title: "Changing Histological Pattern of Lung malignancies in India",
          journal: "International Journal of Recent Trends in Science and Technology",
          database: "Index Copernicus",
          indexed: "International, Original Article, Print"
        },
        {
          title: "Study of demographic profile of patients with lung malignancies",
          journal: "Journal of evolution of medical and Dental Sciences",
          database: "Index Copernicus, Google Scholar, global Index medicus",
          indexed: "International, Original Article, Print"
        }
      ]
    }
  ];

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
  console.log("Pathology updated successfully.");
} else {
  console.log("Pathology department not found.");
}
