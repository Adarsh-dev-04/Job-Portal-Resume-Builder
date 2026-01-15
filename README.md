# 📝 Resume Builder – Full Stack Web Application

A modern **Resume Builder web application** that allows users to create, preview, download, and manage professional resumes with optional authentication for persistent storage.

🔗 **Live Demo:** https://resume-builder-lilac-two.vercel.app  
🔗 **Backend API:** https://resume-builder-backend-pgzy.onrender.com  

---

## 🚀 Features

### 👤 Guest Mode
- Build resume without login
- Live preview while typing
- Download resume as **ATS-friendly PDF**
- Warning before refresh if changes are unsaved

### 🔐 Authenticated Users
- Secure login & signup using **JWT authentication**
- Save resumes persistently to database
- Create **multiple resumes per user**
- Rename & delete resumes
- Resume list accessible via header dropdown
- Resume auto-load on refresh
- Account management (delete account & data)

### 📄 Resume Sections
- Personal Information
- Education
- Experience
- Projects
- Skills
- Languages
- Certifications

---

## 🛠️ Tech Stack

### Frontend
- **React (Vite)**
- Tailwind CSS
- React Hooks
- React Icons
- @react-pdf/renderer (PDF generation)

### Backend
- **Node.js**
- **Express.js**
- MongoDB + Mongoose
- JWT Authentication
- bcrypt (password hashing)
- CORS enabled API

### Deployment
- Frontend: **Vercel**
- Backend: **Render**
- Database: **MongoDB Atlas**

---

## 🧠 Architecture Overview

Frontend (React)
│
│ REST API (JWT Protected)
▼
Backend (Express + Node)
│
▼
MongoDB Atlas
