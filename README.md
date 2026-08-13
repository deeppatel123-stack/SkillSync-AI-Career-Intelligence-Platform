# 🚀 SkillSync – AI-Powered Student Opportunity & Career Development Platform

SkillSync is a full-stack web application that connects **Students, Colleges, Companies, and Administrators** on a single platform for efficient opportunity management and AI-powered career guidance.

The platform enables students to explore internships, jobs, hackathons, workshops, and placement opportunities while providing intelligent career recommendations through Machine Learning. It also helps colleges and companies manage opportunities and applications efficiently.

---

# ✨ Features

## 👨‍🎓 Student Module

- Student Registration & Login
- Profile Management
- Resume Upload
- View Jobs, Internships, Workshops & Hackathons
- Apply for Opportunities
- Track Application Status
- View Assigned Tasks
- Resume Analysis
- Career Role Prediction
- Skill Gap Analysis
- Personalized Career Roadmap

---

## 🏫 College Module

- College Registration & Login
- College Profile Management
- Post Workshops
- Post Hackathons
- Publish Placement Opportunities
- Review Student Applications
- Monitor Student Participation

---

## 🏢 Company Module

- Company Registration & Login
- Company Profile Management
- Post Jobs & Internships
- Manage Opportunities
- Review Applications
- Accept / Reject Candidates
- Recruitment Dashboard

---

## 👨‍💼 Admin Module

- Manage Students
- Manage Colleges
- Manage Companies
- Manage Opportunities
- Monitor Applications
- Dashboard Analytics
- Platform Management

---

# 🤖 AI Features

- Resume Profile Analysis
- Career Role Prediction
- Skill Gap Analysis
- Personalized Career Recommendations
- Career Roadmap Generation

---

# 🛠 Tech Stack

## Frontend

- React.js
- Vite
- Bootstrap
- Bootstrap Icons
- CSS
- React Router DOM

## Backend

- Node.js
- Express.js

## Database

- MongoDB
- MongoDB Compass

## AI Module

- Python
- Django
- Scikit-learn
- NumPy
- Pandas
- Joblib

## Other Tools

- Mongoose
- Express Session
- Multer
- Express Validator
- Nodemailer
- Git & GitHub

---

# 🧠 Machine Learning Models

## 1. Resume Analysis Model

**Algorithm:** Decision Tree Classifier

### Input

- Technical Skills
- Projects
- Internships
- Certifications
- CGPA
- GitHub
- LinkedIn
- Portfolio
- Languages Known
- Soft Skills
- Workshops

### Output

- Excellent
- Good
- Average
- Needs Improvement

---

## 2. Career Role Prediction Model

**Algorithm:** Random Forest Classifier

### Predicts Career Roles

- Frontend Developer
- Backend Developer
- Full Stack Developer
- Data Analyst
- Data Scientist
- AI/ML Engineer
- DevOps Engineer
- QA Engineer
- UI/UX Designer
- Cyber Security Analyst

---

# 📂 Project Structure

```text
SkillSync
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   └── server.js
│
├── python-ai/
│   ├── datasets/
│   ├── prediction/
│   ├── training/
│   ├── trained_models/
│   └── manage.py
│
└── README.md
```

---

# 🔄 System Workflow

```text
Student Registers/Login
        │
        ▼
Complete Profile & Upload Resume
        │
        ▼
Browse Opportunities
        │
        ▼
Apply for Opportunity
        │
        ▼
Application Stored in MongoDB
        │
        ▼
Node.js Backend
        │
        ▼
Django AI Service
        │
        ├── Resume Analysis
        ├── Career Prediction
        └── Skill Gap Analysis
        │
        ▼
Prediction Result
        │
        ▼
React Frontend
```

---

# 🗄 Database Collections

- Users
- Opportunities
- Applications
- Tasks

---

# 👥 User Roles

### Student

- Apply for Opportunities
- Manage Profile
- Upload Resume
- AI Career Analysis

### College

- Post Opportunities
- Review Applications
- Track Student Participation

### Company

- Post Jobs & Internships
- Manage Candidates
- Recruitment Management

### Admin

- Manage Users
- Manage Opportunities
- View Analytics
- Control Entire Platform

---

# 📦 Installation

## Clone Repository

```bash
git clone <repository-url>
cd SkillSync
```

---

## Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## Backend

```bash
cd backend
npm install
npm start
```

---

## Python AI

```bash
cd python-ai

python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate

pip install -r requirements.txt

python manage.py runserver
```

---

# 🚀 Future Enhancements

- Email Notifications
- AI Interview Preparation
- AI Chatbot
- Mobile Application
- Cloud Deployment
- Advanced Analytics Dashboard
- Real-Time Notifications
- Online Mock Interviews

---

# 👨‍💻 Developed By

**Deep Patel**

**LJ Institute of Engineering & Technology**

---

## 📜 License

This project is developed for educational and academic purposes.
