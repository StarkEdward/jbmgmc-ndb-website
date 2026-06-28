# UX App Flow Document
## Jannayak Birsa Munda Government Medical College & Hospital (JBMGMC) — Complete Screen & Interaction Map

**Document Version:** 2.0  
**Date:** June 2026  
**Author:** UX Strategy  
**References:** PRD v2.0 · TRD v2.0  
**Purpose:** Complete screen-by-screen, state-by-state UX specification sufficient for an AI coding agent to build without guessing.

---

## How to Read This Document

Each screen entry follows this structure:
- **URL** — the exact route
- **Layout** — which shell wraps the page
- **Sections** — every visible content block, top to bottom
- **User Actions** — every button, link, and interactive element
- **States** — Default, Loading, Empty, Success, Error for every interactive component
- **Navigation Outcomes** — what happens after every action

---

## 1. GLOBAL PATTERNS (Present on all public pages)

### 1.1 Announcement Banner (Top of all public pages)

**Component:** `AnnouncementBanner` — rendered before `<Header>` on every page

**Default State:**
- Full-width colored strip at the very top of the viewport (above header)
- Background: accent/alert color (amber/yellow or admin-configured color)
- Content: scrolling ticker with announcement text items, separated by bullet separators
- Items auto-scroll horizontally in a looping marquee animation
- Pinned items appear with a 📌 pin icon

**Empty State (no announcements in DB):**
- Banner is hidden (`display: none`) — no empty space left behind

**User Actions:**
- Ticker scrolls continuously — no user interaction required
- Admin-configurable text, no click behavior

---

### 1.2 Header (`<Header>`)

**Renders on:** All public pages  
**Behavior:** Transparent on page load → glass-blur + shadow appears after scrolling 20px down

**Anatomy (desktop, top-to-bottom):**

**Top Bar (above main nav):**
- Left: `<MapPin>` Address text (from `collegeInfo.address`)
- Left: `<Phone>` Phone (from `collegeInfo.phone`) — clickable `tel:` link
- Left: `<Mail>` Email (from `collegeInfo.email`) — clickable `mailto:` link
- Left: `<Clock>` Office hours text
- Right: Dark/Light mode toggle button

> ⚠️ **Note (V2):** The Google Translate language selector has been fully removed. The website now natively supports Marathi/Hindi Unicode text entered directly into the CMS, rendered via the `Mukta` Google Font. No translation widget or `googtrans` cookie is set.

**Dark/Light Toggle — States:**
| State | Visual |
|---|---|
| Light Mode | Moon icon shown |
| Dark Mode | Sun icon (amber) shown |
| Click | Toggles theme, persists in system preference |

**Main Navigation Bar:**
- Left: Logo image (`/images/logo.png`) + College name text → links to `/`
- Center: Navigation menu items (dynamic from DB or hardcoded fallback)
- Right: Search icon (Ctrl+K) + Dark mode toggle

**Navigation Items (default fallback):**

| Label | href | Has Dropdown |
|---|---|---|
| Home | `/` | No |
| About Us | `/about` | Yes → About Us, Faculty |
| Committees | `/committees` | Yes → Anti-Ragging, Gender Harassment, Women's Grievance |
| Departments | `/departments` | Yes → Pre-Clinical, Para-Clinical, Clinical anchors |
| Central Library | `/library` | Yes → 14 sub-sections |
| Administration | `#` | Yes → NMC Attendance, Nextgen eHospital, MUHS Letter, RTS, RTI |
| Students Corner | `/students-corner` | Yes → Brochures, Fee Info, Results, etc. |
| Nursing | `/nursing` | Yes → MUHS Mandate |
| Events | `/events` | No |
| Contact Us | `/contact` | No |

**Dropdown Behavior (desktop):**
- Hover over parent nav item → dropdown opens after 0ms delay
- Mouse leave → dropdown closes after 150ms delay (grace period)
- Dropdown renders below parent item with white card, border, shadow

**Mobile Navigation:**
- Hamburger `<Menu>` icon shown instead of full nav links
- Click hamburger → full-height slide-in menu panel from left
- Panel shows all nav items stacked vertically
- Sub-menus expand inline (accordion-style) on click
- Click `<X>` or outside → menu closes

**Search (Ctrl+K / Search Icon):**
- Click search icon OR press `Ctrl+K` / `Cmd+K` → opens Command Dialog overlay
- See Section: **Global Component Flows → Ctrl+K Search**

---

### 1.3 Footer (`<Footer>`)

**Renders on:** All public pages  
**Background:** Primary dark color

**Anatomy (4-column grid on desktop, stacked on mobile):**

**Column 1 — College Info:**
- Logo + "JBMGMC" + "Nandurbar"
- 1-2 sentence institutional description
- `<Heart animate-pulse>` "Serving the community since establishment"

**Column 2 — Quick Links:**
- Title: "Quick Links" (with accent bar)
- 6 links: About Us, Courses, Departments, Doctors, PG/Hostel, Gallery
- Each link: accent dot → hover transitions to full accent color

**Column 3 — Useful Links:**
- Title: "Useful Links" (with accent bar)
- 5 external links (open in new tab):
  - MUHS Nashik → `https://www.muhs.ac.in/`
  - e-logbook MUHS → `https://elogbook.muhs.ac.in/`
  - DMER Mumbai → `https://dmer.maharashtra.gov.in/`
  - Medical Education & Drug → `https://medical.maharashtra.gov.in/`
  - Woman safety admin → `#` (to be linked)

**Column 4 — Contact Us:**
- `<MapPin>` Address (from `collegeInfo`)
- `<Phone>` Phone → `tel:` link
- `<Mail>` Email → `mailto:` link

**Below columns — Affiliations Strip:**
- Badges: NMC India, MUHS Nashik, ABHA Card, Yoga Day, PMJAY India, Digital India

**QR Code Section (2 cards side by side):**
- Anti-Ragging Cell: QR image + "Scan to report ragging"
- Women's Safety: QR image + "Scan to report complaints"

**Map + Visitor Counter (2-column row):**
- Left: Google Maps `<iframe>` showing college location (8/12 width)
- Right: Live Visitor Counter display
  - Label: "Live Visitor Registry"
  - Displays 6 individual digit boxes (like an odometer)
  - Each digit: monospace font on dark background
  - Loading state: displays placeholder `000000`
  - Error state: displays fallback hardcoded count `678582`

**Bottom Bar:**
- "© 2026 JBMGMC Nandurbar. All rights reserved."
- "Developed and Maintained by: Sagar Kamble"
- "Government of Maharashtra"

**Institutional Affiliates Logo Strip (above footer, separate `<div>`):**
- White/light background bar
- 7 logos: MUHS, NMC, Yoga Day, ABHA Card, Maharashtra Govt, PMJAY, Digital India
- Logos: grayscale by default → full color on hover → scale up on hover
- Horizontal scroll on mobile (hide-scrollbar, snap-x)

---

### 1.4 Announcement Popup

**Component:** `AnnouncementPopup` — rendered inside home page, after `<Footer>`

**Default State (first visit):**
- After 1.5s delay: modal dialog appears centered over page with dark overlay
- Contains: title, body text, optional CTA button
- Close button (X) in top-right corner

**User Actions:**
| Action | Outcome |
|---|---|
| Click X | Modal closes, dismissed for this session |
| Click CTA button | Navigates to configured URL, modal closes |
| Click overlay background | Modal closes |
| Press Escape | Modal closes |

**States:**
- **Active (admin-enabled):** Popup shows on first page load
- **Disabled (admin-disabled):** Popup never shows, component renders nothing
- **Empty content:** Popup shows but with placeholder text (avoid in production)

---

## 2. PUBLIC WEBSITE — SCREENS

---

### SCREEN 1: Home Page — `/`

**URL:** `/`  
**Layout:** `AnnouncementBanner` + `Header` + `main` + `Footer` + `AnnouncementPopup`  
**Rendering:** SSR (fresh on every load)

**Sections (top to bottom):**

#### Section 1.1 — Latest Announcement Ticker
- Thin strip immediately below header
- Shows most recent news/circular in scrolling text
- Click → navigates to `/events` or the linked page

#### Section 1.2 — Welcome Banner (`BannerSection`)
- Full-width institutional banner image (`slider-design-s.webp`)
- `width: 100%`, `height: auto` — shows complete image without cropping
- No interactive elements

#### Section 1.3 — Hero Slider (`HeroSection`)
- Full-screen image carousel (auto-plays every 5 seconds)
- 3 slides (configurable from admin)
- Each slide: full-bleed background image + overlaid text (title, subtitle)
- No prev/next arrows (removed) — only bottom dot indicators
- Bottom content overlay:
  - Headline text with animation on slide change
  - 3 CTA Buttons side by side:

| Button | Label | href | Style | Animation |
|---|---|---|---|---|
| Primary | Admissions | `/courses` | Green solid (`bg-accent`) | Lava-rail green border glow |
| Secondary | Departments | `/departments` | Transparent glass | Lava-rail blue border glow |
| Secondary | Our Doctors | `/doctors` | Transparent glass | Lava-rail blue border glow |

- **Dot Indicators:** One dot per slide at bottom center
  - Active dot: filled accent color
  - Inactive dot: white/muted with opacity
  - Click dot → jumps to that slide

**Loading State:** Skeleton of same height visible until image loads

#### Section 1.4 — Quick Links (`QuickLinksSection`)
- Grid of icon-button tiles (admin-configurable)
- Each tile: large icon + label
- Hover: card lifts + icon scales up
- Click tile → navigates to configured URL

**Empty State (no quickLinks in DB):** Section hidden entirely

#### Section 1.5 — Welcome Section (`WelcomeSection`)
- 2-column: left = text content, right = image
- Text: institution tagline, founding year, mission statement
- "Learn More" button → `/about`
- Image: campus photo with rounded corners, drop shadow

#### Section 1.6 — Stats Section (`StatsSection`)
- 4–6 number cards in a row
- Numbers animate (count up from 0 to final value) when section scrolls into viewport
- Driven centrally by `institutionMetrics` from the Global Data Hub
- Example metrics displayed: Beds, Doctors, Departments, Students

**Empty State:** Section hidden if `institutionMetrics` lacks data

#### Section 1.7 — News & Events (`NewsEventsSection`)
- 2-tab interface: "News" tab | "Events" tab
- Default active tab: "News"
- News cards: date badge + title + short description
- Events cards: date + title + location + description
- "View All" button at bottom → `/events`

**Tab Switch Behavior:**
| Action | Outcome |
|---|---|
| Click "Events" tab | Content crossfades to events list |
| Click "News" tab | Content crossfades back to news list |

**Empty State (no news):**
- News tab: "No news available at the moment." message
- Events tab: "No upcoming events." message

#### Section 1.8 — Ministers Section (`MinistersSection`)
- 2 profile cards side by side
- Maharashtra Health Minister + Medical Education Minister
- Each card: photo, name, designation, portfolio badge
- Hover: subtle scale + shadow

#### Section 1.9 — Dean's Message (`DeanSection`)
- Photo of Dean (left) + message text (right) — or stacked on mobile
- Dean's name, designation, qualification below photo
- Message: 2–3 paragraphs of formal welcome text
- Read more / collapse behavior if message is long

#### Section 1.10 — Meet Authorities (`MeetAuthoritiesSection`)
- Horizontal scrollable row of authority profile cards
- Each card: circular photo, name, designation
- Hover: name/designation highlights

#### Section 1.11 — All Authorities (`AuthoritiesSection`)
- Full grid of all authority profiles
- Grouped by category (Administrative, Academic, etc.)
- Each card: photo, name, designation, department

#### Section 1.12 — Facilities (`FacilitiesSection`)
- Section header: "Campus & Hospital Facilities"
- 6 animated stat cards (Total Area, Hospital Beds, OTs, ICU Beds, Lecture Halls, Library Books) — count-up animation on scroll into view
- **Tile Grid:** Initially shows 8 of 12 facility tiles in 4-column grid
- Each tile: icon + title + description
- Hover: icon box changes to solid primary color, card lifts

**Cascade Arrow (View All / Show Less):**
| State | Visual | Behavior |
|---|---|---|
| Collapsed (default) | Bouncing `<ChevronDown>` + "View All Facilities" text | Click → expands to show all 12 tiles |
| Expanded | `<ChevronDown rotate-180>` + "Show Less" text | Click → collapses back to 8 tiles |

#### Section 1.13 — Departments (`DepartmentsSection`)
- Horizontal scrollable department chip list or grid preview
- Click department chip → `/departments/[id]`
- "View All Departments" CTA → `/departments`

#### Section 1.14 — Testimonials (`TestimonialsSection`)
- Rotating quote cards from students/alumni
- Auto-rotates every 4 seconds
- Name, designation, and quote text

**Empty State:** Section hidden if no testimonials in DB

#### Section 1.15 — Custom Blocks (`CustomBlocksSection`)
- Admin-configurable promotional/informational content blocks
- Each block: image + heading + text + optional CTA

**Empty State:** Section hidden if no customBlocks in DB

---

### SCREEN 2: About Us — `/about`

**URL:** `/about`  
**Layout:** Header + main + Footer  
**Rendering:** ISR (1h revalidation)

**Sections:**

#### 2.1 — Hero
- Full-bleed primary background with blurred `about_bg.webp` background overlay
- "About Us" label + H1: "Jannayak Birsa Munda Government Medical College & Hospital"
- Tagline: "Serving with Skill. Healing with Heart. Leading with Vision."
- Below: Large campus photo displayed as 3-panel clip-path mosaic (left/center/right panels)
- Hover on mosaic: all 3 panels scale up simultaneously (transition)

#### 2.2 — Introduction
- 2-column: left text + right campus image
- Left: "Our Institution" badge + H2 + 2 descriptive paragraphs
- Right: `clg_image.webp` with rounded corners, border, hover scale

#### 2.3 — Vision & Mission
- 2 cards side by side: Vision card + Mission card
- Each: colored icon + heading + bullet points or description

#### 2.4 — Key Strengths
- 6-card grid of institutional strengths
- Each: icon + title + description
- Stagger-in animation on scroll

#### 2.5 — Timeline / History
- Vertical timeline of key milestones (founding year → present)
- Each milestone: year + event description

#### 2.6 — Accreditations
- Logo grid: NMC, MUHS, Maharashtra Govt, DMER badges
- Brief description of each affiliation

#### 2.7 — Core Values
- Grid of value tiles: Compassion, Excellence, Innovation, Integrity, Community
- Each: icon + label

---

### SCREEN 3: Departments Listing — `/departments`

**URL:** `/departments`  
**Layout:** Header + main + Footer  
**Rendering:** SSR

**Sections:**

#### 3.1 — Hero
- Primary background + "Departments" H1
- Sub-text: "Explore our medical departments"

#### 3.2 — Department Category Tabs
- 3 anchor links / tab buttons:
  - Pre-Clinical Departments (`#pre-clinical`)
  - Para-Clinical Departments (`#para-clinical`)
  - Clinical Departments (`#clinical`)
- Sticky below hero, scrolls page to anchored section on click

#### 3.3 — Pre-Clinical Grid (`id="pre-clinical"`)
- H2: "Pre-Clinical Departments"
- Card grid (2–4 columns)
- Each department card:
  - Icon / illustration
  - Department name
  - 1-line description
  - "View Department →" link → `/departments/[id]`
- Hover: card lifts + border highlights

#### 3.4 — Para-Clinical Grid (`id="para-clinical"`)
- Same layout as Pre-Clinical

#### 3.5 — Clinical Grid (`id="clinical"`)
- Same layout as Pre-Clinical

**Empty State (no departments in DB):**
- All 3 grids show: Icon + "No departments available yet." message

---

### SCREEN 4: Individual Department — `/departments/[id]`

**URL:** `/departments/[id]` (dynamic route)  
**Layout:** Header + main + Footer  
**Rendering:** SSR

**States:**

**404 State (invalid department ID):**
- Renders `not-found.tsx` — "Department not found" with back button

**Default State (department found):**

#### 4.1 — Hero
- Department name H1 + category badge (Pre-Clinical / Para-Clinical / Clinical)
- Short description

#### 4.2 — About the Department
- `fullDescription` text, formatted prose
- If `pdfLink` exists: "Download Department PDF" button → opens PDF in new tab

#### 4.3 — Head of Department
- HOD profile card: photo (if available, else initials avatar) + name + designation + qualification

#### 4.4 — Faculty List
- Table or card grid of all `doctors[]` in this department
- Each row/card: Name, Designation, Qualification, Experience
- If `regNo` available: registration number shown

#### 4.5 — Academic Goals & Objectives (conditional)
- Rendered only if `goals[]` or `objectives[]` arrays exist
- Bullet-point list format

#### 4.6 — Clinical Services (conditional)
- Rendered only if `services[]` array exists
- Each service: name + description

#### 4.7 — Research Publications (conditional)
- Rendered only if `researchPublications[]` exists
- Grouped by doctor name → list of publication titles and journals

#### 4.8 — Non-Teaching Staff (conditional)
- Simple table: Post, Name

#### 4.9 — Lab Investigations (conditional)
- Data table with year-wise statistics

#### 4.10 — Academic Activities (conditional)
- Bullet list of CMEs, workshops, conferences

**Back Navigation:**
- "← Back to Departments" link at top of page → `/departments`

---

### SCREEN 5: Doctors Directory — `/doctors`

**URL:** `/doctors`  
**Layout:** Header + main + Footer  
**Rendering:** CSR (client-side, uses `useLiveData`)

**Sections:**

#### 5.1 — Hero
- "Our Team" label + "Doctors Directory" H1
- Sub-text about the faculty team

#### 5.2 — Search & Filter Bar (sticky, `z-30`)
- **Search Input:** Placeholder: "Search doctors by name, qualification, or department..."
  - Filters list in real-time as user types
  - Searches: `doctor.name`, `doctor.qualification`, `doctor.department`
- **Department Dropdown:** "All Departments" + all department names
- **Designation Dropdown:** "All Designations" + all unique designations

**Filter Interactions:**
| Action | Outcome |
|---|---|
| Type in search | Instant filter — results count updates above grid |
| Select department | Narrows doctors to that department |
| Select designation | Narrows to that designation |
| All three combined | AND logic — must match all active filters |

#### 5.3 — Results Count
- "Showing **N** doctors" text
- If search active: "Showing **N** doctors matching **"query"**"

#### 5.4 — Doctor Cards Grid (grouped by designation)
- Designation groups in order: Professor & HOD → Professor → Associate Professor & HOD → Associate Professor → Assistant Professor
- Each group has a header: `[Designation]` + separator line + "N doctors" count
- Doctor card layout:
  - Circular avatar (initials — first letter of first + second word of name)
  - Name (bold) + Designation (primary color)
  - `<Building2>` Department name → clickable link to `/departments/[id]`
  - `<GraduationCap>` Qualification (truncated if long)
  - `<Briefcase>` "X years experience"
- Hover: card border highlights + lifts 1px

**Empty State (no results):**
- `<User>` icon (large, muted)
- "No doctors found"
- "Try adjusting your search or filter criteria"
- **"Clear Filters" button** → resets all 3 filters to default

#### 5.5 — Stats Strip (bottom, primary background)
- Animated counters reading directly from `institutionMetrics.academicStats` and `hospitalStats`

---

### SCREEN 6: Gallery — `/gallery`

**URL:** `/gallery`  
**Layout:** Header + main + Footer  
**Rendering:** CSR

**Sections:**

#### 6.1 — Hero
- Background image (`college-building.webp`) at 20% opacity behind primary color
- "Photo Gallery" H1 + subtitle

#### 6.2 — Category Filter Bar (sticky, `z-30`)
- 5 toggle buttons: All | Campus | Academics | Hospital | Events
- Each has a matching Lucide icon
- Active category: `variant="default"` (solid primary button)
- Inactive: `variant="outline"`

**Filter Interactions:**
| Action | Outcome |
|---|---|
| Click category | Grid re-filters with Framer Motion `AnimatePresence` (fade+scale animation) |
| Click "All" | Shows all gallery images |

#### 6.3 — Photo Grid
- 4-column grid (responsive: 1→2→3→4 columns)
- Each tile: `aspect-[4/3]` image with `object-cover`
- Hover: image scales to 110% + gradient overlay fades in from bottom
- Hover overlay shows: title + category label

**Click tile:** Opens Lightbox (see Section: Global Component Flows → Lightbox)

**Empty State (no images in selected category):**
- `<Image>` icon (large, muted)
- "No images found in this category." text

#### 6.4 — Video Gallery Section
- 3 video placeholder cards
- Each: 16:9 aspect ratio, play button icon centered
- Label: "Video Coming Soon"
- No click action in V1

---

### SCREEN 7: Events — `/events`

**URL:** `/events`  
**Layout:** Header + main + Footer  
**Rendering:** SSR

**Sections:**

#### 7.1 — Hero
- "Events" H1 + sub-text

#### 7.2 — Events Grid / List
- Cards for upcoming and past events
- Each card: Date badge (prominent) + title + description + optional full-description expand
- "Read More" toggle → expands full description inline
- Tags: "Upcoming" (green) / "Past" (gray) based on date comparison

**Empty State (no events in DB):**
- Calendar icon (large, muted)
- "No events found." + "Check back later for upcoming events."

---

### SCREEN 8: Courses & Admissions — `/courses`

**URL:** `/courses`  
**Layout:** Header + main + Footer  
**Rendering:** SSR

**Sections:**

#### 8.1 — Hero
- "Admissions 2025–26" H1 + sub-text

#### 8.2 — Course Cards
- Card per course (MBBS, Nursing, etc.)
- Each card: course name, seats, duration, eligibility criteria, fees
- "Download Brochure" button → opens PDF link in new tab

#### 8.3 — Eligibility & Selection Process
- Accordion or step-by-step list
- NEET eligibility, merit list, counselling process

#### 8.4 — Fee Structure Table
- Table: Course | Annual Fee | Hostel Fee | Stipend

#### 8.5 — Downloads Section
- List of downloadable PDFs (brochures, forms, calendars)
- Each: filename + file type badge + "Download" button → opens PDF

---

### SCREEN 9: Central Library — `/library`

**URL:** `/library`  
**Layout:** Header + main + Footer  
**Rendering:** SSR

**Sections (with anchor IDs for deep linking from nav):**

| Anchor | Content |
|---|---|
| `#intro` | Library introduction + history |
| `#head` | Head of the institute (librarian profile card) |
| `#staff` | Library staff member cards |
| `#committee` | Library committee member table |
| `#books` | Books catalog summary (count + searchable list) |
| `#journals` | Subscribed journals list |
| `#timing` | Timings table: Mon–Fri / Sat / Sun & Holidays |
| `#rules` | Numbered list of library rules |
| `#newspaper` | Newspaper titles list |
| `#e-library` | External e-library resource links |
| `#question-papers` | Links to past question papers by year |
| `#contact` | Library contact details |

**External Link:** Knimbus Digital Library → opens `https://gmcnandurbar.knimbus.com` in new tab

---

### SCREEN 10: Committees — `/committees`, `/committees/[type]`

**URL:** `/committees/anti-ragging`, `/committees/gender-harassment`, `/committees/womens-grievance`  
**Layout:** Header + main + Footer  
**Rendering:** SSR

**Sections (same template for all 3 committee types):**

#### 10.1 — Hero
- Committee name H1 + policy badge

#### 10.2 — Policy & Mandate
- Description of the committee's legal mandate and purpose

#### 10.3 — Committee Members Table
- Columns: Sr. No. | Name | Designation | Role in Committee

#### 10.4 — Reporting / Complaint Mechanism
- How to report (QR code / phone / email)
- Anti-Ragging: National helpline 1800-180-5522
- Women's: Contact details + complaint form

#### 10.5 — Downloads (optional)
- Relevant government circulars or policy PDFs

---

### SCREEN 11: Hostel / PG — `/hostel`

**URL:** `/hostel`  
**Layout:** Header + main + Footer  
**Rendering:** SSR

**Sections:**
- PG (Postgraduate) hostel details
- Room types and allocation policy
- Facilities list (gym, mess, wifi, etc.)
- Warden contact details (name, phone)
- Rules and regulations list
- Photo gallery tiles (reuses gallery images tagged "hostel")

---

### SCREEN 12: Tender — `/tender`

**URL:** `/tender`  
**Layout:** Header + main + Footer  
**Rendering:** SSR

**Sections:**
- Page title: "Government Tenders"
- Table or card list of active tenders
- Each row: Tender title + Date published + Closing date + "Download" PDF button

**Empty State:**
- "No active tenders at this time." message

---

### SCREEN 13: Contact Us — `/contact`

**URL:** `/contact`  
**Layout:** Header + main + Footer  
**Rendering:** CSR

**Sections:**

#### 13.1 — Hero
- "Contact Us" H1 + sub-text

#### 13.2 — Contact Info Cards (4 cards in a row)
Each card has a distinct color theme:

| Card | Icon | Color | Content |
|---|---|---|---|
| Address | `<MapPin>` | Blue | Full college address |
| Phone | `<Phone>` | Emerald | 2 phone numbers |
| Email | `<Mail>` | Rose | 2 email addresses |
| Office Hours | `<Clock>` | Amber | Mon–Sat, 9AM–5PM |

All cards: hover → border glow in card's theme color + slight lift

#### 13.3 — Department Contacts Table
Static table:
- Dean Office | Academic Section | Hospital Administration | Admission Cell | Emergency
- Each row: Department name + phone + email

#### 13.4 — Contact Form + Map (2-column)

**Left: Contact Form**
- Fields:
  - Full Name (required)
  - Email (required, type="email")
  - Phone Number
  - Subject
  - Message (textarea, 4 rows)
- Submit button: "Send Message" with `<Send>` icon

**Form States:**
| State | Visual |
|---|---|
| Default | All fields empty, submit button active |
| Filling | Inputs highlight on focus with primary border |
| Submitting | Submit button disabled (no spinner shown in V1) |
| Success | Form replaced by `<CheckCircle>` icon + "Thank you! Message sent." text, auto-resets after 5 seconds |
| Error | Toast error notification (not yet implemented in V1 — form is frontend-only) |

> ⚠️ Note: V1 contact form is visual-only — no backend email sending. Data is not persisted. V2 needs server-side form handler + email delivery.

**Right: Google Maps `<iframe>`**
- Embedded map showing JBMGMC location
- Full height matching form
- Rounded corners
- On poor connection: shows Google's own error message inside iframe

#### 13.5 — Social Media Links
- Facebook + Instagram icons (from `collegeInfo`)
- Click → opens social page in new tab

---

### SCREEN 14: 404 — Not Found

**URL:** Any unmatched route  
**Component:** `app/not-found.tsx`  
**Layout:** Standalone (no header/footer — standalone centered layout)

**Content:**
- Large illustrated icon or stylized "404" text
- "Page not found" heading
- Short message: "The page you're looking for doesn't exist."
- "Go to Home" button → `/`

---

### SCREEN 15: Loading (Global)

**Component:** `app/loading.tsx`  
**Trigger:** Between route navigations (Suspense boundary)

**Content:**
- Full-page centered spinner or skeleton
- Institution logo (pulsing animation)

---

### SCREEN 16: Error (Global)

**Component:** `app/error.tsx`  
**Trigger:** Unhandled render error in any route

**Content:**
- "Something went wrong" heading
- Brief user-friendly error message
- "Try again" button → triggers error boundary reset
- "Go Home" link → `/`

---

## 3. ADMIN PANEL — SCREENS

**Base URL:** `/portal-jbmgmc`
> ⚠️ **V2 Change:** The admin panel has been permanently moved from `/admin` to `/portal-jbmgmc`. The old `/admin` route is retired. This obfuscation prevents automated bot attacks.

**Shell:** Fixed sidebar navigation + main content area
**Requires:** Valid admin session cookie (JWT)

---

### SCREEN A1: Admin Login — `/portal-jbmgmc/login`

**URL:** `/portal-jbmgmc/login`
**Layout:** Standalone (no sidebar, no public header/footer)
**Rendering:** CSR

**Background:**
- Dark cyber-aesthetic background with radial gradient decorations (teal top-right, navy bottom-left)
- Blurred ambient glow behind the form card

**Anatomy (top to bottom, centered):**

1. **Back link:** `← Back to Public Portal` → `/`
   - Hover: arrow slides left, text turns teal
2. **Logo + Name:** College logo + "JBMGMC Nandurbar" + "Government Medical College Admin Workspace"
3. **Login Card:**
   - "Staff Authentication" heading + "Enter your administrative key to continue" subtitle
   - `<Lock>` icon in header
   - Label: "Security Access Key"
   - Password input (`type="password"`)
     - Placeholder: `••••••••••••`
     - Right icon: `<ShieldCheck>`
   - "Access Dashboard" submit button (full width, teal)
4. **Security notice:** "This system is restricted to authorized administrative personnel."

**Form States:**
| State | Visual |
|---|---|
| Default | Empty password field, button active |
| Typing | Characters appear as `•` dots |
| Submitting | Button disabled, shows `<Loader2 animate-spin>` + "Verifying Keys..." text |
| Success | Toast: "Access granted! Opening Admin Dashboard..." → redirects to `/portal-jbmgmc` |
| Wrong password (1–2 fails) | Toast error: "Authentication failed" — subtle warning |
| Wrong password (3–4 fails) | Card shakes with red border animation + escalating warning text |
| Wrong password (5+ fails) | Full-screen "SYSTEM LOCKED" overlay with countdown timer (5 min). Persists across page refresh via localStorage. |
| Empty submission | Toast error: "Please enter the administrator password" |
| Network error | Toast error: "An error occurred during login. Please try again." |

---

### ADMIN SHELL: Sidebar + Layout

**Renders on:** All `/portal-jbmgmc/*` pages except `/portal-jbmgmc/login`

**Sidebar (left, fixed, `w-72`):**
- Top: Logo + full college name + Dark mode toggle + Close button (mobile)
- Navigation items (11 items):

| Label | href | Icon |
|---|---|---|
| Dashboard | `/portal-jbmgmc` | LayoutDashboard |
| Dynamic Pages | `/portal-jbmgmc/pages` | FileText |
| Departments & Staff | `/portal-jbmgmc/departments` | Building2 |
| News & Events | `/portal-jbmgmc/news-events` | Megaphone |
| Campus Gallery | `/portal-jbmgmc/gallery` | Image |
| Courses & Hostels | `/portal-jbmgmc/courses-hostel` | GraduationCap |
| Committees & Library | `/portal-jbmgmc/committees-library` | Shield |
| Site Builder | `/portal-jbmgmc/site-builder` | Palette |
| Storage Manager | `/portal-jbmgmc/storage` | HardDrive |
| Global Settings | `/portal-jbmgmc/settings` | Settings |
| Institution Data | `/portal-jbmgmc/institution-data` | Database |

- Active item: teal gradient background + `<ChevronRight>` indicator
- Bottom: Admin identity card (avatar initials + name + role) + "Sign Out" button

**Exit to Public Site Flow:**
| Action | Outcome |
|---|---|
| Click college logo/name in sidebar | Opens Glassmorphism exit modal with two options: "Logout & Go to Site" and "Cancel" |
| Choose "Logout & Go to Site" | Logs out session, redirects to `/` |
| Choose "Cancel" | Closes modal, stays in admin |

**Sign Out behavior:**
| Action | Outcome |
|---|---|
| Click "Sign Out" button | `logoutAction()` called → toast "Logged out successfully" → redirect to `/portal-jbmgmc/login` |
| Sign out error | Toast error "Logout failed" |

**Mobile (< lg breakpoint):**
- Hamburger icon in top header bar → toggles sidebar (slide-in from left)
- Click outside or X button → closes sidebar

---

### SCREEN A2: Admin Dashboard — `/portal-jbmgmc`

**URL:** `/portal-jbmgmc`
**Layout:** Admin shell

**Sections:**

#### A2.1 — Welcome Header
- "Dashboard" H1
- "Welcome back. Here is the operational overview of JBMGMC Nandurbar."
- Date + time display (live)

#### A2.2 — Stats Tiles Grid (6 tiles)
| Tile | Value source | Icon |
|---|---|---|
| Departments | `totalDepartments` | Building2 |
| Active Doctors | `totalDoctors` | Users |
| Academic Courses | `totalCourses` | GraduationCap |
| Gallery Media | `totalGallery` | Image |
| News Articles | `totalNews` | Newspaper |
| Storage Used | Calculated from file sizes | HardDrive |

Each tile: hover → scale to 102%, accent border glow

#### A2.3 — System Health Score
- A single large circular score (0–100)
- Calculated from: DB integrity, last backup date, storage usage, active news count
- Color: Green (>80) → Amber (50–79) → Red (<50)

#### A2.4 — Analytics Charts (2 rows, 2-column each)
**Row 1 Left (8/12): Faculty Distribution Bar Chart**
- X axis: Department names; Y axis: Doctor count
- Recharts `BarChart` with teal gradient fill
- Tooltip on hover: department name + doctor count

**Row 1 Right (4/12): Course Allocation Pie Chart**
- Recharts `PieChart` (donut) with 4 teal shades
- Custom legend: course name + colored dot + seat count

**Row 2 Left: News Publishing Activity (Area Chart)**
- Recharts `AreaChart` — news items published per month

**Row 2 Right: Gallery Growth (Line Chart)**
- Recharts `LineChart` — gallery images uploaded over time

**All Charts:** Rendered only after `mounted = true` guard (prevents SSR/hydration mismatch)

#### A2.5 — Attention Alerts
- Auto-generated list of items needing attention:
  - Orphaned files detected in storage
  - News items older than 90 days without update
  - Tenders past their closing date
- Each alert: icon + message + quick action link

#### A2.6 — Activity Feed
- Recent admin actions (last 10) logged from `data/app.log`
- Each entry: timestamp + action description

#### A2.7 — Quick Actions
- 6 shortcut tiles:
  - "Publish News" → `/portal-jbmgmc/news-events`
  - "Add Faculty" → `/portal-jbmgmc/departments`
  - "Upload Photo" → `/portal-jbmgmc/gallery`
  - "Add Tender" → `/portal-jbmgmc/news-events`
  - "Manage Storage" → `/portal-jbmgmc/storage`
  - "Global Settings" → `/portal-jbmgmc/settings`

---

### SCREEN A3: Departments & Staff — `/admin/departments`

**URL:** `/admin/departments`  
**Layout:** Admin shell

**Sections:**

#### A3.1 — Departments List
- Table or card list of all departments
- Columns: Dept. Name | Category | HOD | # Doctors | Actions
- **Actions per row:**
  - `Edit` button → opens DepartmentEditor panel/modal
  - `Delete` button → confirmation dialog → delete

#### A3.2 — Add Department Button
- "+ Add Department" button (top right)
- Click → opens blank DepartmentEditor

#### A3.3 — Department Editor (in-page panel or full-page form)
- **Basic Info fields:**
  - Department Name (text)
  - Category (select: Pre-Clinical / Para-Clinical / Clinical)
  - Short Description
  - Full Description (rich text / textarea)
  - PDF Link (URL)
- **Extended Fields (optional, shown/hidden via accordion):**
  - Goals (array — add/remove items)
  - Objectives (array)
  - Skills (array)
  - Non-Teaching Staff (array: post + name)
  - Research Publications (array: doctor name + publication list)
  - Services (array: name + description)
  - Equipment Details (table)
  - Academic Activities (array)
- **Faculty Management:**
  - Table of current doctors in this department
  - `Edit Doctor` → inline edit form
  - `Delete Doctor` → confirmation → remove from array
  - `+ Add Doctor` → inline form:
    - Name, Designation, Qualification, Experience, Email, Reg. No., Photo URL
- **Save Button:** Saves all changes to `db.json` via Server Action
- **Cancel Button:** Discards changes, returns to list

**States:**
| State | Visual |
|---|---|
| Saving | Button: spinner + "Saving..." |
| Save success | Toast: "Department updated successfully" |
| Save error | Toast: "Failed to save. Please try again." |
| Delete confirmation | Dialog: "Are you sure? This cannot be undone." with Confirm/Cancel |
| Delete success | Toast: "Department deleted" → item removed from list |

---

### SCREEN A4: News & Events — `/portal-jbmgmc/news-events`

**URL:** `/portal-jbmgmc/news-events`
**Layout:** Admin shell

**Sections:**

#### A4.1 — Tab Interface: "News" | "Events" | "Tenders"

**News Tab:**
- Table of all news items: Date | Title | Preview | Images | Actions
- Sticky "Actions" column always visible
- `Edit` → opens full editor panel
- `Delete` → Custom Tailwind modal (not browser `confirm()`) → on confirm: deletes DB record AND all associated physical image/PDF files from server
- `+ Add News` button: opens editor panel

**News Editor Panel (Add/Edit):**
- Date (date picker)
- Title (text)
- Short Description (textarea)
- **Full Description:** TipTap Rich Text Editor with:
  - Bold, Italic, Underline, Strikethrough
  - Text color picker + Highlight color picker
  - Alignment (left, center, right, justify)
  - Line height control
  - Inline Image: Upload → crop via `react-image-crop` → insert into editor
  - Drag-to-resize inserted images
- **Multiple Image Uploads:** Upload up to N images per article. Shows current images with delete option.
- **PDF Attachment:** Upload one PDF. Shows current PDF filename as clickable link.
- `isSpotlight` toggle: pins this item as featured
- Save → Server Action → toast success/error → on success auto-deletes removed images from server

**Events Tab:** Same pattern as News.

**Tenders Tab:**
- Table: Title | Date | PDF | Actions
- `+ Add Tender` → form with Title, Date, PDF Upload
- Delete → custom modal → deletes DB record + PDF file from server

**States (all tabs):**
| State | Visual |
|---|---|
| Loading | Skeleton rows |
| Empty list | "No items yet. Click + to add." |
| Saving | Button spinner + "Saving..." |
| Success | Toast + item appears/updates in table |
| Error | Toast error |
| Delete | Custom branded modal → confirm → toast + row removed |

---

### SCREEN A5: Campus Gallery — `/portal-jbmgmc/gallery`

**URL:** `/portal-jbmgmc/gallery`
**Layout:** Admin shell

**Sections:**

#### A5.1 — Gallery Grid with Pagination
- Paginated image grid (12 items per page) of all gallery photos
- Each tile: image thumbnail + title + category badge + action icons overlay on hover
- Pagination controls at bottom

**Hover overlay actions:**
- `Edit` pencil icon → edit caption/category modal
- `Delete` trash icon → custom confirmation modal

#### A5.2 — Upload New Photo
- "+ Upload Photo" button
- Click → opens upload panel:
  - **Drag-and-drop zone** OR **Click to browse** file selector
  - Accepted: image files only (validated by magic bytes on server)
  - Preview of selected image shown
  - Title field (text)
  - Category select: Campus / Academics / Hospital / Events
  - Alt text field
  - Upload button → POST `/api/upload` → saves to `/public/uploads/` → adds to DB

**Upload States:**
| State | Visual |
|---|---|
| Default | Dashed drop zone with upload icon |
| File selected | Image preview appears, fields enabled |
| Uploading | Progress indicator / spinner |
| Success | Toast: "Photo uploaded successfully" + image appears in grid |
| Error (wrong type) | Toast: "Please select an image file" |
| Error (upload fail) | Toast: "Upload failed. Please try again." |

**Delete States:**
- Custom branded modal: "Delete this photo? This cannot be undone."
- Confirm → removes from DB + physically deletes file from `/public/uploads/` + success toast

---

### SCREEN A5b: Storage Manager — `/portal-jbmgmc/storage`

**URL:** `/portal-jbmgmc/storage`
**Layout:** Admin shell

**Purpose:** Allows admins to view, filter, sort, and clean up all uploaded files on the server.

**Sections:**

#### A5b.1 — Stats Strip
- Total files count
- Total storage used (human-readable: MB/GB)
- Orphaned files count (files not linked to any DB record)

#### A5b.2 — Filter & Sort Controls
- **Sort by:** Name | Date Modified | File Size
- **Filter by type:** All | Images | PDFs
- **Default sort:** Orphaned files first (most important for cleanup)

#### A5b.3 — File Table
- Columns: Filename | File Type | Size | Modified Date | Status | Actions
- **Status badge:**
  - 🟢 "Linked" — file is referenced by at least one DB record
  - 🔴 "Orphaned" — file exists on server but is not referenced anywhere
- **Actions per row:**
  - `Preview` → opens file in new tab
  - `Delete` → custom modal → on confirm: physically deletes from server via `DELETE /api/storage/delete`

**States:**
| State | Visual |
|---|---|
| Loading | Skeleton rows |
| Empty | "No files uploaded yet." message |
| Delete confirm | Custom modal: "Permanently delete [filename]? This cannot be undone." |
| Delete success | Toast: "File deleted" + row removed |
| Delete error | Toast: "Failed to delete file" |

---

### SCREEN A6: Courses & Hostels — `/admin/courses-hostel`

**URL:** `/admin/courses-hostel`  
**Layout:** Admin shell

**Sections:**

#### A6.1 — Tab Interface: "Courses" | "Hostel"

**Courses Tab:**
- List of courses (MBBS, Nursing, etc.)
- Edit course details: name, seats, duration, eligibility, fees, brochure PDF URL
- Reorder courses (drag handle if implemented)

**Hostel Tab:**
- Form to edit hostel info: name, description, warden details, facilities list, rules
- Save → updates `hostelInfo` in DB

---

### SCREEN A7: Committees & Library — `/admin/committees-library`

**URL:** `/admin/committees-library`  
**Layout:** Admin shell

**Sections:**

#### A7.1 — Tab Interface: "Anti-Ragging" | "Gender Harassment" | "Women's Grievance" | "Library"

**Committee Tabs (each identical structure):**
- Add/Remove committee members
- Each member: Name, Designation, Role in Committee
- Reorder members
- Edit committee description/policy text

**Library Tab:**
- Edit library stats: books count, journals count, newspapers count
- Edit timings (add/remove timing rows: Day + Hours)
- Edit library rules (add/remove bullet items)
- Edit staff members
- Edit external resource links (Knimbus URL, e-library links)

---

### SCREEN A8: Site Builder — `/admin/site-builder`

**URL:** `/admin/site-builder`  
**Layout:** Admin shell

**Sections:**

#### A8.1 — Tab Interface: "Announcements" | "Hero Slider" | "Custom Blocks" | "Popup"

**Announcements Tab:**
- List of ticker items with text and "pinned" toggle
- `+ Add Item` → text field + pinned toggle
- Reorder items (pinned items appear first)
- Delete item

**Hero Slider Tab:**
- List of slide items: image URL + title + subtitle + order number
- Edit each slide
- `+ Add Slide`
- Delete slide
- Reorder slides (up/down arrows or drag)

**Custom Blocks Tab:**
- List of content blocks
- Each block: image URL + heading + body text + CTA label + CTA URL
- Add/Edit/Delete blocks

**Popup Tab:**
- Active toggle (on/off switch)
- Title field
- Body text (textarea)
- CTA label + CTA URL
- Save → updates popup config in DB

---

### SCREEN A9: Global Settings — `/admin/settings`

**URL:** `/admin/settings`  
**Layout:** Admin shell

**Sections:**

#### A9.1 — Tab Interface: "College Info" | "Navigation" | "Quick Links" | "Stats"

**College Info Tab:**
- Edit: institution name, address, phone, email, established year, social media URLs
- Save → updates `collegeInfo` in DB

**Navigation Tab:**
- Visual tree editor of nav menu items
- Add top-level link (label + href)
- Add sub-menu item under any top-level link
- Delete items
- Reorder items

**Quick Links Tab:**
- Grid editor of quick link tiles
- Each: icon name + label + href
- Add/remove/reorder


---

### SCREEN A10: Institution Data Hub — `/admin/institution-data`

**URL:** `/admin/institution-data`  
**Layout:** Admin shell

**Sections:**
- Global Metrics Tab (Academic Stats, Hospital Stats, Campus Stats)
- About Tab (Vision, Mission)
- Admissions Tab (Overview text)
- Library Tab (Intro text, KNimbus URL)

---

### SCREEN A11: Dynamic Pages — `/admin/pages`

**URL:** `/admin/pages`  
**Layout:** Admin shell

**Sections:**
- List of configurable static pages (About, Contact, etc.)
- Edit page content in rich text editor
- Preview changes
- Save → updates page content in DB

---

## 4. GLOBAL COMPONENT FLOWS

---

### 4.1 Ctrl+K Command Search

**Trigger:** 
- Click search icon in header
- Press `Ctrl+K` (Windows/Linux) or `Cmd+K` (Mac)

**Opening:**
- Command Dialog (full-screen dark overlay) slides open with animation
- Focus auto-placed in search input

**Interface:**
- "Search pages, departments..." placeholder
- Type to search

**Search Results Display:**
- Grouped by: Pages | Departments | Doctors
- Each result: icon + label
- Keyboard: `↑` `↓` arrows to navigate results, `Enter` to select
- Mouse: click any result

**Selecting a result:**
- Dialog closes
- Browser navigates to the result's URL

**Empty State (no matching results):**
- "No results found." message

**Closing:**
- Press `Escape`
- Click outside the dialog
- Select a result (auto-closes)

---

### 4.2 Gallery Lightbox

**Trigger:** Click any photo tile in the gallery grid

**Opening:**
- Full-viewport dark overlay (`bg-foreground/95`) fades in
- Image rendered centered in `max-w-4xl` container
- Image: `object-contain` inside `aspect-[4/3]` box
- Below image: title + category + "N / Total" counter

**Navigation Controls:**
| Control | Position | Behavior |
|---|---|---|
| `<X>` close | Top-right corner | Click → close lightbox |
| `<ChevronLeft>` prev | Left edge, vertically centered | Click → show previous image; disabled + opacity 30% if first image |
| `<ChevronRight>` next | Right edge, vertically centered | Click → show next image; disabled + opacity 30% if last image |

**Keyboard Navigation:**
- `←` arrow key → previous image
- `→` arrow key → next image
- `Escape` → close lightbox

**States:**
| State | Visual |
|---|---|
| First image | Left arrow disabled (opacity 30%) |
| Last image | Right arrow disabled (opacity 30%) |
| Middle image | Both arrows enabled |

---

### 4.3 Facilities Cascade Toggle

**Location:** Home page, Facilities section

**Default State:**
- 8 tiles visible
- Below grid: "View All Facilities" text + bouncing `<ChevronDown>` arrow

**Expanded State:**
- All 12 tiles visible
- Arrow rotates 180° (points up)
- "Show Less" text

**Toggle Behavior:**
- Click arrow/button → `setIsExpanded(!isExpanded)` → grid re-renders with `displayedFacilities`
- No animation on grid itself (instant show/hide) — individual tile entrance animations on load

---

## 5. NAVIGATION FLOW MAP

```
/ (Home)
├── /about
├── /departments
│   └── /departments/[id]
│       └── (Back to /departments)
├── /doctors
│   └── (click dept name) → /departments/[id]
├── /gallery
├── /events
├── /courses
│   └── (Download PDF) → /public/downloads/*.pdf [new tab]
├── /library
│   ├── /library#intro
│   ├── /library#books
│   ├── /library#timing
│   └── (Knimbus link) → https://gmcnandurbar.knimbus.com [new tab]
├── /committees
│   ├── /committees/anti-ragging
│   ├── /committees/gender-harassment
│   └── /committees/womens-grievance
├── /hostel
├── /tender
├── /contact
└── /portal-jbmgmc
    ├── /portal-jbmgmc/login
    │   └── (success) → /portal-jbmgmc
    ├── /portal-jbmgmc (Dashboard)
    ├── /portal-jbmgmc/departments
    ├── /portal-jbmgmc/news-events
    ├── /portal-jbmgmc/gallery
    ├── /portal-jbmgmc/storage  ← NEW
    ├── /portal-jbmgmc/courses-hostel
    ├── /portal-jbmgmc/committees-library
    ├── /portal-jbmgmc/site-builder
    ├── /portal-jbmgmc/settings
    ├── /portal-jbmgmc/pages
    └── /portal-jbmgmc/institution-data
```

---

## 6. RESPONSIVE BREAKPOINTS

| Breakpoint | Width | Layout Changes |
|---|---|---|
| `sm` | 640px | 2-column grids activate (cards) |
| `md` | 768px | 3 columns, 2-col text layouts, top bar becomes visible |
| `lg` | 1024px | Full desktop nav, 4-column grids, admin sidebar always visible |
| `xl` | 1280px | Max-width container constrains content, wide hero |

**Mobile-specific behaviors:**
- Header collapses to logo + hamburger icon
- All grids become single-column
- Admin sidebar hidden by default, toggled by hamburger
- Doctor filter bar stacks vertically
- Footer columns stack vertically
- Gallery grid = 2 columns

---

## 7. TOAST NOTIFICATION SYSTEM

All admin actions use `sonner` toast library for feedback.

| Trigger | Toast Type | Message |
|---|---|---|
| Successful login | Success | "Access granted! Opening Admin Dashboard..." |
| Wrong password | Error | "Authentication failed" |
| Empty password submit | Error | "Please enter the administrator password" |
| Department saved | Success | "Department updated successfully" |
| Department deleted | Success | "Department deleted" |
| News published | Success | "News item published" |
| Photo uploaded | Success | "Photo uploaded successfully" |
| Upload error | Error | "Upload failed. Please try again." |
| Setting saved | Success | "Settings saved" |
| Logout | Success | "Logged out successfully" |
| Any network error | Error | "An error occurred. Please try again." |

---

*This document is the authoritative UX specification for JBMGMC Nandurbar web application V2. Every state described above must be implemented. States marked ⚠️ are known gaps for future implementation.*
