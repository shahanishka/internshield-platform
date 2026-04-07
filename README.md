# 🛡️ InternShield

> A full-stack MERN web application that helps students discover genuine 
> internship opportunities and protect themselves from fake internship scams.

![Stack](https://img.shields.io/badge/Stack-MERN-blueviolet)
![License](https://img.shields.io/badge/License-MIT-green)
![Status](https://img.shields.io/badge/Status-Complete-brightgreen)

---

## 📌 About The Project

Internship scams are increasingly targeting college students across India. 
Fraudsters pose as companies offering high-paying remote internships and 
collect registration fees, personal documents, and bank details from 
unsuspecting applicants.

**InternShield** solves this by combining a curated internship listing 
platform with a rule-based fake message detection engine — all in one 
clean, mobile-responsive interface.

---

## ✨ Features

- 🔍 **Fake Detector** — Paste a message or upload a PDF offer letter to 
  detect scams using a weighted rule engine with 10+ red flag patterns
- 📋 **Internship Listings** — Browse verified internships with live search 
  and filters for domain, work mode, and stipend range
- ❤️ **Bookmarks** — Save internships with one click, stored per user in MongoDB
- 🚀 **Apply Tracking** — Track application status across 4 stages: 
  Applied → In Review → Selected / Rejected
- 📊 **Student Dashboard** — Profile, stats, saved internships, detection 
  history, and applications in one place
- 🔐 **JWT Authentication** — Secure signup and login with bcrypt password hashing

---

## 🧰 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite + React Router v6 |
| Backend | Node.js + Express.js |
| Database | MongoDB + Mongoose ODM |
| Authentication | JWT + bcryptjs |
| File Handling | Multer + pdf-parse |
| Styling | Custom CSS (no UI libraries) |

---

## 📁 Project Structure
```
/internshield_up
├── /client                  → React + Vite frontend
│   └── /src
│       ├── /pages           → 7 page components
│       ├── /components      → Navbar, BookmarkButton, ApplyButton
│       └── /styles          → Custom CSS per page
│
└── /server                  → Node.js + Express backend
    ├── /models              → 5 Mongoose models
    ├── /routes              → 5 route modules, 15 API endpoints
    ├── /middleware          → JWT auth middleware
    ├── /uploads             → Temporary PDF storage
    ├── index.js             → Server entry point
    └── seed.js              → Database seeder
```

---

## ⚙️ Getting Started

### Prerequisites
- Node.js v18+
- MongoDB installed and running locally

### 1. Clone the repository
```bash
git clone https://github.com/shahanishka/internshield-platform.git
cd internshield-platform
```

### 2. Setup the backend
```bash
cd server
npm install
```

Create a `.env` file inside `/server`:
```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/internshield
JWT_SECRET=your_secret_key_here
```

Seed the database with sample internships:
```bash
node seed.js
```

Start the server:
```bash
node index.js
```

### 3. Setup the frontend
```bash
cd ../client
npm install
npm run dev
```

### 4. Open the app
Visit **http://localhost:5173**

---

## 🔐 API Reference

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | /api/auth/signup | No | Register new user |
| POST | /api/auth/login | No | Login and get JWT |
| GET | /api/internships | No | Get all listings |
| GET | /api/internships/:id | No | Get single listing |
| POST | /api/detect | Yes | Analyze text or PDF |
| GET | /api/history | Yes | Get detection history |
| GET | /api/bookmarks | Yes | Get saved internships |
| POST | /api/bookmarks/:id | Yes | Save internship |
| DELETE | /api/bookmarks/:id | Yes | Remove bookmark |
| GET | /api/bookmarks/check/:id | Yes | Check if saved |
| GET | /api/applications | Yes | Get all applications |
| POST | /api/applications/:id | Yes | Mark as applied |
| PATCH | /api/applications/:id | Yes | Update status |
| DELETE | /api/applications/:id | Yes | Remove application |
| GET | /api/applications/check/:id | Yes | Check if applied |

---

## 🕵️ How the Fake Detector Works

The detection engine applies **10 weighted rules** against the input text 
using regular expressions. Each matched rule adds to a cumulative risk score.

| Rule | Weight |
|---|---|
| Payment or fee request | 3 |
| Bank / UPI details requested | 3 |
| Personal documents (Aadhaar, PAN) requested | 3 |
| Urgent language ("act now", "limited slots") | 2 |
| Unrealistic stipend (₹50,000 for 2 hrs/day) | 2 |
| Personal email sender (Gmail/Yahoo) | 2 |
| Vague job description | 2 |
| WhatsApp/Telegram only contact | 2 |
| Pre-selected without interview | 2 |
| Grammar errors / unprofessional language | 1 |

**Verdict:**
- ✅ Score 0–2 → **Genuine**
- ⚠️ Score 3–5 → **Suspicious**
- 🚨 Score 6+ → **Likely Fake**

---

## 👤 Author

**Anishka Shah**  


---

## 📄 License

This project is licensed under the MIT License.
