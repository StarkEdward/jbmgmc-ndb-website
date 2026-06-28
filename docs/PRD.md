# Product Requirements Document (PRD)
## Jannayak Birsa Munda Government Medical College & Hospital (JBMGMC) Website

**Document Version:** 2.0
**Date:** June 2026
**Status:** Active Development (dev branch)

---

### 1. App Overview
The JBMGMC website is a comprehensive digital portal for a government medical college and hospital. It serves as the primary source of information for prospective students, current students, faculty, patients, and the general public. The system includes a fully custom, highly secure Admin CMS (Content Management System) for staff to manage all website content without technical knowledge.

---

### 2. Target Users

- **Prospective Students:** Seeking admission information, course details (MBBS, Nursing), fee structures, and campus life.
- **Current Students:** Accessing notifications, exam results, hostel information, library resources, and anti-ragging policies.
- **Patients/Public:** Looking for hospital services, OPD timings, contact details, and facility information.
- **Faculty & Staff:** Accessing departmental information, research publications, and administrative links.
- **Admin/Content Managers:** Non-technical staff who need to publish news, update tenders, manage gallery, and maintain institutional data via the Admin Panel.

---

### 3. Problem Statement
The institution requires a modern, accessible, and highly performant web presence that unifies academic information (departments, faculty, library) with administrative transparency (tenders, RTI, affiliations) and student services. The system must also provide a powerful, secure, and intuitive CMS backend so non-technical staff can manage all content independently.

---

### 4. Core Features (Implemented — V2)

#### 4.1 Public Website
- **Dynamic Department Portals:** Detailed pages for Pre-clinical, Para-clinical, and Clinical departments featuring HOD profiles, faculty lists, and academic goals.
- **Faculty Directory:** Searchable and filterable directory of all doctors and teaching staff.
- **News & Events with Rich Media:** Full-article news system with rich text, multiple inline images (glassmorphism lightbox gallery), and PDF attachment support.
- **Tenders & Downloads:** Public tender listings with PDF download links.
- **Central Library Hub:** Extensive library resources, rules, and digital links.
- **Committee Sections:** Dedicated pages for statutory committees (Anti-Ragging, Gender Harassment, Women's Grievance).
- **Student Services:** Results, admission brochures, notifications, and hostel details.
- **Marathi Typography:** Professional Devanagari rendering via Google's `Mukta` font with full font-fallback safety chain.

#### 4.2 Admin Panel (`/portal-jbmgmc`)
- **Ultra-Secure Route:** Admin accessible only at an obfuscated URL (`/portal-jbmgmc`), invisible to bots.
- **Progressive Login Lockout:** Failed attempts trigger animated warnings and a full timed lockout screen.
- **Grand Dashboard V2:** Live stats (6 tiles), 4 charts, System Health Score, Activity Feed, and Attention Alerts.
- **Storage Manager:** View, filter, sort, and delete server files. Automatically detects orphaned/unlinked files.
- **Next-Gen Rich Text Editor:** TipTap-based editor with inline images, drag-resize, image cropping, color highlighting.
- **Auto File Cleanup:** Deleting a News item automatically deletes its associated server files.

---

### 5. User Stories

- *As a prospective student, I want to download the admission brochure so I can understand the eligibility criteria.*
- *As a patient, I want to find the contact details and location of the hospital.*
- *As a medical student, I want to view my department's faculty list and research publications.*
- *As a content admin, I want to publish a Marathi news article with photos so the community can stay informed.*
- *As a content admin, I want to clean up old uploaded files to keep the server storage healthy.*
- *As an administrator, I want the login system to lock out attackers who guess the wrong password repeatedly.*

---

### 6. Scope (V2 — Current Dev Branch)

- [x] Fully responsive UI for mobile and desktop.
- [x] Home page with hero slider, announcements, and quick links.
- [x] Departments list and individual department pages.
- [x] News & Events with rich text, multiple images, lightbox gallery, and pagination.
- [x] Tenders page with PDF download.
- [x] Contact Us page with functional UI and map.
- [x] Light/Dark mode support.
- [x] Secure Admin Panel at `/portal-jbmgmc` with JWT auth.
- [x] Grand Dashboard with charts and health metrics.
- [x] Storage Manager with orphan detection.
- [x] Rich Text Editor (TipTap) with image crop and resize.
- [x] Auto-deletion of physical files on content delete.
- [x] Marathi font support (Mukta) with font-fallback.
- [x] Progressive Login Lockout with SYSTEM LOCKED screen.

---

### 7. Success Metrics

- **Performance:** 90+ Lighthouse score on desktop and mobile.
- **Security:** Zero predictable admin URL exposure; rate-limited login; nonce-based CSP.
- **Content Freshness:** Admin staff can publish new news, tenders, and gallery items without developer intervention.
- **Accessibility:** Zero contrast or layout shift errors.

---

### 8. Features Explicitly Removed

- **Google Translate / next-intl CMS Translation:** The experimental multi-language translation engine (Google Translate widget + next-intl middleware + Hindi/Marathi DB fields) was fully rolled back. The website now serves content in the language it is entered (English or Marathi/Hindi Unicode text directly in the CMS).

---

### 9. Features to Implement in V3 (Future)

- Live chat / WhatsApp support button.
- Backend email delivery for the Contact Us form (currently frontend-only).
- Patient appointment booking integration (external eHospital system).
- Automated server-side image compression on upload.
- User role management (multiple admin users with different permission levels).
