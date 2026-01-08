# 🚀 Chilly // Portfolio V1

![Project Banner](screenshots/home-preview.png)

> **Status:** System Online 🟢
> **Theme:** Cyberpunk / Deep Space / Glassmorphism
> **Live Demo:** [https://portfolio-chilly.vercel.app](https://portfolio-chilly.vercel.app)

## 📄 Mission Briefing
This is not just a static portfolio. It is a full-stack application built to manage my digital identity. It features a **custom Admin Dashboard** hidden behind a secure authentication system, allowing me to update projects, manage my "Experience Log", and change my bio without touching a single line of code.

Built with performance, security, and visual storytelling in mind.

## 🛠️ Tech Stack & Artifacts

| Core | Backend & Data | Styling & UI |
| :--- | :--- | :--- |
| ![Next.js](https://img.shields.io/badge/Next.js_14-black?style=flat&logo=next.z) | ![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=flat&logo=mongodb) | ![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=flat&logo=tailwind-css) |
| ![TypeScript](https://img.shields.io/badge/TypeScript-ES6-blue?style=flat&logo=typescript) | **NextAuth.js** (Security) | **Framer Motion** (Animations) |
| ![React](https://img.shields.io/badge/React-18-blue?style=flat&logo=react) | **Cloudinary** (Media CDN) | **React Icons** |

## ✨ Key Features

### 🔐 System Locked (Admin Authentication)
Instead of a generic login page, the admin route (`/admin`) simulates a secure terminal.
* **Credentials:** Custom credential provider.
* **Security:** Protected routes via Next.js Middleware.
* **Visuals:** "Access Denied" / "Access Granted" glitch animations.

![Admin Dashboard](screenshots/admin-preview.png)

### 🎛️ The Dashboard (CMS)
A fully functional Content Management System built from scratch.
* **Identity Tab:** Update Bio, Avatar, and Social Links in real-time.
* **Project Hub:** Add/Delete projects with rich data (Title, Tech Stack, Images).
* **Experience Log:** Manage work history and skills cards.

### 🎨 Visual Engineering
* **Glassmorphism:** Custom blur effects using Tailwind utilities.
* **Vignette Overlay:** Custom CSS gradients for a "deep space" feel.
* **Responsive:** Fully mobile-optimized "App-like" navigation.

## ⚙️ Local Installation (Run it yourself)

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/portfolio-chilly.git](https://github.com/YOUR_USERNAME/portfolio-chilly.git)
   cd portfolio-chilly
