# Jannayak Birsa Munda Government Medical College & Hospital (JBMGMC)

This is the official web application for JBMGMC, Nandurbar. It is a modern, highly dynamic, and responsive web application built with **Next.js**, **React**, **Tailwind CSS**, and a highly extensible custom Admin Panel.

## 🚀 Features of site : 

### Public Website
- **Dynamic Public Pages:** Home, About, Departments, Doctors, Courses, Gallery, and more.
- **News & Events with Rich Media:** Full news articles with multiple image support, interactive glassmorphism lightbox carousel, and PDF attachments.
- **Announcement Ticker:** Scrolling top-bar announcements with pin support, driven by live database.
- **Marathi Typography Support:** Google's **Mukta** font integrated with full font-fallback chain for beautiful, professional Devanagari rendering on all devices.
- **Live Visitor Counter:** Live odometer-style visitor counter in the footer, with silent error handling for ad-blockers.

### Admin Panel (`/portal-jbmgmc`)
- **Ultra-Secure Obfuscated Route:** Admin panel moved from the bot-vulnerable `/admin` to `/portal-jbmgmc`. Automated bots cannot find the login page.
- **Progressive Lockout System:** Failed login attempts trigger animated warnings → a full-screen "SYSTEM LOCKED" cyberpunk overlay with a countdown timer. Lockout persists across page refreshes.
- **Grand Dashboard V2:** Intelligent dashboard with 6 live stat tiles, 4 interactive charts (Recharts), a System Health Score, a live Activity Feed, Attention Alerts, and Quick Action shortcuts.
- **Advanced Storage Manager:** A dedicated module listing all uploaded files, detecting orphaned files (uploaded but not linked to any content), and allowing safe server-side deletion.
- **Next-Gen Rich Text Editor:** Full TipTap-based editor with inline image support, drag-to-resize, image cropping, text color/highlight, and rock-solid React 19 stability (zero `flushSync` crashes).
- **Auto File Cleanup:** Physical image and PDF files on the server are automatically deleted when their parent News/Event record is deleted.
- **Custom Modals:** All dangerous/confirmation actions use beautiful, branded Tailwind modals instead of ugly browser `alert()` / `confirm()` dialogs.

---

## 💻 Local Machine Setup Guide

Follow these steps to get the project running perfectly on any local machine (Windows, macOS, or Linux).

### 1. Prerequisites
Before you begin, ensure you have the following installed on your system:
- **Node.js**: Version `18.17.0` or higher (Version `20.x` recommended). You can download it from [nodejs.org](https://nodejs.org/).
- **Git**: To clone the repository.
- A code editor like **Visual Studio Code (VS Code)**.

### 2. Clone the Repository
Open your terminal (or Command Prompt / PowerShell) and run:
```bash
git clone <your-github-repo-url>
cd jbmgmc-ndb-website
```

### 3. Install Dependencies
The project uses `npm` as its package manager. We recommend using `--legacy-peer-deps` to avoid any version conflict issues with React / Next / Radix UI dependencies.

Run the following command in the project root:
```bash
npm install --legacy-peer-deps
```

### 4. Run the Development Server
Once dependencies are installed, you can start the local development server:
```bash
npm run dev
```
- Open your browser and navigate to: **`http://localhost:3000`**
- The site should now be running locally! Any changes you make to the code will automatically hot-reload in the browser.

---

## 🛠️ Project Architecture & Data Management

This project uses a file-based JSON database for simplicity and extreme portability, eliminating the need for a complex external SQL database setup.

- **Database File:** `data/db.json` (split into logical collection files)
- **Asset Storage:** All uploaded images and PDFs are stored in the `public/uploads/` directory.
- **Automated Backups:** Before every write, the previous database state is saved to `data/backups/` (retaining the 10 most recent versions).

### Admin Panel Access
Navigate to **`/portal-jbmgmc`** in your local or production environment.

> ⚠️ **Important:** The old `/admin` route has been permanently retired. The admin panel is now exclusively at `/portal-jbmgmc` for enhanced security against automated bot attacks.

The Admin panel features a highly organized sidebar navigation:
- **Dashboard:** Live operational overview with charts and health scores.
- **News & Events:** Publish articles with rich text, multiple images, and PDF attachments.
- **Storage Manager:** View all uploaded files, clean up orphaned files.
- **Departments & Staff, Gallery, Courses, Committees, Site Builder, Settings, Institution Data.**

Any changes made in the Admin panel will automatically read/write to the `data/` JSON files.

---

## 🔒 Security Hardening

This application has been upgraded with multiple layers of modern security protections:

- **Obfuscated Admin Route:** The admin panel URL (`/portal-jbmgmc`) is unpredictable, stopping automated bots and common attack scanners.
- **Progressive Login Lockout:** Multiple failed login attempts trigger a timed lockout, preventing brute-force attacks.
- **Middleware-Level Route Guards:** The entire `/portal-jbmgmc` folder (except the login page) is globally protected by a strong JWT session verifier in `middleware.ts`.
- **Advanced CSP (Content Security Policy):** Implements dynamic, cryptographically-secure nonces for script execution to effectively neutralize XSS (Cross-Site Scripting) attacks.
- **Magic Bytes File Validation:** Uploaded files are validated against raw byte signatures, not just file extensions, to block malicious file execution.
- **Anti-IP Spoofing Rate Limiting:** Rate limiters rely on server-controlled headers (`X-Real-IP`, `CF-Connecting-IP`) to prevent IP-spoofing bypasses.
- **Timing-Safe Authentication:** Constant-time comparison (`crypto.timingSafeEqual`) on SHA-256 hashed credentials to prevent timing-based attacks.

---

## 🌐 Typography & Language Support

The website is designed for professional **Marathi** and **Hindi** content:
- **English:** Rendered in `Inter` (Google Fonts).
- **Marathi / Hindi (Devanagari):** Automatically rendered in Google's `Mukta` font — a clean, crisp, government-standard Devanagari typeface.
- **Font Fallback:** If `Mukta` fails to load (slow network), the browser automatically falls back to the system's default Devanagari font (e.g., Nirmala UI on Windows, Roboto on Android). Content is never blank.

> ✅ **ISM V6 Compatibility:** You can type Marathi content using ISM V6 or any other Unicode-based Devanagari input tool. The website fully supports Unicode (UTF-8) Marathi text. **Do NOT use legacy ASCII fonts** (Kruti Dev, Shivaji) as they will display as garbled characters in browsers.

---

## 📦 Production Deployment

To test how the application will run in a production environment (with optimizations and static generation applied), run:

```bash
# 1. Build the project
npm run build

# 2. Start the production server
npm start
```
The production server will also run on `http://localhost:3000`, but it will serve the highly optimized, compiled version of the site.

---

## 🎨 Technologies Used

| Category | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router + Turbopack) |
| **Language** | TypeScript |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **Icons** | [Lucide React](https://lucide.dev/) |
| **UI Components** | Radix UI primitives & custom components (shadcn/ui) |
| **Rich Text Editor** | [@tiptap/react](https://tiptap.dev/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Fonts** | Inter, Merriweather, Mukta (Google Fonts) |
| **Theming** | `next-themes` (Light/Dark mode) |
| **Toasts** | `sonner` |
| **Database** | Custom headless JSON database (`lib/db.ts`) |
| **Auth** | Custom JWT via Node.js WebCrypto API |

---

## ❓ FAQ (Frequently Asked Questions)

**Q: Where is the admin panel?**
A: The admin panel is at `/portal-jbmgmc`. The old `/admin` URL is retired for security reasons.

**Q: Where is the database?**
A: The app uses a headless JSON database located in the `data/` directory (multiple `.json` collection files). It is incredibly fast and requires zero setup.

**Q: How do I upload Marathi content?**
A: Type using any Unicode-based Marathi input method (ISM V6 Unicode mode, Google Input Tools, or Windows Marathi keyboard). Paste the Unicode text into any admin field. It will render beautifully on the website using the Mukta font.

**Q: Where are uploaded images stored?**
A: In `public/uploads/`. When you delete a News item from the admin panel, the associated files are automatically deleted from the server.

**Q: Where is the live Visitor Counter getting its data?**
A: The public website footer fetches its visitor count from `counterapi.dev`. The `Visitor Counter Base Count` in Admin Settings acts as a legacy override mechanism. If the counter API is blocked (e.g., by an ad-blocker), it silently fails and shows the base count instead of crashing.

**Q: Why is my `.next` folder so large?**
A: Next.js caches compiled pages, images, and webpack files to speed up development. You can safely delete the `.next/` folder at any time to free up space. Running `npm run dev` again will generate a fresh cache.

---

## 🤝 Troubleshooting

- **Peer Dependency Conflicts on Install:** If you see `ERESOLVE` errors during `npm install`, ensure you are using the `--legacy-peer-deps` flag: `npm install --legacy-peer-deps`.
- **Build Errors (`npm run build` fails):** If you face issues while compiling, run `npx tsc --noEmit` to check for any hidden TypeScript typing errors.
- **Port in Use:** If port 3000 is occupied, Next.js will automatically try port 3001. Check your terminal output for the exact URL.
- **Changes not reflecting in production:** Next.js heavily caches data. If you update the data but the production site doesn't change, try clearing the browser cache or restarting the server.
- **Marathi text showing as boxes/gibberish:** Ensure you are using a **Unicode** Devanagari input method, not a legacy ASCII font like Kruti Dev or Shivaji.
