<p align="center">
  <img src="/frontend/hack-sprint/src/assets/readme.png" alt="HackSprint Logo" width="800"/>
</p>

<h1 align="center">🚀 HackSprint</h1>
<h3 align="center">Hack The Limits — A Centralized Hackathon & Skill-Building Platform</h3>

---

## 📌 Overview

**HackSprint** is a dynamic, all-in-one web platform built to ignite a culture of innovation, collaboration, and hands-on technical learning within the student community of **IIT Jodhpur**.

Designed by students, for students — the platform enables structured **bi-weekly hackathons**, **daily coding & aptitude challenges**, and a **public peer-reviewed leaderboard system** — all crafted to build real-world tech skills.

---

## 🧠 Core Idea

> Empowering students to transition from passive learners to **active developers**.

HackSprint is a **centralized ecosystem** where students:
- 🚧 Build real-world projects
- 🧩 Solve daily coding & logic-based challenges
- 🔁 Compete in hackathons regularly
- 📈 Track growth through a transparent leaderboard
- 🌐 Gain exposure to full-stack technologies

---

## 🎯 Why HackSprint?

- 🎓 **Built for IITJ**: Homegrown and aligned with campus culture
- 🔄 **Closes the Gap**: Brings consistency in practice and team collaboration
- 🌍 **Community Learning**: Transparent, peer-reviewed, and open-sourced
- 🧠 **Real Experience**: Mimics industry-style development cycles

---

## 💡 Key Features

### 🛠️ Bi-Weekly Hackathons
- Realistic, themed problem statements
- GitHub + Live deployment (e.g., Vercel, Netlify)
- Judged on completeness, innovation, and code quality
- Top performers climb the leaderboard

### ⚡ Daily Dev & Aptitude Challenges
- Tech questions across full-stack topics
- Aptitude & logical puzzles
- Immediate feedback & learning explanations
- Designed for brain training and upskilling

### 📊 Leaderboard System
- Tracks participation, consistency, and performance
- Encourages healthy competition and visibility
- Public submissions help peer learning & review

---

## 🌱 What You'll Gain

- ✅ Stronger development habits
- ✅ Real-world Git & CI/CD experience
- ✅ Better problem-solving approach
- ✅ A portfolio full of practical work
- ✅ Readiness for internships, placements & startup roles

---

## 🔐 Authentication

- Login via **Google** or **GitHub OAuth**.
- Access restricted pages (like submitting solutions or viewing questions) require authentication.
- After login, users are redirected to a personalized dashboard.

---

## 🌐 Platform Structure

### 1️⃣ **User Login**
- Social login options (Google/GitHub).
- Once logged in, user is redirected to the **Home Page**.

### 2️⃣ **Application Home Section**
- Navigation for:
  - **Live Hackathons**
  - **Expired Hackathons**
  - **Leaderboard**
  - **Daily Dev Quests**
- Displays user-specific content and submission history.

### 3️⃣ **Brief Hackathon Detail**
- Detailed problem statement
- Reference materials
- "Submit Here" section with GitHub/Deployment link upload

### 4️⃣ **Dev Quest Section**
- Aptitude and reasoning MCQs
- Displays question with 4 options
- Immediate feedback after each answer
- Encourages analytical thinking
  
---

```mermaid
flowchart TD
    A[👤 User Registration/Login] --> B[📅 Dashboard]
    B --> C[⚙️ Hackathons Explore]
    B --> G[🧠 Dev Quests]
    B --> H[🏆 Leaderboard Scoring & Peer Review]
    C --> D[🔗 GitHub Code & Deployment Submission]
    G --> E[🧪 Aptitude & Software Devlopment Challenges]
    E --> F[🧳 Personal Portfolio Growth]