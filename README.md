# Smart Leads Dashboard 🚀

A full-stack, enterprise-grade Lead Management CRM built with the MERN stack and strict TypeScript. Designed with clean architecture, robust state management, and a highly polished UI.

![Dashboard Screenshot](frontend/public/screenshot.png)

## ✨ Key Features & Highlights

* **Role-Based Access Control (RBAC):** Admin and Sales user roles. System securely hides admin-only features (like CSV Export) from Sales users.
* **Advanced Filtering & Pagination:** Server-side pagination (10 items/page) combined with debounced multi-parameter search (Name, Email, Status, Source).
* **Activity Timeline (Standout Feature):** A chronological, real-time audit trail for every lead. Tracks who created the lead and logs every status change automatically.
* **Responsive Glassmorphism UI:** Built with Tailwind CSS v4 and Shadcn components, fully optimized for both desktop and mobile viewing.
* **Dark Mode Support:** Seamless theme toggling with user preference tracking.
* **Containerized Ecosystem:** Fully Dockerized architecture (MongoDB, Node API, Vite/Nginx Frontend) for one-command deployment.

## 🛠️ Tech Stack

* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS v4, React Query, Zustand (State Management), React Router.
* **Backend:** Node.js, Express, TypeScript, Mongoose, JSON Web Tokens (JWT), bcryptjs.
* **Infrastructure:** Docker, Docker Compose, Nginx.

## 🔐 Test Credentials

Use these credentials to test the Role-Based Access features:
* **Admin User:** `admin@crm.com` | Password: `password123` *(Has access to CSV Export)*
* **Sales User:** `rahul@crm.com` | Password: `password123` *(Standard access)*

## 🚀 Setup Instructions

### Option A: One-Click Docker Setup (Recommended)
Make sure Docker Desktop is running on your machine.
1. Clone the repository.
2. Run the following command in the root directory:
   ```bash
   docker-compose up --build