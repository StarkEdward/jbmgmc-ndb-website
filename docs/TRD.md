# Technical Requirements Document (TRD)
## Jannayak Birsa Munda Government Medical College & Hospital (GMC Nandurbar) Website

### 1. Frontend Stack
- **Framework:** Next.js 16 (App Router / Turbopack).
- **Language:** TypeScript.
- **Styling:** Tailwind CSS.
- **UI Components:** Radix UI primitives.
- **Icons:** Lucide React.
- **Rich Text Editor:** `@tiptap/react` for secure, clean page styling (replacing vulnerable `react-quill`).
- **Theming:** `next-themes` for Dark/Light mode switching.

### 2. Backend Stack
- **API Strategy:** Next.js Route Handlers (`app/api/*`) and auth-guarded Server Actions (`'use server'`).
- **Structured Telemetry:** Asynchronous, non-blocking JSON logger (`lib/logger.ts`) writing output streams to `data/app.log` and `data/error.log` with automatic log rotation.

### 3. Database Architecture
- **Engine:** Headless split-file JSON database (`lib/db.ts`).
- **Collections:** Segmented into 5 logical groups: `settings.json`, `departments.json`, `news_events.json`, `gallery_hero.json`, and `pages_nav.json`.
- **Concurrency Safety:** Non-blocking async writes utilizing temporary files and atomic renames (`fs.promises.rename`) to guarantee database state integrity and prevent corruption.
- **Caching Layer:** Sync cache boot on start, utilizing NFS/EFS-compatible debounced file modification time checks (1000ms interval) to automatically synchronize changes across horizontal container clusters.
- **Automated Backups:** Pre-write collection backups stored in `data/backups/`, maintaining the 10 most recent versions.

### 4. Authentication & Session Management
- **Protocol:** Custom JWT-based authentication using native Node.js WebCrypto APIs.
- **Timing Attack Mitigation:** Constant-time comparison (`crypto.timingSafeEqual`) on SHA-256 hashed buffers for both username and password matches.
- **Active Session Registry:** In-memory UUID verification tracking active sessions. Session IDs are removed immediately on logout, preventing stolen cookie replay attacks.
- **Server Action Guards:** Administrative server actions use a global `runAction` wrapper that validates session cookies at runtime and throws unauthorized exceptions immediately upon session expiration or token mismatch.

### 5. API Endpoints
- `GET /api/public-data` - Returns aggregated public JSON data. Output strings are sanitized at the database query layer.
- `POST /api/upload` - Secure file upload endpoint with MIME verification.
- `GET /api/health` - Telemetry health route returning status checks (metrics and internal system metadata stripped for security).

### 6. Security Hardening & Mitigations
- **Anti-IP Spoofing:** Rate limiters rely on Nginx-controlled `X-Real-IP` and Cloudflare-controlled `CF-Connecting-IP` headers using `getClientIp()` to prevent IP spoofing bypasses.
- **Magic Bytes Validation:** Uploaded file buffers are validated against raw byte signatures (JPEG, PNG, GIF, WEBP, PDF, and ZIP/OpenXML containers) to block execution of HTML/PHP payloads renamed with fake extensions.
- **Strict Content Security Policy (CSP):** Configured in `next.config.mjs` to block `'unsafe-eval'`. Unencrypted HTTP protocols are stripped from connections and image optimizer rules.
- **SSRF & Proxy Prevention:** Wildcard hostname remotePatterns are removed from Next.js image configurations.
- **Error Stack Masking:** Catch-all handlers return generic user-facing errors, keeping paths and code traces inside server logs.

### 7. Deployment Configuration
- **Containerization:** Multistage alpine `Dockerfile` utilizing standalone output compilation.
- **Orchestration:** `docker-compose.yml` with persistent named volumes. Default fallbacks are removed to prevent default-credentials exposures.
- **Process Manager:** `pm2.config.js` clustering configuration for VPS host configurations.
- **Proxy Configuration:** `nginx.conf` reverse proxy template. Ensures `X-Real-IP` is set from `$remote_addr`.
- **System Maintenance:** `scripts/backup.sh` shell script for daily compressed database backups (retaining 30 versions) and `logrotate.conf` rules.
