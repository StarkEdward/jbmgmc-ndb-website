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
The project uses `npm` as its package manager. Run the following command in the project root to install all required libraries and dependencies:
```bash
npm install
```
*(Note: If you encounter peer dependency warnings, they can generally be ignored for this build, or you can use `npm install --legacy-peer-deps` if strictly necessary).*

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

## 🤝 Troubleshooting
- **Build Errors:** If you face issues while running `npm run build`, run `npx tsc --noEmit` to check for any hidden TypeScript errors.
- **Port in Use:** If port 3000 is occupied, Next.js will automatically try port 3001. Check your terminal output for the exact URL.
