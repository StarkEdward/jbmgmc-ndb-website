const fs = require('fs');
const dbPath = 'e:/New folder/b_a4NfVLTCLIh-1773847072793/data/db.json';
const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

if (!data.dynamicPages) data.dynamicPages = [];
if (!data.navItems) data.navItems = [
  { id: "home", label: "Home", href: "/", order: 1, submenus: [] },
  { id: "about", label: "About Us", href: "/about", order: 2, submenus: [] },
  { id: "departments", label: "Departments", href: "/departments", order: 3, submenus: [] },
  { id: "courses", label: "Courses", href: "/courses", order: 4, submenus: [] },
  { id: "hospital", label: "Hospital", href: "/hospital", order: 5, submenus: [] }
];

const pages = [
  { slug: 'about/citizen-charter', title: 'Citizen Charter', content: '<h2>Citizen Charter</h2><p>This page contains the Citizen Charter details as mandated by the government for public institutions.</p>' },
  { slug: 'administration/rti', title: 'Right to Information (RTI)', content: '<h2>Right to Information (RTI)</h2><p>Information regarding RTI Act 2005 and designated officers.</p>' },
  { slug: 'administration/rts', title: 'Right to Service (RTS)', content: '<h2>Right to Service (RTS)</h2><p>Services provided under the Right to Public Services Act.</p>' },
  { slug: 'administration/anti-ragging', title: 'Anti-Ragging Committee', content: '<h2>Anti-Ragging Committee</h2><p>Zero tolerance policy towards ragging. Committee members and helpline details.</p>' },
  { slug: 'administration/internal-complaint', title: 'Internal Complaint Committee', content: '<h2>Internal Complaint Committee</h2><p>Committee for prevention of sexual harassment at workplace.</p>' },
  { slug: 'administration/college-council', title: 'College Council', content: '<h2>College Council</h2><p>List of College Council members and their responsibilities.</p>' },
  { slug: 'administration/local-managing', title: 'Local Managing Committee', content: '<h2>Local Managing Committee</h2><p>Details of the Local Managing Committee.</p>' },
  { slug: 'student/information', title: 'Student Information', content: '<h2>Student Information</h2><p>General information and guidelines for enrolled students.</p>' },
  { slug: 'student/affiliation', title: 'Affiliation Details', content: '<h2>Affiliation Details</h2><p>MUHS affiliation certificates and documents.</p>' },
  { slug: 'student/academic-calendar', title: 'Academic Calendar', content: '<h2>Academic Calendar</h2><p>Current academic year calendar and term schedules.</p>' },
  { slug: 'muhs-mandate', title: 'MUHS Mandate', content: '<h2>MUHS Mandate</h2><p>Mandatory disclosures as per MUHS guidelines.</p>' },
  { slug: 'hospital/clinical-material', title: 'Clinical Material', content: '<h2>Clinical Material</h2><p>Statistics and information regarding clinical material available at the hospital.</p>' },
  { slug: 'tender', title: 'Tender & Quotations', content: '<h2>Tenders & Quotations</h2><p>Active tenders, quotations, and procurement notices.</p>' }
];

pages.forEach(p => {
  if (!data.dynamicPages.find(dp => dp.slug === p.slug)) {
    data.dynamicPages.push(p);
  }
});

// Update Navigation to include these
const aboutMenu = data.navItems.find(n => n.label === 'About Us' || n.label === 'About');
if (aboutMenu) {
  if (!aboutMenu.submenus) aboutMenu.submenus = [];
  if (!aboutMenu.submenus.find(s => s.href === '/about/citizen-charter')) {
    aboutMenu.submenus.push({ id: 'citizen-charter', label: 'Citizen Charter', href: '/about/citizen-charter', order: aboutMenu.submenus.length });
  }
}

let adminMenu = data.navItems.find(n => n.label === 'Administration');
if (!adminMenu) {
  adminMenu = {
    id: 'administration',
    label: 'Administration',
    href: '#',
    order: data.navItems.length,
    submenus: []
  };
  data.navItems.push(adminMenu);
}
const adminLinks = [
  { id: 'rti', label: 'RTI', href: '/administration/rti' },
  { id: 'rts', label: 'RTS', href: '/administration/rts' },
  { id: 'anti-ragging', label: 'Anti-Ragging Committee', href: '/administration/anti-ragging' },
  { id: 'icc', label: 'Internal Complaint Committee', href: '/administration/internal-complaint' },
  { id: 'college-council', label: 'College Council', href: '/administration/college-council' },
  { id: 'lmc', label: 'Local Managing Committee', href: '/administration/local-managing' }
];
adminLinks.forEach(link => {
  if (!adminMenu.submenus.find(s => s.href === link.href)) {
    adminMenu.submenus.push({ ...link, order: adminMenu.submenus.length });
  }
});

let studentMenu = data.navItems.find(n => n.label === 'Student Section');
if (!studentMenu) {
  studentMenu = {
    id: 'student-section',
    label: 'Student Section',
    href: '#',
    order: data.navItems.length,
    submenus: []
  };
  data.navItems.push(studentMenu);
}
const studentLinks = [
  { id: 'student-info', label: 'Student Information', href: '/student/information' },
  { id: 'affiliation', label: 'Affiliation', href: '/student/affiliation' },
  { id: 'academic-calendar', label: 'Academic Calendar', href: '/student/academic-calendar' }
];
studentLinks.forEach(link => {
  if (!studentMenu.submenus.find(s => s.href === link.href)) {
    studentMenu.submenus.push({ ...link, order: studentMenu.submenus.length });
  }
});

if (!data.navItems.find(n => n.href === '/muhs-mandate')) {
  data.navItems.push({ id: 'muhs-mandate', label: 'MUHS Mandate', href: '/muhs-mandate', order: data.navItems.length, submenus: [] });
}

let hospitalMenu = data.navItems.find(n => n.label === 'Hospital');
if (hospitalMenu) {
  if (!hospitalMenu.submenus) hospitalMenu.submenus = [];
  if (!hospitalMenu.submenus.find(s => s.href === '/hospital/clinical-material')) {
    hospitalMenu.submenus.push({ id: 'clinical-material', label: 'Clinical Material', href: '/hospital/clinical-material', order: hospitalMenu.submenus.length });
  }
}

if (!data.navItems.find(n => n.href === '/tender')) {
  data.navItems.push({ id: 'tender', label: 'Tenders', href: '/tender', order: data.navItems.length, submenus: [] });
}

fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
console.log('Successfully added missing pages and updated navigation.');
