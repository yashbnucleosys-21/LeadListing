# 📊 LeadListing – Business Lead Management Dashboard

[![React](https://img.shields.io/badge/Frontend-React%20(Vite)-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js-green?logo=node.js)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)](https://www.postgresql.org/)
[![Deployed on Vercel](https://img.shields.io/badge/Frontend-Vercel-black?logo=vercel)](https://vercel.com/)
[![Deployed on Render](https://img.shields.io/badge/Backend-Render-purple?logo=render)](https://render.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> A full-stack **Lead Management Dashboard** developed by [**Yash Bhilare**](https://www.linkedin.com/in/yashbhilare21/) for managing business leads, follow-ups, users, and call histories in a single place.  
> Built with **React (Vite)** frontend, **Node.js + Express** backend, and **PostgreSQL** database — deployed on **Vercel + Render**.

---

## 🌐 Live Demo

Frontend: **[https://lead-listing.vercel.app/](https://lead-listing.vercel.app/)**  
Backend API: **[https://leadlisting.onrender.com](https://leadlisting.onrender.com)**

---

## ✨ Key Features

- 🔐 **Secure Login System** with role-based access (Admin / Employee)  
- 🧑‍💼 **Employee Management** — Admins can add, update, and organize employees by departments  
- 📞 **Lead Management** — Add, view, and filter leads  
- 📊 **Dashboard Overview** — Displays:
  - Total Leads  
  - New Leads  
  - Today’s Follow-ups  
  - Active Calls  
  - Conversion Rate  
- 📁 **Call History Page** — Track all call interactions  
- 🕒 **Follow-ups Page** — Manage scheduled lead follow-ups  
- 👥 **Users Page** — List all users department-wise  
- ⚙️ **Roles Page** — Define Admins, Employees, and their permissions  
- 💾 **Secure Data Handling** — Protected API routes and database security

---

## 🏗️ Architecture & Tech Stack

| Layer | Technology |
|-------|-------------|
| Frontend | React (Vite) |
| Backend | Node.js + Express |
| Database | PostgreSQL |
| ORM / Query Tool | Prisma / Sequelize *(depending on setup)* |
| Hosting (Frontend) | Vercel |
| Hosting (Backend + DB) | Render |

---

## ⚙️ Local Development Setup

### 1️⃣ Prerequisites
- Node.js v18+  
- npm or yarn  
- PostgreSQL (local or cloud instance)  
- Git  

### 2️⃣ Clone Repository
```bash
git clone https://github.com/yashbnucleosys-21/LeadListing.git
cd LeadListing
```
3️⃣ Backend Setup
```bash
Copy code
cd backend
npm install
```
Create .env file:
```bash
DATABASE_URL=postgresql://<username>:<password>@<host>:<port>/<dbname>
JWT_SECRET=your_secret_key
```
Start backend:
```bash
npm run dev
# Server running on http://localhost:5000
```
4️⃣ Frontend Setup
```bash
cd ../frontend
npm install
```
Create .env.local:
```bash
VITE_API_URL=http://localhost:5000
```
Start frontend:
```bash
npm run dev
# App running at http://localhost:5173
```

## 🌐 Deployment Pipeline

### 🚀 Backend (Render)
- **Platform:** Render  
- **Type:** Web Service  
- **Build Command:** `npm install`  
- **Start Command:** `npm start`  
- **Environment Variables:**
  - `DATABASE_URL`
  - `JWT_SECRET`

### 🧩 Frontend (Vercel)
- **Platform:** Vercel  
- **Framework:** Vite + React  
- **Environment Variable:**
  - `VITE_API_URL=https://leadlisting.onrender.com`

---

## 📂 Project Structure

    LeadListing/
    ├── backend/
    │   ├── src/
    │   │   ├── routes/        # API route definitions
    │   │   ├── controllers/   # Request handlers
    │   │   ├── models/        # Database models
    │   │   └── utils/         # Utility functions
    │   ├── server.js           # Express server entry point
    │   └── package.json
    └── frontend/
        ├── src/
        │   ├── pages/          # Dashboard, Leads, Users, Roles, etc.
        │   ├── components/     # Shared UI components (tables, forms, buttons)
        │   ├── App.jsx
        │   └── App.css
        └── package.json

---

## 🤝 Contribution Guidelines

1. Fork this repository  
2. Create a feature branch: `git checkout -b feature-name`  
3. Commit your changes: `git commit -m "Added feature-name"`  
4. Push to your branch & create a Pull Request  

---

## 📜 License
This project is licensed under the **MIT License**.  
Feel free to use, modify, and distribute it with credit.

---

## 👨‍💻 Author
Developed by [**Yash Bhilare**](https://www.linkedin.com/in/yashbhilare21/) – Nucleosys Tech  
📧 **Email:** yashbhilare209@gmail.com  
🌐 **Live Demo:** [https://lead-listing.vercel.app/](https://lead-listing.vercel.app/)

⭐ If you found this project helpful, please give it a **star** on GitHub!
