const fs = require('fs');
const dbPath = 'e:/New folder/b_a4NfVLTCLIh-1773847072793/data/db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

const defaultNavLinks = [
  { id: '1', href: "/", label: "Home", submenus: [] },
  { 
    id: '2', href: "/about", label: "About Us", 
    submenus: [
      { id: '2-1', label: "About Us", href: "/about" },
      { id: '2-2', label: "Faculty", href: "/doctors" },
      { id: 'citizen-charter', label: 'Citizen Charter', href: '/about/citizen-charter' }
    ] 
  },
  { 
    id: '3', href: "/committees", label: "Committees", 
    submenus: [
      { id: '3-1', label: "Anti Ragging Committee", href: "/committees/anti-ragging" },
      { id: '3-2', label: "Gender Harassment Committee", href: "/committees/gender-harassment" },
      { id: '3-3', label: "Womens Grievance Redressal Committee", href: "/committees/womens-grievance" },
    ]
  },
  { 
    id: '4', href: "/departments", label: "Departments", 
    submenus: [
      { id: '4-1', label: "Pre-Clinical Departments", href: "/departments#pre-clinical" },
      { id: '4-2', label: "Para-Clinical Departments", href: "/departments#para-clinical" },
      { id: '4-3', label: "Clinical Departments", href: "/departments#clinical" },
    ]
  },
  { 
    id: 'courses', href: "/courses", label: "Courses", submenus: []
  },
  { 
    id: '5', href: "/library", label: "Central Library", 
    submenus: [
      { id: '5-1', label: "Library Introduction", href: "/library#intro" },
      { id: '5-2', label: "Head of the Institute", href: "/library#head" },
      { id: '5-3', label: "Library Staff Members", href: "/library#staff" },
      { id: '5-4', label: "Library Committee Members", href: "/library#committee" },
      { id: '5-5', label: "Library Books", href: "/library#books" },
      { id: '5-6', label: "Journals", href: "/library#journals" },
      { id: '5-7', label: "Knimbus Digital Library", href: "https://gmcnandurbar.knimbus.com" },
      { id: '5-8', label: "Newspaper", href: "/library#newspaper" },
      { id: '5-9', label: "E-Library", href: "/library#e-library" },
      { id: '5-10', label: "Library Timing", href: "/library#timing" },
      { id: '5-11', label: "Central Library Rules", href: "/library#rules" },
      { id: '5-12', label: "Question Papers", href: "/library#question-papers" },
      { id: '5-13', label: "Contact Us", href: "/library#contact" },
      { id: '5-14', label: "Photo Gallery", href: "/gallery" },
    ]
  },
  { 
    id: '6', href: "#", label: "Administration", 
    submenus: [
      { id: '6-1', label: "NMC India Attendance", href: "https://gmcnur.nmcindia.ac.in/" },
      { id: '6-2', label: "Nextgen E-Hospital", href: "https://nextgen.ehospital.gov.in/login" },
      { id: '6-3', label: "MUHS Affiliation Letter", href: "/downloads/muhs-affiliation.pdf" },
      { id: '6-4', label: "RTS - Maharashtra Right to Public Services Act", href: "/administration/rts" },
      { id: '6-5', label: "RTI", href: "/administration/rti" },
      { id: 'anti-ragging', label: 'Anti-Ragging Committee', href: '/administration/anti-ragging' },
      { id: 'icc', label: 'Internal Complaint Committee', href: '/administration/internal-complaint' },
      { id: 'college-council', label: 'College Council', href: '/administration/college-council' },
      { id: 'lmc', label: 'Local Managing Committee', href: '/administration/local-managing' }
    ]
  },
  { 
    id: '7', href: "/students-corner", label: "Students Corner", 
    submenus: [
      { id: '7-1', label: "MBBS Admission Brochure 2025-26", href: "/downloads/mbbs-brochure.pdf" },
      { id: '7-2', label: "Fee Structure & Stipend Info", href: "/downloads/fee-info.pdf" },
      { id: '7-3', label: "Notifications", href: "/students-corner/notifications" },
      { id: '7-4', label: "Final Exam Result", href: "/students-corner/results/final" },
      { id: '7-5', label: "Supplementary Exam Result", href: "/students-corner/results/supplementary" },
      { id: '7-6', label: "Indemnity Bond & Undertaking", href: "/downloads/indemnity-bond.pdf" },
      { id: '7-7', label: "Foundation Course 2023-24", href: "/students-corner/foundation-course" },
      { id: 'student-info', label: 'Student Information', href: '/student/information' },
      { id: 'affiliation', label: 'Affiliation', href: '/student/affiliation' },
      { id: 'academic-calendar', label: 'Academic Calendar', href: '/student/academic-calendar' }
    ]
  },
  { 
    id: '8', href: "/nursing", label: "Nursing", 
    submenus: [
      { id: '8-1', label: "MUHS Mandate", href: "/nursing/muhs-mandate" },
    ]
  },
  { id: 'hospital', href: '/hospital', label: 'Hospital', submenus: [
    { id: 'clinical-material', label: 'Clinical Material', href: '/hospital/clinical-material' }
  ]},
  { id: 'muhs-mandate', href: '/muhs-mandate', label: 'MUHS Mandate', submenus: [] },
  { id: 'tender', href: '/tender', label: 'Tenders', submenus: [] },
  { id: '9', href: "/events", label: "Events", submenus: [] },
  { id: '10', href: "/contact", label: "Contact Us", submenus: [] },
];

data.navItems = defaultNavLinks.map((nav, index) => {
  return {
    ...nav,
    order: index + 1,
    submenus: nav.submenus ? nav.submenus.map((sub, i) => ({ ...sub, order: i + 1 })) : []
  };
});

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully restored original navigation with missing pages included.');
