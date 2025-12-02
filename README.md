<p align="center">
  <img src="/frontend/hack-sprint/src/assets/readme.png" alt="HackSprint Logo" width="800"/>
</p>

<h1 align="center">🚀 HackSprint</h1>
<h3 align="center">Hack The Limits — A Centralized Hackathon & Skill-Building Platform</h3>

---

## 📌 Overview

**HackSprint** is a centralized ecosystem created to nurture innovation, collaborative work, and hands-on development across IIT Jodhpur. 
It enables **hackathons**, **daily developer & aptitude challenges**, **Git-based submissions**, and a **transparent leaderboard system** — all designed to build real-world developer habits.

The platform has **two main user roles**:  

1. **Students** – can participate in hackathons, daily quizzes, and track their leaderboard points.  
2. **Admins** – can create hackathon events (subject to approval by hackSprint admin), assign points, review submissions, and declare results.

---

## 🧠 Core Idea

> Enabling students to shift from passive learning to active development, while allowing administrators to manage events effectively.

HackSprint provides:  
- 🚀 Real project-building experience  
- 🧠 Daily dev & aptitude challenges  
- 🏆 Hackathons with submission tracking  
- 📊 Transparent leaderboard system  
- 🌐 Peer-reviewed submissions  
- 💻 Admin controls: approval, points assignment, result declaration  

---

## 🎯 Why HackSprint?

- 🎓 Tailored for **IITJ culture**  
- 🔄 Builds **consistency** in coding and event participation  
- 🌍 Transparent & community-driven  
- 🛠 Real-world industry-style development style  
- 📈 Helps build portfolio + placement-ready skillset  
- 🖥 Admin-friendly: manage events, review submissions, assign points  

---

## 💡 Key Features

### 🛠 Hackathons
- Students can participate in hackathons  
- Submission via GitHub + Deployment URL  
- Admins can create hackathons (requires platform admin approval to go live)  
- Admins can see all submissions, URLs, and participant details  
- Points can be assigned to each team/participant  
- Results can be declared by admins  

### ⚡ Daily Developer & Aptitude Challenges
- Students solve MCQs on software dev, logic, and aptitude  
- Instant feedback and scoring  

### 📊 Leaderboard
- Rankings based on hackathons + daily challenges + points  
- Tracks student performance and consistency  
- Public leaderboard visible to all users  

### 🔐 Authentication
- Google OAuth  
- GitHub OAuth  

### 🖥 Admin Features
- Create hackathons and events  
- Approve/reject events for publishing(Only HackSprint Platform Admin)  
- View all submissions per event  
- Assign points to participants or teams  
- Declare final results  

---

## 🧪 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React + Vite |
| **Backend** | Node.js + Express |
| **Database** | MongoDB + Redis |
| **Automation** | Kestra |
| **OAuth** | Google, GitHub |
| **Deployment** | Vercel |

---

## 📁 Folder Structure

```text
HackSprint
├── LICENSE
├── backend
│   ├── index.js
│   ├── allFolders
│   ├── package.json
│   └── ...
└── frontend
    └── hack-sprint
        ├── public
        ├── src
        ├── package.json
        └── ...
```
---

## 🌐 Frontend (.env.example)
```bash
VITE_API_BASE_URL="http://localhost:3000"
VITE_GOOGLE_CLIENT_ID="your_google_client_id_here"
VITE_GITHUB_CLIENT_ID="your_github_client_id_here"
```
---

## 🖥 Backend (.env.example)
```bash
MONGO_URL="your_mongodb_connection_url"

GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"

GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"

SECRET_KEY="your_jwt_secret_key"
JWT_EXPIRE_TIME="24h"

SMTP_USER="your_smtp_username"
SMTP_PASS="your_smtp_password"
SENDER_EMAIL="your_sender_email_address"

CLOUDINARY_CLOUD_NAME="your_cloud_name"
CLOUDINARY_API_KEY="your_cloudinary_api_key"
CLOUDINARY_API_SECRET="your_cloudinary_api_secret"

EMAIL="your_email"
EMAIL_PASS="your_email_password"

FRONTEND_URL="http://localhost:5173"
PORT=3000
```

---

## 🚀 Setup Instructions
### 1️⃣ Clone the Repository
```bash
git clone https://github.com/devlup-labs/HackSprint.git
cd HackSprint
```

### 2️⃣ Backend Setup
```bash
cd backend
npm install
nodemon index.js
```

### 3️⃣ Frontend Setup
```bash
cd frontend/hack-sprint
npm install
npm run dev
```

---

## 🐳 Docker Hub Usage
- Backend
Pull the backend image and run it:
```bash
docker pull rahul1901/hacksprintserver:latest
docker run -p 3000:3000 rahul1901/hacksprintserver:latest
```
Access the backend at: http://localhost:3000

- Frontend
Pull the frontend image and run it:
```bash
docker pull rahul1901/hacksprint:latest
docker run -p 5173:80 rahul1901/hacksprint:latest
```
Access the frontend at: http://localhost:5173

---

## 🛠 Available Scripts
| Purpose            | Command                 |
| ------------------ | ----------------------- |
| Run backend        | `nodemon index.js`         |
| Run frontend       | `npm run dev`           |

---
## 🤝 Contributing
- Fork the repository
- Clone your fork
- Create a branch
```bash
git checkout -b feature/my-feature
```
- Commit changes
```bash
git commit -m "Added new feature"
```
- Push branch
```bash
git push origin feature/my-feature
```

---
        
## 🌐 Architecture Diagram

```mermaid
flowchart TD
    subgraph STUDENT
        A[👤 Student Login] --> B[🏠 Dashboard]
        B --> C[🛠 Participate in Hackathons]
        B --> D[🧠 Daily Quizzes & Challenges]
        B --> E[🏆 View Leaderboard]
        C --> F[🔗 Submit GitHub + Deployment URLs]
    end

    subgraph ADMIN
        X[👤 Admin Login] --> Y[🛠 Create Hackathons / Events]
        Y --> Z[✅ Platform Admin Approval]
        Z --> B
        F --> M[📊 Admin Views Submissions]
        M --> N[💯 Assign Points]
        N --> E
        N --> O[📢 Declare Results]
    end
