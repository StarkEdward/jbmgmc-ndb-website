# Jannayak Birsa Munda Government Medical College & Hospital (JBMGMC)

This is the official web application for JBMGMC, Nandurbar. It is a modern, highly dynamic, and responsive web application built with **Next.js**, **React**, **Tailwind CSS**, and a highly extensible custom Admin Panel.

## 🚀 Features
- **Dynamic Public Pages:** Home, About, Departments, Doctors, Courses, and more.
- **Advanced Admin Panel:** A secure, tab-based administrative dashboard to manage all website content in real-time.
- **Complex Data Structures:** Full support for array-based data like educational objectives, clinical services, and faculty publications.
- **Premium UI/UX:** Built with Tailwind CSS, custom `lucide-react` icons, and smooth micro-animations using Framer Motion concepts.

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

- **Database File:** `data/db.json`
- **Asset Storage:** All uploaded images (gallery, faculty photos) are stored in the `public/images/` directory.

### Admin Panel Access
You can manage the site's content by navigating to `/admin` in your local environment.
- Any changes made in the Admin panel will automatically read/write to the `data/db.json` file on your local machine.

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
- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **UI Components:** Radix UI primitives & custom components
- **TypeScript:** Strict type-safety across all modules.

---

## ❓ FAQ (Frequently Asked Questions)

**Q: Where is the database?**  
A: For Version 1, the app uses a headless JSON database located at `data/db.json`. It is incredibly fast and requires zero setup. 

**Q: How do I change the photos on the website?**  
A: You can update photos through the `/admin` panel, or manually by dropping images into the `public/images/` folder and referencing their path in the admin panel.

**Q: Why is my `.next` folder so large?**  
A: Next.js caches compiled pages, images, and webpack files to speed up development. Over time, this folder can grow to several gigabytes. You can safely delete the `.next/` folder at any time to free up space. Running `npm run dev` again will generate a fresh, tiny cache.

---

## 🤝 Troubleshooting

- **Peer Dependency Conflicts on Install:** If you see `ERESOLVE` errors during `npm install`, ensure you are using the `--legacy-peer-deps` flag: `npm install --legacy-peer-deps`.
- **Build Errors (`npm run build` fails):** If you face issues while compiling, run `npx tsc --noEmit` to check for any hidden TypeScript typing errors.
- **Port in Use:** If port 3000 is occupied, Next.js will automatically try port 3001. Check your terminal output for the exact URL.
- **Changes not reflecting in production:** Next.js heavily caches data. If you update the data but the production site doesn't change, try clearing the browser cache, or restarting the server. During local development (`npm run dev`), changes should reflect instantly.
- **Scrollbar Flickering on Menu Hover:** This was a known issue with Radix UI modal popups, and has been resolved by setting `modal={false}` on dropdowns. Ensure you are on the latest commit.
