"""
Skill Gap Analysis - Rule-based analyzer
No Machine Learning - just structured skill comparison
"""

REQUIRED_SKILLS = {
    "Frontend Developer": {
        "essential": ["HTML", "CSS", "JavaScript", "React"],
        "recommended": ["TypeScript", "Git", "Responsive Design", "REST APIs"],
        "optional": ["Next.js", "Tailwind CSS", "Testing"]
    },
    "Backend Developer": {
        "essential": ["Python", "Node.js", "SQL", "Express"],
        "recommended": ["MongoDB", "Git", "REST APIs", "Authentication"],
        "optional": ["Docker", "AWS", "Redis", "GraphQL"]
    },
    "Full Stack Developer": {
        "essential": ["HTML", "CSS", "JavaScript", "React", "Node.js", "SQL", "MongoDB", "Express"],
        "recommended": ["Git", "REST APIs", "DSA", "Authentication"],
        "optional": ["TypeScript", "Docker", "AWS", "Tailwind CSS"]
    },
    "Data Analyst": {
        "essential": ["Python", "SQL", "Excel", "Data Visualization"],
        "recommended": ["Statistics", "Pandas", "Tableau", "Git"],
        "optional": ["R", "Power BI", "Web Scraping"]
    },
    "Data Scientist": {
        "essential": ["Python", "SQL", "Statistics", "Machine Learning"],
        "recommended": ["DSA", "Data Visualization", "Git", "Deep Learning"],
        "optional": ["TensorFlow", "NLP", "Cloud Platforms", "Big Data"]
    },
    "AI/ML Engineer": {
        "essential": ["Python", "DSA", "Machine Learning", "Statistics"],
        "recommended": ["Deep Learning", "SQL", "Git", "Data Visualization"],
        "optional": ["TensorFlow", "PyTorch", "NLP", "Computer Vision", "Cloud"]
    },
    "DevOps Engineer": {
        "essential": ["Linux", "Docker", "Git", "CI/CD"],
        "recommended": ["Python", "AWS", "Kubernetes", "Scripting"],
        "optional": ["Terraform", "Ansible", "Monitoring", "Networking"]
    },
    "QA Engineer": {
        "essential": ["Testing", "Python", "SQL", "Git"],
        "recommended": ["Automation", "JavaScript", "API Testing", "Agile"],
        "optional": ["Selenium", "Performance Testing", "Docker"]
    },
    "UI/UX Designer": {
        "essential": ["HTML", "CSS", "JavaScript", "Design Tools"],
        "recommended": ["React", "Wireframing", "Prototyping", "User Research"],
        "optional": ["Figma", "Adobe XD", "Animation", "Accessibility"]
    },
    "Cyber Security Analyst": {
        "essential": ["Networking", "Operating Systems", "Python", "Security Tools"],
        "recommended": ["SQL", "Git", "Scripting", "Cryptography"],
        "optional": ["Cloud Security", "Penetration Testing", "Forensics"]
    },
}

LEARNING_TIME = {
    "HTML": "1-2 weeks", "CSS": "2-3 weeks", "JavaScript": "4-6 weeks",
    "React": "4-6 weeks", "Node.js": "3-4 weeks", "Express": "1-2 weeks",
    "MongoDB": "2-3 weeks", "SQL": "3-4 weeks", "Python": "4-6 weeks",
    "Git": "1-2 weeks", "DSA": "6-8 weeks", "TypeScript": "2-3 weeks",
    "Docker": "2-3 weeks", "AWS": "4-6 weeks", "REST APIs": "1-2 weeks",
    "Authentication": "1-2 weeks", "Linux": "3-4 weeks", "CI/CD": "2-3 weeks",
    "Kubernetes": "4-6 weeks", "Machine Learning": "6-8 weeks",
    "Data Visualization": "2-3 weeks", "Statistics": "4-6 weeks",
    "Deep Learning": "6-8 weeks", "Excel": "2-3 weeks",
    "Testing": "2-3 weeks", "Automation": "3-4 weeks",
    "Design Tools": "3-4 weeks", "Networking": "4-6 weeks",
    "Operating Systems": "3-4 weeks", "Security Tools": "3-4 weeks",
    "Pandas": "1-2 weeks", "Tableau": "2-3 weeks",
    "Responsive Design": "1-2 weeks", "Tailwind CSS": "1-2 weeks",
    "Next.js": "2-3 weeks", "Wireframing": "1-2 weeks",
    "Prototyping": "2-3 weeks", "User Research": "2-3 weeks",
    "Scripting": "2-3 weeks", "Cryptography": "3-4 weeks",
    "Agile": "1-2 weeks", "API Testing": "1-2 weeks",
    "Figma": "2-3 weeks", "Power BI": "2-3 weeks",
    "R": "3-4 weeks", "TensorFlow": "4-6 weeks",
    "PyTorch": "4-6 weeks", "NLP": "4-6 weeks",
    "Computer Vision": "4-6 weeks", "Cloud Platforms": "4-6 weeks",
    "Big Data": "4-6 weeks", "Terraform": "3-4 weeks",
    "Ansible": "2-3 weeks", "Monitoring": "2-3 weeks",
    "Selenium": "2-3 weeks", "Performance Testing": "2-3 weeks",
    "Redis": "1-2 weeks", "GraphQL": "2-3 weeks",
    "Cloud Security": "3-4 weeks", "Penetration Testing": "4-6 weeks",
    "Forensics": "3-4 weeks", "Web Scraping": "1-2 weeks",
    "Accessibility": "1-2 weeks", "Animation": "2-3 weeks",
    "Adobe XD": "2-3 weeks", "Authentication": "1-2 weeks",
}

def normalize_skill(name):
    mapping = {
        "javascript": "JavaScript", "js": "JavaScript", "typescript": "TypeScript",
        "react": "React", "reactjs": "React", "react.js": "React",
        "node": "Node.js", "nodejs": "Node.js", "node.js": "Node.js",
        "express": "Express", "expressjs": "Express",
        "mongodb": "MongoDB", "mongo": "MongoDB",
        "python": "Python", "java": "Java",
        "html": "HTML", "html5": "HTML",
        "css": "CSS", "css3": "CSS",
        "sql": "SQL", "mysql": "SQL", "postgresql": "SQL",
        "git": "Git", "github": "Git", "git/github": "Git",
        "dsa": "DSA", "data structures": "DSA", "algorithms": "DSA",
        "docker": "Docker", "aws": "AWS",
        "machine learning": "Machine Learning", "ml": "Machine Learning",
        "deep learning": "Deep Learning",
        "data visualization": "Data Visualization", "tableau": "Tableau",
        "pandas": "Pandas",
        "statistics": "Statistics", "stats": "Statistics",
        "linux": "Linux", "ci/cd": "CI/CD", "ci cd": "CI/CD",
        "kubernetes": "Kubernetes", "k8s": "Kubernetes",
        "networking": "Networking", "network": "Networking",
        "security": "Security Tools", "cyber security": "Security Tools",
        "excel": "Excel",
        "testing": "Testing", "qa": "Testing",
        "automation": "Automation", "rest api": "REST APIs", "api": "REST APIs",
        "authentication": "Authentication", "auth": "Authentication",
        "design": "Design Tools", "ui/ux": "Design Tools",
        "figma": "Figma", "wireframe": "Wireframing",
        "prototype": "Prototyping", "responsive": "Responsive Design",
        "tailwind": "Tailwind CSS", "bootstrap": "Tailwind CSS",
        "nextjs": "Next.js", "next": "Next.js",
        "typescript": "TypeScript",
    }
    key = name.lower().strip()
    return mapping.get(key, name)

def analyze(user_skills, target_role):
    if target_role not in REQUIRED_SKILLS:
        return {"error": f"Target role '{target_role}' not found."}

    norm_skills = set()
    for s in user_skills:
        normalized = normalize_skill(s)
        norm_skills.add(normalized)

    required = REQUIRED_SKILLS[target_role]
    all_required = required["essential"] + required["recommended"] + required["optional"]

    skill_status = {}
    for skill in all_required:
        skill_status[skill] = skill in norm_skills

    skills_present = [s for s in all_required if skill_status[s]]
    skills_missing = [s for s in all_required if not skill_status[s]]

    essential_missing = [s for s in required["essential"] if not skill_status[s]]
    recommended_missing = [s for s in required["recommended"] if not skill_status[s]]

    total_relevant = len(all_required)
    if total_relevant > 0:
        readiness = round((len(skills_present) / total_relevant) * 100)
    else:
        readiness = 0

    learning_priority = []
    for skill in required["essential"]:
        if not skill_status[skill]:
            time = LEARNING_TIME.get(skill, "2-4 weeks")
            learning_priority.append({"skill": skill, "priority": "High", "time": time})
    for skill in required["recommended"]:
        if not skill_status[skill]:
            time = LEARNING_TIME.get(skill, "2-4 weeks")
            learning_priority.append({"skill": skill, "priority": "Medium", "time": time})
    for skill in required["optional"]:
        if not skill_status[skill]:
            time = LEARNING_TIME.get(skill, "2-4 weeks")
            learning_priority.append({"skill": skill, "priority": "Low", "time": time})

    total_weeks = 0
    for item in learning_priority:
        t = item["time"]
        try:
            parts = t.split("-")
            avg = (int(parts[0]) + int(parts[1].split()[0])) / 2
            total_weeks += avg
        except:
            total_weeks += 3

    if total_weeks > 20:
        estimate = "12-16 weeks"
    elif total_weeks > 10:
        estimate = f"{int(total_weeks)} weeks"
    else:
        estimate = f"{int(total_weeks)} weeks"

    if readiness >= 70:
        recommendation = "You are well-prepared for this role. Focus on strengthening your existing skills and building portfolio projects."
    elif readiness >= 40:
        recommendation = "You have a good foundation. Focus on learning the missing essential skills and building practical projects."
    else:
        recommendation = "Start by learning the essential skills for this role. Build projects as you learn to gain practical experience."

    return {
        "target_role": target_role,
        "current_readiness": readiness,
        "skills_available": skills_present,
        "skills_missing": skills_missing,
        "essential_missing": essential_missing,
        "recommended_missing": recommended_missing,
        "learning_priority": learning_priority,
        "estimated_time": estimate,
        "recommendation": recommendation,
    }
