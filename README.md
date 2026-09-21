# GETprospeKt - B2B Publication & CMS Platform

This repository is structured into two main directories: **`frontend/`** and **`backend/`**.

---

## Project Structure

```
F:\publication-website\
├── frontend/                     # React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── components/           # Navbar, TopBar, Footer, ProtectedRoute
│   │   ├── pages/                # Home, Article, CaseStudies, Contact, Dashboard, Login, FAQ, Events
│   │   ├── services/             # api.ts (Centralized API client with offline fallback)
│   │   ├── App.tsx               # Client routes & ProtectedRoute wrapper
│   │   └── index.css             # Global typography (Lora + Inter)
│   └── package.json
│
└── backend/                      # Node.js + Express + MongoDB (Mongoose)
    ├── src/
    │   ├── config/               # MongoDB connection (db.js)
    │   ├── models/               # User, Article, CaseStudy, Resource, Newsletter, Enquiry
    │   ├── controllers/          # Business logic for all endpoints
    │   ├── routes/               # API routes (auth, articles, case-studies, enquiries, etc.)
    │   ├── middleware/           # authMiddleware (JWT verification)
    │   ├── seed.js               # Database seeder (admin user & initial content)
    │   └── server.js             # Express app entry point
    ├── .env.example
    └── package.json
```

---

## Getting Started

### 1. Backend Setup (`backend/`)

```bash
cd backend
npm install
npm run seed     # (Optional) Seeds MongoDB with initial articles, case studies, and default admin
npm run dev      # Starts server on http://localhost:5000
```

* **Environment Variables (`.env`):**
  * `PORT=5000`
  * `MONGO_URI=mongodb://127.0.0.1:27017/getprospekt`
  * `JWT_SECRET=your_jwt_secret_key`
  * `CLIENT_URL=http://localhost:5173`

* **Default Admin Account:**
  * **Email:** `admin@getprospekt.co`
  * **Password:** `admin123`

---

### 2. Frontend Setup (`frontend/`)

```bash
cd frontend
npm install
npm run dev      # Starts Vite dev server on http://localhost:5173
```

---

## Features & Highlights

* **Fullstack Separation:** Clean separation of concerns between client and server.
* **REST API:** Complete endpoints for Articles, Case Studies, Resources, Newsletters, and Contact Form Enquiries.
* **Authentication & Security:** JWT authentication with bcrypt password hashing; `/dashboard` is protected by `ProtectedRoute`.
* **Lead Capture Flow:** Public [Contact Us](file:///F:/publication-website/frontend/src/pages/Contact.tsx) submissions automatically save to MongoDB and appear in real time in the Admin Dashboard's `Enquiries` tab.
* **Offline-Resilient Client:** The frontend includes graceful offline fallbacks so the UI remains fully functional even during standalone client demonstrations.
