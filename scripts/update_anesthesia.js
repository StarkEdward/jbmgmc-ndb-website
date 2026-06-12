const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '../data/db.json');
let db = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const deptIndex = db.departments.findIndex(d => d.id === 'anesthesiology');

if (deptIndex !== -1) {
  const dept = db.departments[deptIndex];
  
  dept.fullDescription = "Department of Anesthesia is providing hospital services and imparting a training programme for 100 MBBS students per year as per NMC and MUHS norms from the academic year 2021-22. Department is having 03 modular OTs with 03 high end workstations. Teaching and patient services are provided with advanced gadgets like flexible bronchoscope with monitors and camera, peripheral nerve stimulators, all types of multipara, video laryngoscopes and ventilators. OTs are with well-equipped pre and post operative area. Ultrasonography machine is available exclusively for anesthesia services in operation theatres. Department is having all the latest textbooks prescribed by NMC and MUHS along with two national and two international journals. Upgradation of department is a continuous process. Various projects like new modular OTs, new building construction will be completed in near future.";
  
  dept.curriculumLink = "http://www.muhs.ac.in/upload/syllabus";
  
  dept.goals = [
    "To create interest among the UG students about Anaesthesiology and Critical care management",
    "To start post graduate courses",
    "To start fellowship courses in pain management and critical care",
    "To start fellowship courses in regional anesthesia",
    "To start fellowship courses in paediatric anesthesia",
    "To start the Non Transplant organ Retrieval Centre"
  ];
  
  dept.objectives = [
    "Do preoperative basic assessment of patient.",
    "Set up intravenous infusion.",
    "Clear and maintain airway in an unconscious patient.",
    "Administer oxygen correctly.",
    "Perform simple nerve block.",
    "Should know the principles of administration of general and local anesthesia.",
    "Perform cardio-pulmonary resuscitation with the available resources and transfer patients to a bigger hospital for advanced life support.",
    "Know Importance of record keeping.",
    "Perform monitoring of patient in perioperative period and ICU."
  ];

  dept.doctors = [
    {
      name: "Dr. Rajesh Subhedar",
      designation: "Professor & HOD",
      qualification: "MD Anesthesia",
      experience: "Professor GMC Nandurbar since 23 Feb 2024",
      regNo: "MMC-76309"
    },
    {
      name: "Dr. Yogesh Motilal Borse",
      designation: "Associate Professor",
      qualification: "MD Anesthesia",
      experience: "Associate Professor GMC Nandurbar since 23 Nov 2022",
      regNo: "MMC-2002/02/0616"
    },
    {
      name: "Dr. Prasad Madhavrao Sule",
      designation: "Associate Professor",
      qualification: "MD Anesthesia",
      experience: "Associate Professor since 10 Sep 2024",
      regNo: "MMC-2010/04/1129"
    },
    {
      name: "Dr. Savita Nallamdage",
      designation: "Assistant Professor",
      qualification: "MD Anesthesia",
      experience: "Regular Assistant Professor GMC Nandurbar",
      regNo: "MMC-2013/09/2847"
    },
    {
      name: "Dr. Gulabsing Chandrasing Pawara",
      designation: "Assistant Professor",
      qualification: "MD Anesthesia",
      experience: "Assistant Professor GMC Nandurbar since 28 May 2024",
      regNo: "MMC-2018/05/1601"
    },
    {
      name: "Dr. Sneha Badame",
      designation: "Assistant Professor",
      qualification: "MD Anesthesia",
      experience: "Assistant Professor since 18 Sept 2023",
      regNo: "MMC-2014/09/4293"
    }
  ];

  dept.nonTeachingStaff = [
    { post: "Clerk", name: "Mrs. Vaishali Borase" },
    { post: "Clerk", name: "Mr. Sagar Sanjay Kamble" },
    { post: "Clerk", name: "Mr. Amit Vitthal Mohite" },
    { post: "Peon", name: "Aasha Gajmal Pawar" }
  ];

  dept.duties = [
    {
      designation: "Professor",
      responsibilities: [
        "He will be Head of Department who will be responsible to Dean and government in all respect.",
        "Full administration of the Department regarding Posting of Associate Professors, Lecturers, Registrars, House Officers, Trainees and postgraduates in Anaesthesia in various operation theatres for Administration of Anaesthesia, Making emergency duty lists from time to time, Distribution of teaching work to them for under-graduates and other trainees.",
        "Attended the official meetings like College council, University faculty and Board of Studies and other interdepartmental meetings, if invited.",
        "He should handle all official and un-official correspondence and their replies.",
        "Should attend Death conference.",
        "Teaching and training of post-graduates in Anaesthesia, organiser Seminars and Other activities in the Department.",
        "Administration of all operations theatres.",
        "Indenting the requirements of the department like equipment, the maintenance, drugs and library reference books and periodicals.",
        "Research work.",
        "Encourage and guide other staff members in their research work and help them in presenting their work in Annual Conference.",
        "Administrators, Anaesthesia to important case and guide other staff members and even students.",
        "Organise the training programmes to Nurses, Medical Officers, Surgical Medical Officers and also General Practitioners in the Resuscitation methods during emergency, Recovery rooms, intensive care unit etc."
      ]
    },
    {
      designation: "Associate Professor",
      responsibilities: [
        "Will be in charge of a unit which will consist of Lecturers, Registrars and House Officers.",
        "Will be responsible for the proper administration of Anesthesia to patients in the operation theatres.",
        "Will train and teach to under graduate House Officers trainees and post graduates.",
        "Will attend post-graduate seminars in the Department.",
        "Will remain on call for emergency.",
        "Will do research work and publish the results or read a paper in conference.",
        "Will be responsible for all anaesthetic management in his operation theatre.",
        "Will help the Professor in running the department. He / she will attend any other work allotted by the Professors or Dean."
      ]
    },
    {
      designation: "Assistant Professor",
      responsibilities: [
        "To assist the Professor in teaching the subject to the undergraduates.",
        "To assist the Professor in Ward works.",
        "To perform duties in the O.P.D.",
        "To relieve the residents as and when required.",
        "To help the Professor in research work.",
        "To perform such other duties in the Hospital and O.P.D. as assigned by the Professor or the Dean."
      ]
    }
  ];

  dept.facilities = [
    "Preoperative Anesthesia Assessment OPD",
    "Routine and Emergency Anesthesia services",
    "Services in National programme",
    "Services for VIP duties"
  ];

  dept.researchPublications = [
    {
      doctorName: "Dr. Rajesh Subhedar",
      publications: [
        {
          title: "Comparative evaluation of intrathecal midazolam and low dose clonidine: Efficacy safety and duration of analgesia. A randomized double blind prospective clinical trial",
          journal: "Indian j pharmacol 2012",
          indexed: "Index Medicus, PubMed Central, Scimago Journal Ranking, SCOPUS"
        },
        {
          title: "Study of injection tramadol as additive in intravenous regional anesthesia",
          journal: "J of Evolution of Med and Dent Sci",
          indexed: "Copernicus"
        },
        {
          title: "Evaluation of pulmonary aspiration and sellick’s maneuver in emergency laparotomies",
          journal: "J of Evolution of Med and Dent Sci",
          indexed: "Copernicus"
        },
        {
          title: "Oculocardiac Reflex during Strabismus Surgery in Pediatric Patients: A Randomized Case-Control Study",
          journal: "International J of Scientific Study",
          indexed: "Copernicus"
        },
        {
          title: "Does Dexamethasone Improves Postoperative Day Care Surgery Outcome When Used As Additive To Local Infiltration Anesthesia: A Randomized case control study",
          journal: "Indian Journal of Clinical Anaesthesia",
          indexed: "Copernicus"
        },
        {
          title: "Nalbuphine and pentazocine in opioid benzodiazepine sedative technique in ear surgery under local anaesthesia – a double blind comparison",
          journal: "Indian Journal of Clinical Anaesthesia",
          indexed: "Copernicus"
        },
        {
          title: "Comparative study of preloading and Co-loading with ringer lactate for prevention of spinal hypotension in elective cesarean section",
          journal: "International Journal of Medical Anesthesiology",
          indexed: "Copernicus"
        },
        {
          title: "Randomized Controlled Trial to Evaluate the Efficacy of Intrathecal Dexmedetomidine to Low dose hyperbaric 0.5% Bupivacaine in Elective Lower Segment Caesarean Section",
          journal: "Perspectives in Medical Research",
          indexed: "Copernicus"
        },
        {
          title: "To study the effect of addition of Nalbuphine to intrathecal bupivacaine in lower limb surgery under spinal anesthesia – A randomized double blind study",
          journal: "International Medical Journal",
          indexed: "Scopus"
        },
        {
          title: "A Comparative Study of Dexamethasone and Magnesium Sulphate as an Adjuvant to 0.5% Bupivacaine in Supraclavicular Brachial Plexus Block",
          journal: "INTERNATIONAL JOURNAL OF PHARMACEUTICAL AND CLINICAL RESEARCH",
          indexed: "Embase"
        }
      ]
    },
    {
      doctorName: "Dr. Yogesh Borase",
      publications: [
        "Randomized Controlled Trial to Evaluate the Efficacy of Intrathecal Dexmedetomidine to Low dose hyperbaric 0.5% Bupivacaine in Elective Lower Segment Caesarean Section. Perspectives in Medical Research. 2021;9(3):48-53",
        "Comparative study of preloading and Co-loading with ringer lactate for prevention of spinal hypotension in elective cesarean section. International Journal of Medical Anesthesiology. 3. 30-32.",
        "Oculocardiac Reflex during Strabismus Surgery in Pediatric Patients: A Randomized Case-Control Study. International Journal of Scientific Study | December 2015 | Vol 3 | Issue 9",
        "Comparative Study of Spinal Anesthesia by Bupivacaine Heavy (0.5%), Bupivacaine Heavy (0.5%) with Ketamin or Midzolam in Paediatric Patients. Indian Journal of Clinical Anaesthesia, 2015;2(4):256-261",
        "A Comparative Study Of Intrathecal Bupivacaine And Bupivacaine With Buprenorphine For Post- Operative Analgesia In Orthopedic Surgeries. Indian Journal of Clinical Anaesthesia, April - June 2015;2(2):92-96"
      ]
    },
    {
      doctorName: "Dr. Gulabsing Pawara",
      publications: [
        "Anaesthetic Management of a patient with a Parkinson disease in a coronary artery bypass graft. Journal of Cardiovascular Disease Research. ISSN: 0975-3583,0976-2833. Vol 14, issue"
      ]
    },
    {
      doctorName: "Dr. Prasad Madhavrao Sule",
      publications: [
        {
          title: "A double blind prospective study of effect of intrathecal ropivacaine 0.75% and bupivacaine 0.5% for lower limb orthopaedic surgery in young patients.",
          journal: "International journal of basic and clinical Pharmacology.",
          indexed: "Pubmed, Index Copernicus, Google Scholar"
        },
        {
          title: "Comparative study of psoas compartment block and sciatic nerve block with that of spinal block Anaesthesia for lower extremity surgeries",
          journal: "Indian Journal of Clinical Anaesthesia",
          indexed: "Scopes, Index Copernicus, Google Scholar"
        },
        {
          title: "Comparison of the efficacy of 0.5% levobupivacaine with a combination of 0.5% levobupivacaine and hyaluronidase, in ultrasound guided axillary brachial plexus block.",
          journal: "Journal of Cardiovascular Disease Research",
          indexed: "EMBASE, Scopes, Google Scholar"
        },
        {
          title: "A Comparison of effect of intravenous midazolan and ketamine on Emergece agitation in paediatric age group.",
          journal: "Journal of Cardiovascular Disease Research",
          indexed: "EMBASE, Scopes, Google Scholar"
        }
      ]
    }
  ];

  fs.writeFileSync(filePath, JSON.stringify(db, null, 2), 'utf8');
  console.log("Anesthesiology updated successfully.");
} else {
  console.log("Anesthesiology department not found.");
}
