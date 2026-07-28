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

SKILL_ALIASES = {
    "javascript": "JavaScript", "js": "JavaScript", "typescript": "TypeScript",
    "react": "React", "reactjs": "React",
    "node": "Node.js", "nodejs": "Node.js", "express": "Express", "expressjs": "Express",
    "mongodb": "MongoDB", "mongo": "MongoDB",
    "python": "Python", "java": "Java",
    "html": "HTML", "html5": "HTML",
    "css": "CSS", "css3": "CSS",
    "sql": "SQL", "mysql": "SQL", "postgresql": "SQL",
    "git": "Git", "github": "Git",
    "dsa": "DSA",
    "docker": "Docker", "aws": "AWS",
    "machine learning": "Machine Learning", "ml": "Machine Learning",
    "deep learning": "Deep Learning",
    "data visualization": "Data Visualization",
    "statistics": "Statistics", "stats": "Statistics",
    "linux": "Linux", "kubernetes": "Kubernetes", "k8s": "Kubernetes",
    "excel": "Excel",
    "testing": "Testing", "qa": "Testing",
    "automation": "Automation",
    "rest api": "REST APIs", "api": "REST APIs",
    "authentication": "Authentication", "auth": "Authentication",
    "figma": "Figma",
    "tableau": "Tableau", "pandas": "Pandas",
    "tensorflow": "TensorFlow", "pytorch": "PyTorch",
    "nlp": "NLP",
    "ci/cd": "CI/CD", "ci cd": "CI/CD",
    "terraform": "Terraform", "ansible": "Ansible",
}


def normalize_skill(name):
    key = name.lower().strip()
    return SKILL_ALIASES.get(key, name)


def analyze(user_skills, target_role):
    if target_role not in REQUIRED_SKILLS:
        return {"error": f"Target role '{target_role}' not found."}

    norm_skills = set()
    for s in user_skills:
        norm_skills.add(normalize_skill(s))

    required = REQUIRED_SKILLS[target_role]
    all_required = required["essential"] + required["recommended"] + required["optional"]

    skills_present = [s for s in all_required if s in norm_skills]
    skills_missing = [s for s in all_required if s not in norm_skills]

    present_count = len(skills_present)
    total_count = len(all_required)
    missing_names = ", ".join(skills_missing[:4])

    if present_count >= total_count:
        summary = "Excellent! You already possess all core skills required for this role."
    elif present_count >= total_count * 0.5:
        summary = f"You already have a strong foundation for {target_role}. Learning {missing_names} will significantly improve your profile and prepare you for industry-level roles."
    else:
        summary = f"You are building your {target_role} skillset. Focus on learning {missing_names} to build a strong foundation for this career path."

    return {
        "target_role": target_role,
        "skills_available": skills_present,
        "skills_missing": skills_missing,
        "present_count": present_count,
        "total_required": total_count,
        "summary": summary,
    }
