# Technical Requirements Document (TRD)
## Jannayak Birsa Munda Government Medical College & Hospital (JBMGMC) Website

### 1. Frontend Stack
- **Framework:** Next.js 14+ (App Router).
- **Language:** TypeScript.
- **Styling:** Tailwind CSS with custom utility classes and animations.
- **UI Components:** Radix UI (Headless components) + shadcn/ui.
- **Icons:** Lucide React.
- **Theming:** `next-themes` for seamless Dark/Light mode switching.

### 2. Backend Stack
- **API Strategy:** Next.js Route Handlers (`app/api/*`) for data fetching.
- **Data Source:** Static JSON files (`/data/`) acting as a headless CMS for V1 to ensure maximum performance and zero database maintenance overhead.

### 3. Database
- **V1:** Local JSON (e.g., `departments.json`, `collegeInfo.json`).
- **Future V2:** PostgreSQL / Supabase for dynamic content management (announcements, faculty updates).

### 4. Authentication Method
- **Public Site:** No authentication required.
- **Admin Portal (Planned):** NextAuth.js / Auth.js with JWT-based session cookies for securing `/admin` routes.

### 5. APIs Needed
- `GET /api/public-data` - Fetches aggregated JSON data for rendering public pages.
- *Google Translate API* - Client-side script integration for i18n.

### 6. Architecture
- **Rendering Strategy:** 
  - Static Site Generation (SSG) / Server-Side Rendering (SSR) for SEO-critical pages (Home, About, Departments).
  - Client-Side Rendering (CSR) for interactive components (Faculty search, Theme toggle, Gallery filters).
- **Component Design:** Atomic design principles, splitting layout shells from interactive islands (`"use client"` boundaries pushed down the tree).

### 7. Cloud / Deployment Setup
- **Hosting:** Vercel (Recommended) or traditional VPS with Node.js / PM2.
- **CI/CD:** GitHub Actions for automated testing and deployment on push to `main`.

### 8. Security Requirements
- **Headers:** Strict CSP, X-Frame-Options, and X-Content-Type-Options via `next.config.mjs`.
- **Form Protection:** Rate limiting on Contact Us API endpoints (when implemented).
- **Data Protection:** No PII exposed. All faculty data displayed is public institutional record.

### 9. Performance Requirements
- **Images:** Heavy use of `next/image` for automatic WebP conversion, resizing, and lazy loading.
- **Caching:** Next.js Data Cache and Full Route Cache to serve responses in <50ms.
- **Layout Shifts:** Strict adherence to CSS aspect ratios and `scroll-mt` offsets to prevent CLS. (e.g., `modal={false}` applied to Radix DropdownMenu to prevent scrollbar-induced layout shifts).

### 10. Third-Party Integrations
- Google Translate (Client-side widget).
- Google Maps Embed.
- eHospital / NMC external portals (via outbound links).
