# Product Requirements Document (PRD)
## Jannayak Birsa Munda Government Medical College & Hospital (JBMGMC) Website

### 1. App Overview
The JBMGMC website is a comprehensive digital portal for a government medical college and hospital. It serves as the primary source of information for prospective students, current students, faculty, patients, and the general public. 

### 2. Target Users
- **Prospective Students:** Seeking admission information, course details (MBBS, Nursing), fee structures, and campus life.
- **Current Students:** Accessing notifications, exam results, hostel information, library resources, and anti-ragging policies.
- **Patients/Public:** Looking for hospital services, OPD timings, contact details, and facility information.
- **Faculty & Staff:** Accessing departmental information, research publications, and administrative links.

### 3. Problem Statement
The institution requires a modern, accessible, and highly performant web presence that unifies academic information (departments, faculty, library) with administrative transparency (tenders, RTI, affiliations) and student services. Previous fragmented or non-existent digital solutions hindered communication and compliance with regulatory bodies (NMC/MUHS).

### 4. Core Features
- **Dynamic Department Portals:** Detailed pages for Pre-clinical, Para-clinical, and Clinical departments featuring HOD profiles, faculty lists, and academic goals.
- **Faculty Directory:** Searchable and filterable directory of all doctors and teaching staff.
- **Central Library Hub:** Extensive library resources, rules, and digital links.
- **Committee Sections:** Dedicated pages for statutory committees (Anti-Ragging, Gender Harassment).
- **Student Services:** Results, admission brochures, notifications, and hostel details.
- **Multilingual Support:** Seamless translation to Hindi and Marathi via Google Translate integration.

### 5. User Stories
- *As a prospective student, I want to download the admission brochure so I can understand the eligibility criteria.*
- *As a patient, I want to find the contact details and location of the hospital.*
- *As a medical student, I want to view my department's faculty list and research publications.*
- *As an administrator, I want the website to load instantly and look modern to uphold the institution's reputation.*

### 6. MVP Scope
- Fully responsive UI for mobile and desktop.
- Home page with hero slider, announcements, and quick links.
- Departments list and individual department pages.
- Contact Us page with functional UI and map.
- Light/Dark mode support.
- Translation widget.

### 7. Success Metrics
- **Performance:** 90+ Lighthouse score on desktop and mobile.
- **Engagement:** Increased time spent on department and faculty pages.
- **Accessibility:** Zero contrast or layout shift errors (resolved dropdown and sticky overlap issues).

### 8. Features to Avoid in V1
- Live chat support.
- Custom backend CMS (relying on static JSON/MDX data for V1).
- Patient appointment booking (handled by external eHospital system).
