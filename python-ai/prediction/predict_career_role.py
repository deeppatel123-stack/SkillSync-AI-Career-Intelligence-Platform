"""
Career Role Recommendation - Prediction Module
Loads RandomForestClassifier and generates a comprehensive 14-section report
"""

import joblib
import numpy as np
from pathlib import Path

# ── Role knowledge base ──────────────────────────────────────────
ROLE_INFO = {
    "Frontend Developer": {
        "description": "responsible for building the visual and interactive parts of web applications using HTML, CSS, and JavaScript frameworks.",
        "domain": "frontend",
        "alt_roles": ["UI/UX Developer", "React Developer", "Web Developer"],
        "alt_reasons": {
            "UI/UX Developer": "Your frontend skills and design awareness can transition into user experience-focused roles.",
            "React Developer": "Your React expertise makes you a strong candidate for specialized React development positions.",
            "Web Developer": "Your comprehensive web development skills qualify you for general web development roles.",
            "Full Stack Developer": "Combining your frontend skills with backend knowledge opens full stack opportunities.",
            "JavaScript Developer": "Your strong JavaScript foundation is valuable across many development roles.",
        },
        "key_tech": ["React", "Angular", "Vue.js", "TypeScript", "Redux", "Next.js", "Tailwind CSS", "Webpack", "Jest", "GraphQL"],
        "certs": ["Meta Front-End Developer", "Google UX Design", "AWS Cloud Practitioner", "Microsoft Azure Fundamentals"],
        "jobs": ["Frontend Developer", "React Developer", "UI Developer", "Web Developer", "JavaScript Developer", "Frontend Engineer", "Full Stack Developer"],
        "growth": ["Junior Frontend Developer", "Frontend Developer", "Senior Frontend Developer", "Tech Lead", "UI Architect", "Engineering Manager"],
        "salary": {"entry": "4–7 LPA", "mid": "8–15 LPA", "senior": "18–30 LPA"},
    },
    "Backend Developer": {
        "description": "responsible for server-side logic, database interactions, and API development that powers web and mobile applications.",
        "domain": "backend",
        "alt_roles": ["Full Stack Developer", "DevOps Engineer", "API Developer"],
        "alt_reasons": {
            "Full Stack Developer": "Your backend expertise combined with frontend knowledge makes full stack a natural fit.",
            "DevOps Engineer": "Your understanding of servers, databases, and deployment translates well to DevOps roles.",
            "API Developer": "Your experience building APIs makes you suitable for specialized API development positions.",
            "Software Engineer": "Your comprehensive backend knowledge qualifies you for general software engineering roles.",
            "Cloud Engineer": "Your backend and database skills provide a strong foundation for cloud engineering.",
        },
        "key_tech": ["Node.js", "Express", "Python", "Django", "REST APIs", "GraphQL", "PostgreSQL", "MongoDB", "Redis", "Docker"],
        "certs": ["AWS Certified Developer", "Microsoft Azure Developer", "MongoDB Associate Developer", "Google Cloud Associate"],
        "jobs": ["Backend Developer", "API Developer", "Node.js Developer", "Software Engineer", "Database Administrator", "Cloud Engineer", "Systems Architect"],
        "growth": ["Junior Backend Developer", "Backend Developer", "Senior Backend Developer", "Tech Lead", "Software Architect", "CTO"],
        "salary": {"entry": "5–8 LPA", "mid": "10–18 LPA", "senior": "20–35 LPA"},
    },
    "Full Stack Developer": {
        "description": "capable of building complete web applications from frontend UI to backend logic, databases, and deployment.",
        "domain": "fullstack",
        "alt_roles": ["Frontend Developer", "Backend Developer", "Software Engineer"],
        "alt_reasons": {
            "Frontend Developer": "Your strong frontend skills and UI experience make frontend specialization a viable path.",
            "Backend Developer": "Your backend expertise and database knowledge make backend specialization equally suitable.",
            "Software Engineer": "Your comprehensive full stack knowledge qualifies you for general software engineering roles.",
            "DevOps Engineer": "Your deployment and infrastructure experience translates well to DevOps.",
            "Technical Lead": "Your broad technical knowledge positions you well for technical leadership.",
        },
        "key_tech": ["React", "Node.js", "Express", "MongoDB", "PostgreSQL", "Docker", "AWS", "TypeScript", "GraphQL", "Redis"],
        "certs": ["AWS Certified Developer", "Meta Full-Stack Developer", "Google Cloud Associate", "MongoDB Associate Developer"],
        "jobs": ["Full Stack Developer", "Software Engineer", "Web Developer", "MERN Stack Developer", "Technical Lead", "Product Engineer", "Startup Engineer"],
        "growth": ["Junior Developer", "Full Stack Developer", "Senior Full Stack Developer", "Tech Lead", "Software Architect", "Engineering Manager"],
        "salary": {"entry": "5–8 LPA", "mid": "10–18 LPA", "senior": "22–38 LPA"},
    },
    "Data Analyst": {
        "description": "focused on collecting, processing, and analyzing data to help organizations make informed business decisions.",
        "domain": "data",
        "alt_roles": ["Business Analyst", "Data Scientist", "BI Developer"],
        "alt_reasons": {
            "Business Analyst": "Your analytical skills and data interpretation abilities align with business analysis roles.",
            "Data Scientist": "Your data analysis foundation can be extended to data science with additional ML skills.",
            "BI Developer": "Your SQL and data visualization skills translate directly to business intelligence roles.",
            "Data Engineer": "Your data processing skills provide a pathway to data engineering positions.",
        },
        "key_tech": ["Python", "SQL", "Excel", "Tableau", "Power BI", "Pandas", "NumPy", "Statistics", "R", "Data Visualization"],
        "certs": ["Google Data Analytics", "Microsoft Power BI Analyst", "IBM Data Analyst", "Tableau Desktop Specialist"],
        "jobs": ["Data Analyst", "Business Analyst", "BI Analyst", "Data Associate", "Analytics Consultant", "Reporting Analyst", "Operations Analyst"],
        "growth": ["Junior Data Analyst", "Data Analyst", "Senior Data Analyst", "Lead Analyst", "Data Science Manager", "Chief Data Officer"],
        "salary": {"entry": "4–7 LPA", "mid": "8–14 LPA", "senior": "16–28 LPA"},
    },
    "Data Scientist": {
        "description": "applies advanced statistical methods, machine learning, and deep learning to extract insights and build predictive models.",
        "domain": "data",
        "alt_roles": ["Machine Learning Engineer", "AI Engineer", "Data Analyst"],
        "alt_reasons": {
            "Machine Learning Engineer": "Your ML and modeling skills are directly applicable to MLE roles with focus on deployment.",
            "AI Engineer": "Your AI and deep learning knowledge positions you for specialized AI engineering roles.",
            "Data Analyst": "Your analytical foundation makes data analysis a viable alternative path.",
            "Research Scientist": "Your strong analytical background suits research-oriented positions.",
        },
        "key_tech": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "SQL", "Statistics", "Deep Learning", "NLP", "Computer Vision", "Big Data"],
        "certs": ["AWS Certified ML Specialty", "Google TensorFlow Developer", "IBM Data Science", "Microsoft Azure AI"],
        "jobs": ["Data Scientist", "ML Engineer", "AI Engineer", "Research Scientist", "Data Analyst", "NLP Engineer", "Computer Vision Engineer"],
        "growth": ["Junior Data Scientist", "Data Scientist", "Senior Data Scientist", "Lead Data Scientist", "ML Architect", "Chief AI Officer"],
        "salary": {"entry": "6–10 LPA", "mid": "12–22 LPA", "senior": "25–45 LPA"},
    },
    "AI/ML Engineer": {
        "description": "designs, builds, and deploys machine learning models and AI systems that solve complex real-world problems.",
        "domain": "data",
        "alt_roles": ["Data Scientist", "Deep Learning Engineer", "MLOps Engineer"],
        "alt_reasons": {
            "Data Scientist": "Your ML skills and analytical background make data science a close alternative.",
            "Deep Learning Engineer": "Your AI expertise can specialize further into deep learning roles.",
            "MLOps Engineer": "Your model building and deployment experience translates to MLOps positions.",
            "Research Engineer": "Your strong technical foundation suits AI research engineering roles.",
        },
        "key_tech": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "MLflow", "Docker", "Kubernetes", "SQL", "Statistics", "CUDA"],
        "certs": ["AWS Certified ML Specialty", "Google TensorFlow Developer", "Microsoft Azure AI", "NVIDIA Deep Learning"],
        "jobs": ["ML Engineer", "AI Engineer", "Data Scientist", "Deep Learning Engineer", "MLOps Engineer", "Research Engineer", "NLP Engineer"],
        "growth": ["Junior ML Engineer", "ML Engineer", "Senior ML Engineer", "Lead ML Engineer", "ML Architect", "Director of AI"],
        "salary": {"entry": "7–12 LPA", "mid": "14–25 LPA", "senior": "28–50 LPA"},
    },
    "DevOps Engineer": {
        "description": "bridges development and operations by building CI/CD pipelines, managing cloud infrastructure, and automating deployment workflows.",
        "domain": "devops",
        "alt_roles": ["Cloud Engineer", "Site Reliability Engineer", "Platform Engineer"],
        "alt_reasons": {
            "Cloud Engineer": "Your cloud infrastructure and deployment skills align with cloud engineering roles.",
            "Site Reliability Engineer": "Your automation and monitoring expertise translates to SRE positions.",
            "Platform Engineer": "Your infrastructure knowledge provides a pathway to platform engineering.",
            "Security Engineer": "Your DevOps experience can extend into DevSecOps and security roles.",
        },
        "key_tech": ["Docker", "Kubernetes", "Jenkins", "AWS", "Azure", "Terraform", "Ansible", "Linux", "CI/CD", "Bash"],
        "certs": ["AWS Certified DevOps Engineer", "Google Cloud DevOps", "Microsoft Azure DevOps", "Docker Certified"],
        "jobs": ["DevOps Engineer", "Cloud Engineer", "SRE", "Platform Engineer", "Infrastructure Engineer", "Release Manager", "Build Engineer"],
        "growth": ["Junior DevOps Engineer", "DevOps Engineer", "Senior DevOps Engineer", "DevOps Architect", "Infrastructure Director", "CTO"],
        "salary": {"entry": "5–9 LPA", "mid": "10–18 LPA", "senior": "22–40 LPA"},
    },
    "QA Engineer": {
        "description": "ensures software quality by designing test cases, automating testing processes, and identifying bugs before deployment.",
        "domain": "qa",
        "alt_roles": ["Test Automation Engineer", "SDET", "Quality Analyst"],
        "alt_reasons": {
            "Test Automation Engineer": "Your testing skills can focus on building and maintaining test automation frameworks.",
            "SDET": "Your development and testing combination makes you suitable for Software Developer in Test roles.",
            "Quality Analyst": "Your quality assurance expertise translates directly to quality analysis positions.",
        },
        "key_tech": ["Selenium", "JUnit", "TestNG", "Cypress", "Postman", "JIRA", "Python", "Jenkins", "Git", "SQL"],
        "certs": ["ISTQB Certified Tester", "AWS Cloud Practitioner", "Certified Scrum Master", "Google Project Management"],
        "jobs": ["QA Engineer", "Test Automation Engineer", "SDET", "Quality Analyst", "Test Lead", "Manual Tester", "Performance Test Engineer"],
        "growth": ["Junior QA Engineer", "QA Engineer", "Senior QA Engineer", "QA Lead", "Test Architect", "Quality Director"],
        "salary": {"entry": "3–6 LPA", "mid": "7–12 LPA", "senior": "14–22 LPA"},
    },
    "UI/UX Designer": {
        "description": "creates intuitive and visually appealing user interfaces while ensuring a seamless and engaging user experience.",
        "domain": "design",
        "alt_roles": ["Product Designer", "UX Researcher", "Visual Designer"],
        "alt_reasons": {
            "Product Designer": "Your design thinking and user research skills translate naturally to product design roles.",
            "UX Researcher": "Your user-centric approach and design methodology suits UX research positions.",
            "Visual Designer": "Your visual design skills and creativity make visual design a focused alternative.",
            "Frontend Developer": "Your HTML/CSS knowledge combined with design skills makes you a design-savvy developer.",
        },
        "key_tech": ["Figma", "Adobe XD", "Sketch", "Photoshop", "Illustrator", "InVision", "Wireframing", "Prototyping", "User Research", "HTML/CSS"],
        "certs": ["Google UX Design", "Meta UX Designer", "Interaction Design Foundation", "Adobe Certified Expert"],
        "jobs": ["UI/UX Designer", "Product Designer", "UX Researcher", "Visual Designer", "Interaction Designer", "UX Architect", "Design Lead"],
        "growth": ["Junior Designer", "UI/UX Designer", "Senior Designer", "Design Lead", "UX Director", "Chief Design Officer"],
        "salary": {"entry": "4–7 LPA", "mid": "8–15 LPA", "senior": "18–32 LPA"},
    },
    "Cyber Security Analyst": {
        "description": "protects an organization's systems and data by monitoring threats, implementing security measures, and responding to incidents.",
        "domain": "security",
        "alt_roles": ["Security Engineer", "Penetration Tester", "SOC Analyst"],
        "alt_reasons": {
            "Security Engineer": "Your security knowledge can be applied to building and maintaining security infrastructure.",
            "Penetration Tester": "Your security analysis skills can focus on ethical hacking and penetration testing.",
            "SOC Analyst": "Your monitoring and incident response skills align with SOC operations roles.",
            "Network Security Engineer": "Your security fundamentals provide a pathway to network security roles.",
        },
        "key_tech": ["Python", "Kali Linux", "Wireshark", "Burp Suite", "Nmap", "Firewalls", "Encryption", "SIEM", "AWS Security", "Risk Assessment"],
        "certs": ["CompTIA Security+", "Certified Ethical Hacker", "CISSP", "AWS Certified Security", "Google Cloud Security"],
        "jobs": ["Security Analyst", "SOC Analyst", "Penetration Tester", "Security Engineer", "Incident Responder", "Security Consultant", "Network Security Engineer"],
        "growth": ["Junior Security Analyst", "Security Analyst", "Senior Security Analyst", "Security Lead", "Security Architect", "CISO"],
        "salary": {"entry": "5–8 LPA", "mid": "10–18 LPA", "senior": "20–38 LPA"},
    },
}

# ── Skill synonyms ───────────────────────────────────────────────
SKILL_SYNONYMS = {
    "python": ["python", "python3"],
    "java": ["java", "core java", "java ee"],
    "javascript": ["javascript", "js", "typescript", "ecmascript", "node.js", "nodejs", "node"],
    "react": ["react", "reactjs", "react.js", "react native"],
    "node": ["node", "nodejs", "node.js", "express", "expressjs"],
    "express": ["express", "expressjs", "express.js"],
    "mongodb": ["mongodb", "mongo"],
    "sql": ["sql", "mysql", "postgresql", "postgres", "sqlite", "oracle"],
    "html": ["html", "html5"],
    "css": ["css", "css3", "tailwind", "bootstrap", "sass", "scss"],
    "git": ["git", "github", "gitlab", "bitbucket"],
    "dsa": ["dsa", "data structures", "algorithms", "data structure"],
    "communication": ["communication", "presentation", "public speaking"],
    "problem_solving": ["problem solving", "problem-solving", "analytical", "logical reasoning"],
}

# ── Skill display labels ─────────────────────────────────────────
SKILL_LABELS = {
    "python": "Python", "java": "Java", "javascript": "JavaScript",
    "react": "React", "node": "Node.js", "express": "Express",
    "mongodb": "MongoDB", "sql": "SQL", "html": "HTML", "css": "CSS",
    "git": "Git/GitHub", "dsa": "Data Structures & Algorithms",
    "communication": "Communication", "problem_solving": "Problem Solving",
}


def load_model():
    models_dir = Path(__file__).resolve().parent.parent / 'trained_models'
    try:
        model = joblib.load(models_dir / 'career_role_model.pkl')
        feature_names = joblib.load(models_dir / 'career_role_features.pkl')
        return model, feature_names
    except FileNotFoundError:
        return None, None


def _match_skills(skills_list):
    matched = {}
    for s in skills_list:
        sl = s.lower()
        for key, synonyms in SKILL_SYNONYMS.items():
            if any(syn in sl for syn in synonyms):
                matched[key] = 1
    return matched


FEATURE_TO_SKILL_KEY = {
    'Python': 'python', 'Java': 'java', 'JavaScript': 'javascript',
    'React': 'react', 'Node': 'node', 'Express': 'express',
    'MongoDB': 'mongodb', 'SQL': 'sql', 'HTML': 'html', 'CSS': 'css',
    'Git': 'git', 'DSA': 'dsa', 'Communication': 'communication',
    'Problem_Solving': 'problem_solving',
}


def _get_active_skills(features_dict):
    result = []
    for feature_key, skill_key in FEATURE_TO_SKILL_KEY.items():
        val = features_dict.get(feature_key, 0)
        if val and val >= 0.5:
            result.append(SKILL_LABELS.get(skill_key, feature_key))
    return result


def _generate_description(role, features_dict, skills_list):
    info = ROLE_INFO.get(role, {})
    domain = info.get("domain", "")
    active = _get_active_skills(features_dict)
    skill_sample = ", ".join(active[:3]) if active else "your technical skills"
    return (
        f"A {role} is {info.get('description', 'a key role in the technology industry.')} "
        f"Based on your expertise in {skill_sample}, "
        f"{'internship experience, ' if features_dict.get('Internship_Count', 0) >= 1 else ''}"
        f"{'project portfolio, ' if features_dict.get('Projects_Count', 0) >= 3 else ''}"
        f"and interest in {domain} development, this is the most suitable career path for you. "
        f"The demand for skilled {role}s continues to grow across the industry."
    )


def _generate_why_this_role(role, features_dict, skills_list):
    active = _get_active_skills(features_dict)
    skill_text = ", and ".join([
        ", ".join(active[:-1]) + f" and {active[-1]}" if len(active) > 2 else " and ".join(active)
        if active else "your technical abilities"
    ])
    intern_text = "your internship experience" if features_dict.get('Internship_Count', 0) >= 1 else ""
    proj_text = f"your work on {features_dict.get('Projects_Count', 0)} projects" if features_dict.get('Projects_Count', 0) >= 1 else ""
    parts = [p for p in [skill_text, intern_text, proj_text] if p]
    if len(parts) > 1:
        profile_text = ", ".join(parts[:-1]) + f" and {parts[-1]}"
    else:
        profile_text = parts[0] if parts else "your profile"
    return (
        f"Your strong knowledge of {skill_text}, combined with "
        f"{'your internship experience and ' if features_dict.get('Internship_Count', 0) >= 1 else ''}"
        f"{'your project portfolio, ' if features_dict.get('Projects_Count', 0) >= 2 else ''}"
        f"makes you highly suitable for {role}. "
        f"{'Your practical project work demonstrates your ability to deliver real-world solutions. ' if features_dict.get('Projects_Count', 0) >= 2 else ''}"
        f"{'Your internship experience gives you valuable industry exposure. ' if features_dict.get('Internship_Count', 0) >= 1 else ''}"
    )


def _generate_strengths(role, features_dict, skills_list):
    strengths = []
    active = _get_active_skills(features_dict)
    matched_keys = [k for k, v in features_dict.items() if v and v >= 0.5]

    if features_dict.get('Projects_Count', 0) >= 5:
        strengths.append("Extensive project portfolio with strong practical experience")
    elif features_dict.get('Projects_Count', 0) >= 3:
        strengths.append("Good project portfolio demonstrating practical skills")
    elif features_dict.get('Projects_Count', 0) >= 1:
        strengths.append("Practical project experience")

    if features_dict.get('Internship_Count', 0) >= 2:
        strengths.append("Valuable internship experience in the industry")
    elif features_dict.get('Internship_Count', 0) == 1:
        strengths.append("Industry internship exposure")

    if features_dict.get('Certification_Count', 0) >= 3:
        strengths.append("Strong certification record showing continuous learning")
    elif features_dict.get('Certification_Count', 0) >= 1:
        strengths.append("Relevant certifications in your domain")

    tech_keywords = ["python", "javascript", "react", "node", "java", "html", "css", "sql"]
    matched_tech = sum(1 for k in tech_keywords if k in matched_keys)
    if matched_tech >= 4:
        strengths.append(f"Strong foundation in {matched_tech} core web technologies")
    elif matched_tech >= 2:
        strengths.append("Good understanding of web technologies")

    if "react" in matched_keys:
        strengths.append("Modern frontend development with React")
    if "node" in matched_keys or "express" in matched_keys:
        strengths.append("Server-side development with Node.js/Express")
    if "mongodb" in matched_keys or "sql" in matched_keys:
        strengths.append("Database management and query skills")
    if "dsa" in matched_keys:
        strengths.append("Strong problem-solving and algorithmic thinking")
    if "git" in matched_keys:
        strengths.append("Version control and collaboration with Git/GitHub")
    if "python" in matched_keys:
        strengths.append("Python programming expertise")
    if "java" in matched_keys:
        strengths.append("Java development skills")
    if "communication" in matched_keys:
        strengths.append("Strong communication and collaboration skills")
    if features_dict.get('Projects_Count', 0) >= 1:
        strengths.append("Ability to build and deliver complete projects")

    return strengths[:10] if strengths else ["Building foundational technical skills"]


def _generate_skill_gaps(role, features_dict, skills_list):
    info = ROLE_INFO.get(role, {})
    key_tech = info.get("key_tech", [])
    matched_keys = [k for k, v in features_dict.items() if v and v >= 0.5]

    tech_name_map = {
        "react": "React", "angular": "Angular", "vue.js": "Vue.js",
        "typescript": "TypeScript", "redux": "Redux", "next.js": "Next.js",
        "tailwind css": "Tailwind CSS", "node.js": "Node.js", "express": "Express",
        "python": "Python", "django": "Django", "rest apis": "REST APIs",
        "graphql": "GraphQL", "postgresql": "PostgreSQL", "mongodb": "MongoDB",
        "redis": "Redis", "docker": "Docker", "kubernetes": "Kubernetes",
        "aws": "AWS", "azure": "Azure", "terraform": "Terraform",
        "jenkins": "Jenkins", "linux": "Linux", "ci/cd": "CI/CD",
        "bash": "Bash/Shell", "selenium": "Selenium", "cypress": "Cypress",
        "figma": "Figma", "tensorflow": "TensorFlow", "pytorch": "PyTorch",
        "scikit-learn": "Scikit-learn", "tableau": "Tableau", "power bi": "Power BI",
        "pandas": "Pandas", "numpy": "NumPy", "statistics": "Statistics",
    }

    # Map matched keys to role tech for gap detection
    gaps = []
    user_tech_lower = set()
    for s in skills_list:
        user_tech_lower.add(s.lower())

    # Also add matched key labels
    for mk in matched_keys:
        if mk in SKILL_LABELS:
            user_tech_lower.add(SKILL_LABELS[mk].lower())

    for tech in key_tech:
        t_lower = tech.lower()
        synonyms = {t_lower}
        for k, v in tech_name_map.items():
            if v.lower() == t_lower:
                synonyms.add(k)
        if not any(syn in user_tech_lower for syn in synonyms):
            gaps.append(tech)

    return gaps[:8]


def _generate_roadmap(role, features_dict):
    info = ROLE_INFO.get(role, {})
    key_tech = info.get("key_tech", [])

    base_steps = [
        f"Master Core {role.replace('Developer', '').replace('Engineer', '').strip()} Fundamentals",
        f"Build 3 {role}-specific Projects",
    ]

    if key_tech:
        for tech in key_tech[:3]:
            base_steps.append(f"Learn {tech}")

    base_steps += [
        "Deploy Projects to Production",
        "Build Professional Portfolio",
        "Prepare for Technical Interviews",
    ]
    if features_dict.get('Projects_Count', 0) < 3:
        base_steps.insert(2, "Complete Additional Projects for Portfolio Strength")
    if features_dict.get('Internship_Count', 0) < 1:
        base_steps.insert(3, "Apply for Internship Opportunities")

    return base_steps[:10]


def _generate_certs(role):
    info = ROLE_INFO.get(role, {})
    return info.get("certs", ["Industry-recognized certification in your domain"])


def _generate_jobs(role):
    info = ROLE_INFO.get(role, {})
    return info.get("jobs", [role])


def _generate_alternatives(role, features_dict):
    info = ROLE_INFO.get(role, {})
    alts = info.get("alt_roles", [])
    reasons = info.get("alt_reasons", {})
    result = []
    for alt in alts:
        reason = reasons.get(alt, f"Your skills are also suitable for {alt} roles.")
        result.append({"role": alt, "reason": reason})
    return result


def _generate_salary():
    return {
        "country": "India",
        "entry": "4–7 LPA",
        "mid": "8–15 LPA",
        "senior": "18–30 LPA",
        "currency": "₹",
    }


def _generate_growth(role):
    info = ROLE_INFO.get(role, {})
    return info.get("growth", [role, f"Senior {role}", "Lead", "Manager", "Director"])


def _generate_readiness(features_dict):
    projects = features_dict.get('Projects_Count', 0)
    internships = features_dict.get('Internship_Count', 0)
    certs = features_dict.get('Certification_Count', 0)
    matched = [k for k, v in features_dict.items() if v and v >= 0.5]
    tech_count = len(matched)

    overall = min(100, 40 + tech_count * 4 + projects * 3 + internships * 5 + certs * 3)
    technical = min(100, 45 + tech_count * 5 + projects * 2)
    projects_score = min(100, 30 + projects * 10)
    internships_score = min(100, 25 + internships * 15)
    comm = 50 + (10 if "communication" in matched else 0) + (10 if "problem_solving" in matched else 0)
    communication_score = min(100, comm)
    industry = min(100, 30 + internships * 12 + projects * 4 + certs * 4)

    return {
        "overall": overall,
        "technical_skills": technical,
        "projects": projects_score,
        "internships": internships_score,
        "communication": communication_score,
        "industry_readiness": industry,
    }


def _generate_ai_suggestions(role, features_dict):
    suggestions = []
    projects = features_dict.get('Projects_Count', 0)
    internships = features_dict.get('Internship_Count', 0)
    certs = features_dict.get('Certification_Count', 0)
    matched = [k for k, v in features_dict.items() if v and v >= 0.5]

    if "dsa" not in matched:
        suggestions.append("Improve Data Structures and Algorithms skills for technical interviews.")
    if projects < 3:
        suggestions.append(f"Build {3 - projects} more production-level project(s) to strengthen your portfolio.")
    if internships < 1:
        suggestions.append("Gain internship experience for real-world industry exposure.")
    suggestions.append("Participate in hackathons to build problem-solving skills under time constraints.")
    suggestions.append("Contribute to open-source projects to build credibility and network.")
    suggestions.append("Create a strong LinkedIn profile and connect with industry professionals.")
    suggestions.append("Build and maintain a professional portfolio website showcasing your work.")
    if certs < 2:
        suggestions.append(f"Earn industry-recognized certifications relevant to {role}.")
    suggestions.append("Practice mock interviews and improve your communication skills.")

    return suggestions[:10]


def _generate_summary(role, features_dict, readiness):
    projects = features_dict.get('Projects_Count', 0)
    internships = features_dict.get('Internship_Count', 0)
    certs = features_dict.get('Certification_Count', 0)
    active = _get_active_skills(features_dict)

    skill_count = len(active)
    readiness_label = "highly competitive" if readiness["overall"] >= 80 else "competitive" if readiness["overall"] >= 60 else "developing"

    return (
        f"Your profile demonstrates {readiness_label} potential for a career as a {role} "
        f"with {skill_count} relevant skills, {projects} project(s), "
        f"{internships} internship(s), and {certs} certification(s). "
        f"{'Your practical project experience provides a strong foundation. ' if projects >= 2 else 'Building more projects will strengthen your practical foundation. '}"
        f"{'Your internship experience gives you valuable industry exposure. ' if internships >= 1 else 'Seeking internship opportunities will accelerate your career growth. '}"
        f"By strengthening advanced concepts, earning industry certifications, "
        f"and building a strong professional portfolio, you will become {readiness_label} "
        f"for {role} positions in the industry."
    )


def _get_match_label(confidence):
    if confidence >= 90:
        return "Excellent Match"
    elif confidence >= 80:
        return "Very Good Match"
    elif confidence >= 65:
        return "Good Match"
    else:
        return "Average Match"


def predict(python, java, javascript, react, node, express,
            mongodb, sql, html, css, git, dsa,
            communication, problem_solving,
            projects_count, internship_count, certification_count,
            interested_domain, **kwargs):
    model, feature_names = load_model()
    if model is None:
        return {"error": "Model not found. Train the model first."}

    features_dict = {
        'Python': python, 'Java': java, 'JavaScript': javascript,
        'React': react, 'Node': node, 'Express': express,
        'MongoDB': mongodb, 'SQL': sql, 'HTML': html, 'CSS': css,
        'Git': git, 'DSA': dsa, 'Communication': communication,
        'Problem_Solving': problem_solving,
        'Projects_Count': projects_count, 'Internship_Count': internship_count,
        'Certification_Count': certification_count,
        'Interested_Domain': interested_domain,
    }

    skills_list = kwargs.get('skills_list', [])

    features = np.array([[features_dict[f] for f in feature_names]])
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]

    top_indices = np.argsort(probabilities)[::-1]
    all_classes = model.classes_

    primary = all_classes[top_indices[0]]
    confidence = round(float(probabilities[top_indices[0]] * 100), 1)

    description = _generate_description(primary, features_dict, skills_list)
    why_role = _generate_why_this_role(primary, features_dict, skills_list)
    strengths = _generate_strengths(primary, features_dict, skills_list)
    skill_gaps = _generate_skill_gaps(primary, features_dict, skills_list)
    roadmap = _generate_roadmap(primary, features_dict)
    certs = _generate_certs(primary)
    jobs = _generate_jobs(primary)
    alternatives = _generate_alternatives(primary, features_dict)
    salary = _generate_salary()
    growth = _generate_growth(primary)
    readiness = _generate_readiness(features_dict)
    suggestions = _generate_ai_suggestions(primary, features_dict)
    summary = _generate_summary(primary, features_dict, readiness)

    return {
        "recommended_role": primary,
        "role_description": description,
        "match_score": confidence,
        "match_label": _get_match_label(confidence),
        "why_this_role": why_role,
        "strengths": strengths,
        "skill_gaps": skill_gaps,
        "learning_roadmap": roadmap,
        "certifications": certs,
        "suitable_jobs": jobs,
        "alternative_roles": alternatives,
        "expected_salary": salary,
        "career_growth": growth,
        "placement_readiness": readiness,
        "ai_suggestions": suggestions,
        "final_summary": summary,
    }
