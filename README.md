# SkillSync AI – Career Intelligence Platform

SkillSync AI is an AI-powered career intelligence and recruitment platform that connects students, companies, and colleges in a single ecosystem. The platform uses Machine Learning to provide smart placement predictions, career recommendations, skill analysis, and recruitment insights.

The project combines the MERN stack with Django REST Framework and Machine Learning to create an intelligent career guidance and recruitment system.

---

## 🚀 Features

### 👨‍🎓 Student Module

- User registration and authentication
- Complete profile setup and management
- Add skills, certifications, projects, and internships
- Upload resume
- Apply for jobs and internships
- Track applications
- Placement prediction using AI
- Career recommendations
- Resume score analysis
- Skill gap analysis
- Trending skills suggestions
- Learning roadmap generation

---

### 🏢 Company Module

- Company registration and login
- Create and manage job opportunities
- Create internship opportunities
- Review applications
- Candidate ranking
- View recruitment statistics
- Manage company profile

---

### 🏫 College Module

- College registration and authentication
- Manage students
- Organize workshops and events
- Placement statistics dashboard
- Track student performance
- View recruitment analytics

---

### 👨‍💼 Admin Module

- Manage students, companies, and colleges
- Verify accounts
- Manage opportunities
- Monitor platform analytics
- Generate reports

---

## 🤖 AI Features

### Placement Prediction

Predicts placement chances based on:

- CGPA
- Skills
- Internships
- Projects
- Certifications
- Aptitude score
- Communication score

**Model Used:** Decision Tree

---

### Career Recommendation

Recommends the best career path according to student skills.

Examples:

- Frontend Developer
- Backend Developer
- Full Stack Developer
- AI/ML Engineer
- Data Analyst
- Cloud Engineer
- Cyber Security Engineer

**Model Used:** Random Forest

---

### Trending Skills Predictor

Analyzes market demand and recommends trending skills based on:

- Student profile
- Job opportunities
- Internship opportunities
- Career domain

---

### Resume Score

Analyzes:

- Skills
- Projects
- Internships
- Certifications
- Resume completeness

---

### Skill Gap Analysis

Identifies missing skills required for a student's target career.

---

### Learning Roadmap

Generates a personalized roadmap to help students achieve their career goals.

---

## 🛠️ Tech Stack

### Frontend

- React.js
- Tailwind CSS
- Axios
- React Router

### Backend

- Node.js
- Express.js
- JWT Authentication
- Multer

### Database

- MongoDB

### AI Backend

- Django
- Django REST Framework
- Pandas
- Scikit-learn
- Joblib

### Machine Learning Models

- Decision Tree
- Random Forest

---

## 📂 Project Structure

```text
SkillSync-AI/

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
│   ├── utils/
│   └── server.js
│
├── python-ai/
│   ├── ai_platform/
│   ├── ml_app/
│   ├── datasets/
│   ├── trained_models/
│   └── manage.py
│
└── README.md
```

---

## ⚙️ Installation

### Clone the repository

```bash
git clone <repository-url>
```

### Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

---

### Backend Setup

```bash
cd backend

npm install

npm run dev
```

---

### Python AI Setup

```bash
cd python-ai

pip install -r requirements.txt

python manage.py runserver
```

---

## 🌐 Environment Variables

### Backend `.env`

```env
PORT=5000

MONGODB_URI=your_mongodb_connection_string

JWT_SECRET=your_secret_key
```

---

## 📈 Future Enhancements

- AI resume parsing
- Interview preparation assistant
- Salary prediction
- Real-time notifications
- Portfolio generation
- Mobile application
- Email notifications

---

## 👨‍💻 Developed By

Deep Patel

---

## 📄 License

This project is created for educational and academic purposes.
