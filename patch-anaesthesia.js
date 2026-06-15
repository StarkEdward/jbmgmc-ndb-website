const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'db.json');
const rawData = fs.readFileSync(dbPath, 'utf-8');
const db = JSON.parse(rawData);

const anesthesiologyData = {
  id: "anesthesiology",
  name: "Anaesthesiology",
  category: "Clinical",
  description: "Anaesthesiology is a dynamic clinical specialty that ensures patient safety, comfort, and physiological stability during the perioperative period.",
  fullDescription: "Anaesthesiology is a dynamic clinical specialty that ensures patient safety, comfort, and physiological stability during the perioperative period. It integrates applied physiology, pharmacology, critical care, pain medicine, and emergency response to support surgical and diagnostic procedures across all disciplines.\n\nAt Government Medical College, Nandurbar, the Department of Anaesthesiology functions as a comprehensive clinical and academic unit, delivering services in operation theatres, intensive care units, labour rooms, emergency settings, and pain clinics. The department plays a pivotal role in perioperative medicine, resuscitation, trauma care, and critical care management.\n\n### Curriculum\n\nThe teaching program is structured as per the guidelines of Maharashtra University of Health Sciences (MUHS), Nashik, and aligned with the National Medical Commission (NMC) CBME framework.\n\n**1. Undergraduate Training (MBBS – Phase III)**\nThe curriculum is designed to provide foundational knowledge and essential clinical competencies in:\na. Pre-anaesthetic evaluation and risk assessment.\nb. Principles of general and regional anaesthesia.\nc. Airway management and resuscitation.\nd. Basic life support (BLS) and advanced life support (ALS)\ne. Fluid management and perioperative monitoring.\nf. Post-operative care and pain management.\ng. Management of shock and common emergencies\nh. Early clinical exposure and skill laboratory sessions form an integral component of learning.\n\n**2. Postgraduate Training (MD Anaesthesiology)**\nThe postgraduate program focuses on:\na. Advanced airway and difficult airway management\nb. Subspecialty anaesthesia (neuro, cardiac, paediatric, obstetric, onco-anaesthesia)\nc. Critical care medicine and ventilatory management\nd. Trauma and emergency anaesthesia\ne. Acute and chronic pain services\nf. Research methodology and dissertation work\ng. Ethics, communication skills, and interdepartmental coordination",
  curriculumLink: "http://www.muhs.ac.in/upload/syllabus",
  goals: [
    "To produce competent, ethical, and skilled anesthesiologist’s capable of delivering safe perioperative care, managing critically ill patients, and contributing effectively to multidisciplinary healthcare delivery."
  ],
  objectives: [
    "Describe the physiological and pharmacological principles underlying anaesthesia practice.",
    "Understand perioperative pathophysiology and its clinical implications.",
    "Perform systematic pre-anaesthetic assessment and risk stratification.",
    "Apply principles of patient monitoring and haemodynamic management.",
    "Understand the biochemical and physiological responses to surgical stress and trauma.",
    "Integrate anaesthetic management with surgical and medical comorbid conditions.",
    "Correlate clinical findings with laboratory investigations and imaging in perioperative care.",
    "Demonstrate effective communication, documentation, and medico-legal awareness."
  ],
  skills: [
    "Perform basic airway management including bag-mask ventilation and endotracheal intubation under supervision.",
    "Initiate and manage cardiopulmonary resuscitation according to standard protocols.",
    "Administer safe general and regional anaesthesia under guidance.",
    "Interpret intraoperative monitoring parameters (ECG, SpO₂, NIBP, EtCO₂).",
    "Manage fluids, blood products, and perioperative complications.",
    "Provide post-operative pain relief using multimodal techniques.",
    "Recognize and respond to anaesthetic emergencies such as anaphylaxis, laryngospasm, hypotension, and cardiac arrest."
  ],
  academicActivities: [
    "Case-based discussions",
    "Interdepartmental clinical meetings",
    "Mortality and morbidity reviews",
    "Workshops on airway management and resuscitation",
    "Simulation-based training programs",
    "Participation in state and national conferences"
  ],
  facilities: [
    "Fully equipped modular operation theatres",
    "Advanced anaesthesia workstations with integrated ventilators",
    "Multiparameter monitoring (ECG, NIBP, IBP, SpO₂, EtCO₂, temperature)",
    "Central medical gas pipeline system (O₂, N₂O, compressed air, suction)",
    "Ultrasound (USG) machine for regional nerve blocks, CVC, arterial cannulation",
    "Fiberoptic bronchoscope for difficult airway management and awake intubation",
    "Video laryngoscope and complete difficult airway cart",
    "Defibrillators and fully stocked crash carts",
    "Intensive Care Unit (ICU) Support with mechanical ventilators",
    "Invasive haemodynamic monitoring (arterial line, CVP) and Point-of-care ABG analysis",
    "Pre-Anaesthesia Check-Up (PAC) Clinic",
    "Pain Management Services (Acute, chronic, epidural)",
    "Emergency and Trauma Services with 24x7 coverage",
    "Academic and Training Facilities with seminar hall and simulation-based training"
  ],
  doctors: [
    { name: "Dr. Rajesh Dnyanoba Subhedar", designation: "Professor & HOD", qualification: "MBBS, MD", experience: "27 yrs & 6 months", regNo: "76309" },
    { name: "Dr. Yogesh Motilal Borse", designation: "Associate Professor", qualification: "MBBS, MD", experience: "17 yrs 8 months", regNo: "2002/02/0616" },
    { name: "Dr. Prasad Madhavrao Sule", designation: "Associate Professor", qualification: "MBBS, MD", experience: "13 years", regNo: "2010/04/1129" },
    { name: "Dr. Sneha Manohar Badame", designation: "Assistant Professor", qualification: "MBBS, MD", experience: "2 yrs & 5 months", regNo: "2014/09/4293" },
    { name: "Dr. Gulabsing Chandrasing Pawara", designation: "Assistant Professor", qualification: "MBBS, MD", experience: "3 yrs & 4 months", regNo: "2018/05/1601" },
    { name: "Dr. Minakshi Yadorao Kalam", designation: "Assistant Professor", qualification: "MBBS, MD", experience: "-", regNo: "2016/12/5257" },
    { name: "Dr. Manoj Motiram Pawar", designation: "Assistant Professor", qualification: "MBBS, MD", experience: "-", regNo: "2018/01/0049" },
    { name: "Dr. Prachi Gajanan Rabde", designation: "SR- 1", qualification: "MBBS, MD", experience: "-", regNo: "2020/09/5698" },
    { name: "Dr. Kalpesh Sattarsing Pawara", designation: "SR- 1", qualification: "MBBS, MD", experience: "-", regNo: "2020/10/6209" }
  ],
  nonTeachingStaff: [
    { name: "Dr. Sachin Tukaram Valavi", post: "JR- 3" },
    { name: "Dr. Anjali Vinayak Kumbhare", post: "JR- 1" },
    { name: "Dr. Hanuman Rangrao Dhanve", post: "JR- 1" },
    { name: "Dr. Akshita Jyoti", post: "JR- 1" },
    { name: "Dr. Shraddha Aakriti Raina", post: "JR- 1" },
    { name: "Dr. Mrunal Dinesh Khade", post: "JR- 1" },
    { name: "Dr. Laxman Prakash Pawar", post: "JR- 1" },
    { name: "Vaishali Motilal Borase", post: "Jr. Clerk" },
    { name: "Sagar Sanjay Kamble", post: "Jr. Clerk" },
    { name: "Amit Vitthal Mohite", post: "Jr. Clerk" },
    { name: "Asha Gajmal Pawar", post: "Peon" }
  ],
  duties: [
    {
      designation: "Professor (Head / Senior Faculty)",
      responsibilities: [
        "Overall planning, implementation, and monitoring of CBME curriculum",
        "Supervision of undergraduate and postgraduate teaching programs",
        "Chairing academic activities such as journal clubs and case discussions",
        "Overall supervision of anaesthesia services in OT, ICU, labour room, and emergency",
        "Management of high-risk and complex cases",
        "Head of the Department, allocation of duties to faculty and residents",
        "Promotion of departmental research activities and publication in indexed journals"
      ]
    },
    {
      designation: "Associate Professor",
      responsibilities: [
        "Active participation in CBME-based teaching of MBBS and MD students",
        "Assessment of students and assistance in university examinations",
        "Independent conduct of anaesthesia for routine and moderately complex cases",
        "Supervision of residents during procedures",
        "Assisting Professor/HOD in academic and administrative functions",
        "Conducting independent research and publishing scientific work"
      ]
    },
    {
      designation: "Assistant Professor",
      responsibilities: [
        "Teaching MBBS students during clinical postings",
        "Training students in basic airway management and resuscitation skills",
        "Providing anaesthesia services under overall supervision of senior faculty",
        "Supervision of junior residents and participation in emergency/ICU services",
        "Maintenance of case records and departmental documentation",
        "Participation in departmental research projects"
      ]
    }
  ],
  researchPublications: [
    {
      doctorName: "Dr. Rajesh Dnyanoba Subhedar",
      publications: [
        { title: "Comparative evaluation of intrathecal midazolam and low dose clonidine: Efficacy safety and duration of analgesia.", journal: "Indian j pharmacol", indexed: "Index Medicus, PubMed Central, Scimago Journal Ranking, SCOPUS" },
        { title: "Study of injection tramadol as additive in intravenous regional anesthesia", journal: "J of Evolution of Med and Dent Sci", indexed: "Copernicus" },
        { title: "Evaluation of pulmonary aspiration and sellick’s maneuver in emergency laparotomies", journal: "J of Evolution of Med and Dent Sci", indexed: "Copernicus" },
        { title: "Oculocardiac Reflex during Strabismus Surgery in Pediatric Patients: A Randomized Case-Control Study", journal: "International J of Scientific Study", indexed: "Copernicus" },
        { title: "Does Dexamethasone Improves Postoperative Day Care Surgery Outcome When Used As Additive To Local Infiltration Anesthesia", journal: "Indian Journal of Clinical Anaesthesia", indexed: "Copernicus" },
        { title: "Nalbuphine and pentazocine in opioid benzodiazepine sedative technique in ear surgery under local anaesthesia", journal: "Indian Journal of Clinical Anaesthesia", indexed: "Copernicus" },
        { title: "Comparative study of preloading and Co-loading with ringer lactate for prevention of spinal hypotension in elective cesarean section", journal: "International Journal of Medical Anesthesiology", indexed: "Copernicus" },
        { title: "Randomized Controlled Trial to Evaluate the Efficacy of Intrathecal Dexmedetomidine to Low dose hyperbaric 0.5% Bupivacaine in Elective Lower Segment Caesarean Section", journal: "Perspectives in Medical Research", indexed: "Copernicus" },
        { title: "To study the effect of addition of Nalbuphine to intrathecal bupivacaine in lower limb surgery under spinal anesthesia", journal: "International Medical Journal", indexed: "Scopus" },
        { title: "A Comparative Study of Dexamethasone and Magnesium Sulphate as an Adjuvant to 0.5% Bupivacaine in Supraclavicular Brachial Plexus Block", journal: "INTERNATIONAL JOURNAL OF PHARMACEUTICAL AND CLINICAL RESEARCH (IJPCR)", indexed: "Embase" }
      ]
    },
    {
      doctorName: "Dr. Yogesh Motilal Borse",
      publications: [
        { title: "Randomized Controlled Trial to Evaluate the Efficacy of Intrathecal Dexmedetomidine to Low dose hyperbaric 0.5% Bupivacaine in Elective Lower Segment Caesarean Section.", journal: "Perspectives in Medical Research", indexed: "" },
        { title: "Comparative study of preloading and Co-loading with ringer lactate for prevention of spinal hypotension in elective cesarean section.", journal: "International Journal of Medical Anesthesiology", indexed: "" },
        { title: "Oculocardiac Reflex during Strabismus Surgery in Pediatric Patients: A Randomized Case-Control Study.", journal: "International Journal of Scientific Study", indexed: "" },
        { title: "Comparative Study of Spinal Anesthesia by Bupivacaine Heavy (0.5%), Bupivacaine Heavy (0.5%) with Ketamin or Midzolam in Paediatric Patients.", journal: "Indian Journal of Clinical Anaesthesia", indexed: "" },
        { title: "A Comparative Study Of Intrathecal Bupivacaine And Bupivacaine With Buprenorphine For Post- Operative Analgesia In Orthopedic Surgeries.", journal: "Indian Journal of Clinical Anaesthesia", indexed: "" }
      ]
    },
    {
      doctorName: "Dr. Gulabsing Chandrasing Pawara",
      publications: [
        { title: "Anaesthetic Management of a patient with a Parkinson disease in a coronary artery bypass graft", journal: "Journal of Cardiovascular Disease Research", indexed: "" }
      ]
    },
    {
      doctorName: "Dr. Prasad Madhavrao Sule",
      publications: [
        { title: "A double blind prospective study of effect of intrathecal ropivacaine 0.75% and bupivacaine 0.5% for lower limb orthopaedic surgery in young patients.", journal: "International journal of basic and clinical Pharmacology.", indexed: "Pubmed, Index Copernicus, Google Scholar" },
        { title: "Comparative study of psoas compartment block and sciatic nerve block with that of spinal block Anaesthesia for lower extremity surgeries", journal: "Indian Journal of Clinical Anaesthesia", indexed: "Scopes, Index Copernicus, Google Scholar" },
        { title: "Comparison of the efficacy of 0.5% levobupivacaine with a combination of 0.5% levobupivacaine and hyaluronidase, in ultrasound guided axillary brachial plexus block.", journal: "Journal of Cardiovascular Disease Research", indexed: "EMBASE, Scopes, Google Scholar" },
        { title: "A Comparison of effect of intravenous midazolan and ketamine on Emergece agitation in paediatric age group.", journal: "Journal of Cardiovascular Disease Research", indexed: "EMBASE, Scopes, Google Scholar" }
      ]
    },
    {
      doctorName: "Dr. Minakshi Yadorao Kalam",
      publications: [
        { title: "Failed surface landmark guided IJV cannulation method in patient with incidental thyroid cyst displacing left internal jugular vein.", journal: "Global Journal for research analysis", indexed: "Medicus, Google Scholar" },
        { title: "Anaesthesia management of child with mediastinal mass and chemotherapy induced heart failure for percutaneous CT Guided Biopsy", journal: "Peripex – Indian Journal of research", indexed: "Medicus, Google Scholar" }
      ]
    }
  ]
};

const index = db.departments.findIndex(d => d.id === 'anesthesiology');
if (index !== -1) {
  db.departments[index] = anesthesiologyData;
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  console.log('Successfully updated Anaesthesiology department in db.json');
} else {
  console.error('Anesthesiology department not found in db.json!');
}
