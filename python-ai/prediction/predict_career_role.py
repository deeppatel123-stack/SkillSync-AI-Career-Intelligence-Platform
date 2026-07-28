"""
Career Recommendation - Prediction Module (College Practical Style)
Loads RandomForestClassifier and returns career recommendation
"""

import joblib
import numpy as np
from pathlib import Path

ROLE_INFO = {
    "Frontend Developer": {
        "description": "builds the visual and interactive parts of web applications using HTML, CSS, and JavaScript frameworks.",
        "domain": "frontend", "alt_roles": ["UI/UX Developer", "React Developer", "Web Developer"],
        "alt_reasons": {"UI/UX Developer": "Your frontend skills and design awareness can transition into user experience-focused roles.", "React Developer": "Your React expertise makes you a strong candidate for specialized React development positions.", "Web Developer": "Your comprehensive web development skills qualify you for general web development roles."},
        "key_tech": ["React", "Angular", "Vue.js", "TypeScript", "Redux", "Next.js", "Tailwind CSS"],
        "certs": ["Meta Front-End Developer", "Google UX Design"],
        "jobs": ["Frontend Developer", "React Developer", "UI Developer", "Web Developer", "JavaScript Developer"],
        "growth": ["Junior Frontend Developer", "Frontend Developer", "Senior Frontend Developer", "Tech Lead", "UI Architect"],
    },
    "Backend Developer": {
        "description": "handles server-side logic, database interactions, and API development for web and mobile applications.",
        "domain": "backend", "alt_roles": ["Full Stack Developer", "DevOps Engineer", "API Developer"],
        "alt_reasons": {"Full Stack Developer": "Your backend expertise combined with frontend knowledge makes full stack a natural fit.", "DevOps Engineer": "Your understanding of servers and deployment translates well to DevOps.", "API Developer": "Your API building experience makes you suitable for specialized API development."},
        "key_tech": ["Node.js", "Express", "Python", "Django", "REST APIs", "PostgreSQL", "MongoDB", "Docker"],
        "certs": ["AWS Certified Developer", "Microsoft Azure Developer"],
        "jobs": ["Backend Developer", "API Developer", "Node.js Developer", "Software Engineer", "Database Administrator"],
        "growth": ["Junior Backend Developer", "Backend Developer", "Senior Backend Developer", "Tech Lead", "Software Architect"],
    },
    "Full Stack Developer": {
        "description": "builds complete web applications from frontend UI to backend logic, databases, and deployment.",
        "domain": "fullstack", "alt_roles": ["Frontend Developer", "Backend Developer", "Software Engineer"],
        "alt_reasons": {"Frontend Developer": "Your strong frontend skills make frontend specialization a viable path.", "Backend Developer": "Your backend expertise makes backend specialization equally suitable.", "Software Engineer": "Your comprehensive full stack knowledge qualifies you for general software engineering roles."},
        "key_tech": ["React", "Node.js", "Express", "MongoDB", "PostgreSQL", "Docker", "AWS", "TypeScript"],
        "certs": ["AWS Certified Developer", "Meta Full-Stack Developer"],
        "jobs": ["Full Stack Developer", "Software Engineer", "Web Developer", "MERN Stack Developer", "Technical Lead"],
        "growth": ["Junior Developer", "Full Stack Developer", "Senior Full Stack Developer", "Tech Lead", "Software Architect"],
    },
    "Data Analyst": {
        "description": "collects, processes, and analyzes data to help organizations make informed business decisions.",
        "domain": "data", "alt_roles": ["Business Analyst", "Data Scientist", "BI Developer"],
        "alt_reasons": {"Business Analyst": "Your analytical skills align with business analysis roles.", "Data Scientist": "Your data analysis foundation can be extended to data science with additional ML skills.", "BI Developer": "Your SQL and visualization skills translate to business intelligence roles."},
        "key_tech": ["Python", "SQL", "Excel", "Tableau", "Power BI", "Pandas", "Statistics", "Data Visualization"],
        "certs": ["Google Data Analytics", "Microsoft Power BI Analyst"],
        "jobs": ["Data Analyst", "Business Analyst", "BI Analyst", "Data Associate", "Analytics Consultant"],
        "growth": ["Junior Data Analyst", "Data Analyst", "Senior Data Analyst", "Lead Analyst", "Data Science Manager"],
    },
    "Data Scientist": {
        "description": "applies advanced statistical methods and machine learning to extract insights and build predictive models.",
        "domain": "data", "alt_roles": ["Machine Learning Engineer", "AI Engineer", "Data Analyst"],
        "alt_reasons": {"Machine Learning Engineer": "Your ML skills are directly applicable to MLE roles.", "AI Engineer": "Your AI and deep learning knowledge positions you for specialized AI engineering roles.", "Data Analyst": "Your analytical foundation makes data analysis a viable alternative."},
        "key_tech": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "SQL", "Statistics", "Deep Learning", "NLP"],
        "certs": ["AWS Certified ML Specialty", "Google TensorFlow Developer"],
        "jobs": ["Data Scientist", "ML Engineer", "AI Engineer", "Research Scientist", "Data Analyst"],
        "growth": ["Junior Data Scientist", "Data Scientist", "Senior Data Scientist", "Lead Data Scientist", "ML Architect"],
    },
    "AI/ML Engineer": {
        "description": "designs, builds, and deploys machine learning models and AI systems for real-world problems.",
        "domain": "data", "alt_roles": ["Data Scientist", "Deep Learning Engineer", "MLOps Engineer"],
        "alt_reasons": {"Data Scientist": "Your ML skills and analytical background make data science a close alternative.", "Deep Learning Engineer": "Your AI expertise can specialize further into deep learning roles.", "MLOps Engineer": "Your model building and deployment experience translates to MLOps positions."},
        "key_tech": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "MLflow", "Docker", "Kubernetes", "SQL"],
        "certs": ["AWS Certified ML Specialty", "Google TensorFlow Developer"],
        "jobs": ["ML Engineer", "AI Engineer", "Data Scientist", "Deep Learning Engineer", "MLOps Engineer"],
        "growth": ["Junior ML Engineer", "ML Engineer", "Senior ML Engineer", "Lead ML Engineer", "ML Architect"],
    },
    "DevOps Engineer": {
        "description": "bridges development and operations by building CI/CD pipelines and managing cloud infrastructure.",
        "domain": "devops", "alt_roles": ["Cloud Engineer", "Site Reliability Engineer", "Platform Engineer"],
        "alt_reasons": {"Cloud Engineer": "Your cloud infrastructure skills align with cloud engineering.", "Site Reliability Engineer": "Your automation and monitoring expertise translates to SRE.", "Platform Engineer": "Your infrastructure knowledge provides a pathway to platform engineering."},
        "key_tech": ["Docker", "Kubernetes", "Jenkins", "AWS", "Azure", "Terraform", "Ansible", "Linux"],
        "certs": ["AWS Certified DevOps Engineer", "Google Cloud DevOps"],
        "jobs": ["DevOps Engineer", "Cloud Engineer", "SRE", "Platform Engineer", "Infrastructure Engineer"],
        "growth": ["Junior DevOps Engineer", "DevOps Engineer", "Senior DevOps Engineer", "DevOps Architect", "Infrastructure Director"],
    },
    "QA Engineer": {
        "description": "ensures software quality by designing test cases, automating testing, and identifying bugs.",
        "domain": "qa", "alt_roles": ["Test Automation Engineer", "SDET", "Quality Analyst"],
        "alt_reasons": {"Test Automation Engineer": "Your testing skills can focus on building test automation frameworks.", "SDET": "Your development and testing combination makes you suitable for SDET roles.", "Quality Analyst": "Your quality assurance expertise translates to quality analysis positions."},
        "key_tech": ["Selenium", "JUnit", "TestNG", "Cypress", "Postman", "JIRA", "Python", "SQL"],
        "certs": ["ISTQB Certified Tester", "AWS Cloud Practitioner"],
        "jobs": ["QA Engineer", "Test Automation Engineer", "SDET", "Quality Analyst", "Test Lead"],
        "growth": ["Junior QA Engineer", "QA Engineer", "Senior QA Engineer", "QA Lead", "Test Architect"],
    },
    "UI/UX Designer": {
        "description": "creates intuitive and visually appealing user interfaces while ensuring a seamless user experience.",
        "domain": "design", "alt_roles": ["Product Designer", "UX Researcher", "Visual Designer"],
        "alt_reasons": {"Product Designer": "Your design thinking and user research skills translate naturally to product design.", "UX Researcher": "Your user-centric approach suits UX research positions.", "Visual Designer": "Your visual design skills and creativity make visual design a focused alternative."},
        "key_tech": ["Figma", "Adobe XD", "Sketch", "Photoshop", "Wireframing", "Prototyping", "User Research", "HTML/CSS"],
        "certs": ["Google UX Design", "Meta UX Designer"],
        "jobs": ["UI/UX Designer", "Product Designer", "UX Researcher", "Visual Designer", "Interaction Designer"],
        "growth": ["Junior Designer", "UI/UX Designer", "Senior Designer", "Design Lead", "UX Director"],
    },
    "Cyber Security Analyst": {
        "description": "protects systems and data by monitoring threats, implementing security measures, and responding to incidents.",
        "domain": "security", "alt_roles": ["Security Engineer", "Penetration Tester", "SOC Analyst"],
        "alt_reasons": {"Security Engineer": "Your security knowledge can be applied to building security infrastructure.", "Penetration Tester": "Your security analysis skills can focus on ethical hacking.", "SOC Analyst": "Your monitoring and incident response skills align with SOC operations."},
        "key_tech": ["Python", "Kali Linux", "Wireshark", "Burp Suite", "Nmap", "Firewalls", "Encryption", "SIEM"],
        "certs": ["CompTIA Security+", "Certified Ethical Hacker"],
        "jobs": ["Security Analyst", "SOC Analyst", "Penetration Tester", "Security Engineer", "Incident Responder"],
        "growth": ["Junior Security Analyst", "Security Analyst", "Senior Security Analyst", "Security Lead", "Security Architect"],
    },
}


def predict(python, java, javascript, react, node, express,
            mongodb, sql, html, css, git, dsa,
            communication, problem_solving,
            projects_count, internship_count, certification_count,
            interested_domain, **kwargs):
    models_dir = Path(__file__).resolve().parent.parent / 'trained_models'
    try:
        model = joblib.load(models_dir / 'career_recommendation_model.pkl')
        feature_names = joblib.load(models_dir / 'career_recommendation_features.pkl')
    except FileNotFoundError:
        return {"error": "Model not found. Train the model first."}

    features = np.array([[
        python, java, javascript, react, node, express,
        mongodb, sql, html, css, git, dsa,
        communication, problem_solving,
        projects_count, internship_count, certification_count,
        interested_domain
    ]])

    probs = model.predict_proba(features)[0]
    top = np.argsort(probs)[::-1]
    role = model.classes_[top[0]]
    confidence = round(float(probs[top[0]] * 100), 1)

    info = ROLE_INFO.get(role, {})
    active = [k for k, v in {'Python':python,'Java':java,'JavaScript':javascript,'React':react,'Node':node,'Express':express,'MongoDB':mongodb,'SQL':sql,'HTML':html,'CSS':css,'Git':git,'DSA':dsa,'Communication':communication,'Problem_Solving':problem_solving}.items() if v and v >= 0.5]
    skill_labels = {'Python':'Python','Java':'Java','JavaScript':'JavaScript','React':'React','Node':'Node.js','Express':'Express','MongoDB':'MongoDB','SQL':'SQL','HTML':'HTML','CSS':'CSS','Git':'Git/GitHub','DSA':'Data Structures & Algorithms','Communication':'Communication','Problem_Solving':'Problem Solving'}
    active_labels = [skill_labels.get(s, s) for s in active]
    skill_text = ", ".join(active_labels) if active_labels else "your technical abilities"

    why_role = f"Your strong knowledge of {skill_text}, combined with {'your internship experience and ' if internship_count >= 1 else ''}{'your project portfolio, ' if projects_count >= 2 else ''}makes you highly suitable for {role}."

    skill_gaps = [t for t in info.get("key_tech", []) if t.lower() not in [s.lower() for s in active_labels]]
    skill_gaps = [t for t in skill_gaps if not any(t.lower() in a.lower() or a.lower() in t.lower() for a in active_labels)][:8]

    s_label = "Excellent Match" if confidence >= 90 else "Very Good Match" if confidence >= 80 else "Good Match" if confidence >= 65 else "Average Match"

    return {
        "recommended_role": role,
        "role_description": f"A {role} is {info.get('description', 'a key role in the technology industry.')} Based on your expertise in {skill_text}, this is the most suitable career path for you.",
        "match_score": confidence,
        "match_label": s_label,
        "why_this_role": why_role,
        "strengths": active_labels[:8] if active_labels else ["Building foundational technical skills"],
        "skill_gaps": skill_gaps,
        "learning_roadmap": [f"Master {role} Fundamentals", f"Build 3 {role}-specific Projects"] + [f"Learn {t}" for t in info.get("key_tech", [])[:4]] + ["Deploy Projects to Production", "Build Professional Portfolio", "Prepare for Technical Interviews"],
        "certifications": info.get("certs", ["Industry-recognized certification in your domain"]),
        "suitable_jobs": info.get("jobs", [role]),
        "alternative_roles": [{"role": a, "reason": info.get("alt_reasons", {}).get(a, f"Your skills are also suitable for {a} roles.")} for a in info.get("alt_roles", [])],
        "expected_salary": {"country": "India", "entry": "4-7 LPA", "mid": "8-15 LPA", "senior": "18-30 LPA", "currency": "₹"},
        "career_growth": info.get("growth", [role, f"Senior {role}", "Lead", "Manager"]),
        "placement_readiness": {"overall": min(100, 40 + len(active)*4 + projects_count*3 + internship_count*5 + certification_count*3)},
        "ai_suggestions": ["Improve Data Structures and Algorithms skills for technical interviews."] + ([f"Build {3 - projects_count} more production-level project(s) to strengthen your portfolio."] if projects_count < 3 else []) + (["Gain internship experience for real-world industry exposure."] if internship_count < 1 else []) + ["Participate in hackathons.", "Contribute to open-source projects.", "Create a strong LinkedIn profile."],
        "final_summary": f"Your profile demonstrates {'highly competitive' if confidence >= 80 else 'competitive' if confidence >= 60 else 'developing'} potential for a career as a {role} with {len(active)} relevant skills, {projects_count} project(s), {internship_count} internship(s), and {certification_count} certification(s).",
    }
