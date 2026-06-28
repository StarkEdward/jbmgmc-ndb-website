# Technical Requirements Document (TRD)
## Jannayak Birsa Munda Government Medical College & Hospital (GMC Nandurbar) Website

**Document Version:** 2.0
**Date:** June 2026
**Status:** Active Development (dev branch)

---

### 1. Frontend Stack

- **Framework:** Next.js 16 (App Router / Turbopack).
- **Language:** TypeScript (strict mode — `npx tsc --noEmit` must pass with zero errors).
- **Styling:** Tailwind CSS v4 (utility-first, no inline styles).
- **UI Components:** Radix UI primitives via `shadcn/ui`.
- **Icons:** Lucide React.
- **Rich Text Editor:** `@tiptap/react` with extensions: `StarterKit`, `Image`, `TextAlign`, `Color`, `Highlight`, `TextStyle`, `LineHeight`, and a custom `ResizableImage` node (drag-to-resize + image cropping via `react-image-crop`).
- **Charts:** `Recharts` (BarChart, PieChart, AreaChart, LineChart) — rendered only client-side (`mounted` guard to prevent hydration mismatch).
- **Theming:** `next-themes` for Dark/Light mode switching (persisted in localStorage).
- **Toasts:** `sonner` library for all admin action feedback.

---

### 2. Typography

- **Primary (English):** `Inter` — Google Fonts (variable font, `latin` subset).
- **Serif / Headings:** `Merriweather` — Google Fonts (`latin` subset, weights 400 & 700).
- **Devanagari (Marathi/Hindi):** `Mukta` — Google Fonts (`devanagari` + `latin` subsets, weights 400/500/600/700). Loaded as a CSS variable (`--font-mukta`), injected into the `--font-sans` fallback chain. All fonts use `display: swap` to prevent FOIT (Flash of Invisible Text).
- **Font Stack:** `'Inter', var(--font-mukta), 'Inter Fallback', system-ui, sans-serif`

---

### 3. Backend Stack

- **API Strategy:** Next.js Route Handlers (`app/api/*`) and auth-guarded Server Actions (`'use server'`).
- **Structured Telemetry:** Asynchronous, non-blocking JSON logger (`lib/logger.ts`) writing output streams to `data/app.log` and `data/error.log` with automatic log rotation.
- **File Upload API:** `POST /api/upload` — validates MIME type via magic bytes, generates a sanitized filename (underscores, not hyphens), stores to `public/uploads/`, and returns the public URL.
- **File Delete API:** `DELETE /api/storage/delete` — admin-auth-guarded endpoint that physically deletes a file from the server filesystem.
- **Storage List API:** `GET /api/storage` — returns a list of all files in `public/uploads/` with metadata (size, modified date). Cross-referenced with DB content to detect orphaned files.

---

### 4. Database Architecture

- **Engine:** Headless split-file JSON database (`lib/db.ts`).
- **Collections:** Segmented into 5 logical groups: `settings.json`, `departments.json`, `news_events.json`, `gallery_hero.json`, and `pages_nav.json`.
- **Schema — News Events:** Each record supports: `id`, `type` (`news`|`event`|`tender`), `title`, `date`, `description`, `fullDescription` (rich HTML string), `images[]` (array of uploaded image URLs), `pdfUrl` (string), `isSpotlight` (boolean), `createdAt`.
- **Concurrency Safety:** Non-blocking async writes utilizing temporary files and atomic renames (`fs.promises.rename`) to guarantee database state integrity and prevent corruption.
- **Caching Layer:** Sync cache boot on start, utilizing NFS/EFS-compatible debounced file modification time checks (1000ms interval) to automatically synchronize changes across horizontal container clusters.
- **Automated Backups:** Pre-write collection backups stored in `data/backups/`, maintaining the 10 most recent versions.

---

### 5. Authentication & Session Management

- **Protocol:** Custom JWT-based authentication using native Node.js WebCrypto APIs.
- **Timing Attack Mitigation:** Constant-time comparison (`crypto.timingSafeEqual`) on SHA-256 hashed buffers for both username and password matches.
- **Active Session Registry:** In-memory UUID verification tracking active sessions. Session IDs are removed immediately on logout, preventing stolen cookie replay attacks.
- **Server Action Guards:** Administrative server actions use a global `runAction` wrapper that validates session cookies at runtime and throws unauthorized exceptions immediately upon session expiration or token mismatch.
- **Progressive Lockout:** Failed login attempts are tracked in component state and `localStorage`. After 3 failures: warning animation. After 5 failures: full-screen "SYSTEM LOCKED" overlay with a 5-minute countdown timer. Timer persists across page refreshes via `localStorage`.

---

### 6. Admin Panel Architecture

- **Base Route:** `/portal-jbmgmc` (obfuscated from the original `/admin` — all old `/admin/*` routes are retired).
- **Layout:** `app/portal-jbmgmc/layout.tsx` — provides the persistent sidebar and session check wrapper.
- **Exit Flow:** Clicking "Back to Public Site" shows a beautiful custom Glassmorphism modal (not a browser `confirm()`) with Logout + Cancel options.

#### Admin Sidebar Navigation (Current)

| Label | Route | Icon |
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

---

### 7. API Endpoints

- `GET /api/public-data` — Returns aggregated public JSON data. Output strings are sanitized at the database query layer.
- `POST /api/upload` — Secure file upload with magic bytes MIME verification, sanitized filename generation (underscores), stored to `public/uploads/`.
- `DELETE /api/storage/delete` — Auth-guarded. Physically deletes a file from `public/uploads/` on the server filesystem.
- `GET /api/storage` — Auth-guarded. Lists all files in `public/uploads/` with metadata, cross-referenced with DB content for orphan detection.
- `GET /api/health` — Telemetry health route returning status checks (metrics and internal system metadata stripped for security).
- `POST /api/auth/login` — Handles login. Rate-limited per IP.
- `POST /api/auth/logout` — Invalidates active session token from the in-memory registry.

---

### 8. Security Hardening & Mitigations

- **Obfuscated Admin URL:** Admin panel at `/portal-jbmgmc` — not discoverable by standard bot scanners targeting `/admin`, `/wp-admin`, etc.
- **Progressive Login Lockout:** Client-side lockout after 5 failed attempts with a persistent countdown timer (localStorage).
- **Anti-IP Spoofing:** Rate limiters rely on Nginx-controlled `X-Real-IP` and Cloudflare-controlled `CF-Connecting-IP` headers using `getClientIp()` to prevent IP spoofing bypasses.
- **Magic Bytes Validation:** Uploaded file buffers are validated against raw byte signatures (JPEG, PNG, GIF, WEBP, PDF, and ZIP/OpenXML containers) to block execution of HTML/PHP payloads renamed with fake extensions.
- **Strict Content Security Policy (CSP):** Configured in `next.config.mjs` with dynamic nonces to block `'unsafe-eval'` and `'unsafe-inline'`. Nonces are generated fresh per-request in `middleware.ts`.
- **SSRF & Proxy Prevention:** Wildcard hostname `remotePatterns` removed from Next.js image configurations.
- **Error Stack Masking:** Catch-all handlers return generic user-facing errors, keeping paths and code traces inside server logs only.
- **Auto File Cleanup:** Deleting a News/Event record via the admin panel automatically deletes all associated physical files from the server, preventing sensitive data accumulation.

---

### 9. Known Removed Features

- **Google Translate Widget:** Completely removed from `components/header.tsx` (both desktop dropdown and mobile select). No `googtrans` cookies are set.
- **`next-intl` Middleware:** Completely removed. No `/[locale]/` route prefixing, no `messages/` JSON files.
- **Translation DB Fields:** `title_hi`, `title_mr`, `description_hi`, `description_mr` and similar fields were never persisted in the database schema and are not present in any form or API.
- **Legacy `/admin` Route:** Retired. Replaced by `/portal-jbmgmc`.

---

### 10. Deployment Configuration

- **Containerization:** Multistage alpine `Dockerfile` utilizing standalone output compilation.
- **Orchestration:** `docker-compose.yml` with persistent named volumes. Default fallbacks are removed to prevent default-credentials exposures.
- **Process Manager:** `pm2.config.js` clustering configuration for VPS host configurations.
- **Proxy Configuration:** `nginx.conf` reverse proxy template. Ensures `X-Real-IP` is set from `$remote_addr`.
- **System Maintenance:** `scripts/backup.sh` shell script for daily compressed database backups (retaining 30 versions) and `logrotate.conf` rules.
