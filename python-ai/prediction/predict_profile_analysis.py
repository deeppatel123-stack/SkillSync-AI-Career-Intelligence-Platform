"""
Profile Analysis - Prediction Module (College Practical Style)
Loads DecisionTreeClassifier and returns analysis results
"""

import joblib
import pandas as pd
from pathlib import Path


def predict(**kwargs):
    models_dir = Path(__file__).resolve().parent.parent / 'trained_models'
    try:
        model = joblib.load(models_dir / 'profile_analysis_model.pkl')
        encoder = joblib.load(models_dir / 'profile_analysis_encoder.pkl')
        feature_names = joblib.load(models_dir / 'profile_analysis_features.pkl')
    except FileNotFoundError:
        return {'error': 'Model not found. Train the model first.'}

    skills = int(kwargs.get('technical_skills', 0))
    projects = int(kwargs.get('projects', 0))
    internships = int(kwargs.get('internships', 0))
    certs = int(kwargs.get('certifications', 0))
    cgpa = float(kwargs.get('cgpa', 0))
    has_github = int(kwargs.get('has_github', 0))
    has_linkedin = int(kwargs.get('has_linkedin', 0))
    has_portfolio = int(kwargs.get('has_portfolio', 0))
    languages = int(kwargs.get('languages_known', 0))
    soft_skills = int(kwargs.get('soft_skills', 0))
    workshops = int(kwargs.get('workshops', 0))

    features = pd.DataFrame([[
        skills, projects, internships, certs,
        cgpa, has_github, has_linkedin, has_portfolio,
        languages, soft_skills, workshops
    ]], columns=feature_names)

    encoded = model.predict(features)[0]
    category = encoder.inverse_transform([encoded])[0]

    bonus = (min(skills, 18) * 0.5 + min(projects, 10) * 1.0 +
             min(internships, 5) * 1.5 + min(certs, 8) * 0.8 +
             min(cgpa, 10.0) * 0.5 + has_github * 2 + has_linkedin * 1 +
             has_portfolio * 2 + min(languages, 5) * 1.0 +
             min(soft_skills, 6) * 0.8 + min(workshops, 5) * 0.8)
    ranges = {'Excellent': (90, 100), 'Good': (75, 89), 'Average': (60, 74), 'Needs Improvement': (40, 59)}
    low, high = ranges.get(category, (40, 59))
    score = min(low + int(bonus) % (high - low + 1), high)

    completion = min(100, int(skills/18*15 + projects/10*15 + internships/5*12 + certs/8*10 +
                    min(cgpa,10)/10*10 + has_github*6 + has_linkedin*4 + has_portfolio*6 +
                    languages/5*7 + soft_skills/6*8 + workshops/5*7))
    readiness_labels = {'Excellent': ('Advanced','Highly Ready',92,'High'),
                        'Good': ('Intermediate','Ready',78,'Moderate-High'),
                        'Average': ('Beginner-Intermediate','Needs Preparation',60,'Moderate'),
                        'Needs Improvement': ('Beginner','Not Ready',40,'Low')}
    ir, pr, conf, cgp = readiness_labels.get(category, ('Beginner','Not Ready',40,'Low'))

    def strengths():
        s = []
        if skills >= 8: s.append('Strong technical skill set with expertise in multiple technologies')
        elif skills >= 5: s.append('Good technical skill foundation')
        if projects >= 4: s.append('Substantial project portfolio with practical implementation experience')
        elif projects >= 2: s.append('Practical project experience demonstrating applied learning')
        if internships >= 2: s.append('Valuable industry internship experience')
        elif internships == 1: s.append('Industry internship exposure')
        if certs >= 3: s.append('Multiple industry certifications showing continuous learning')
        elif certs >= 1: s.append('Certification in relevant domain')
        if cgpa >= 8.5: s.append('Excellent academic performance with strong CGPA')
        elif cgpa >= 7.0: s.append('Good academic performance')
        if has_github: s.append('Active GitHub profile showcasing technical work and contributions')
        if has_portfolio: s.append('Professional portfolio website demonstrating work')
        if languages >= 3: s.append('Proficiency in multiple programming languages')
        if soft_skills >= 4: s.append('Strong communication and interpersonal skills')
        elif soft_skills >= 2: s.append('Developing professional soft skills')
        if workshops >= 3: s.append('Active participation in workshops and hackathons')
        elif workshops >= 1: s.append('Participation in co-curricular events and workshops')
        return s if s else ['Building foundational technical skills']

    def improvements():
        imp = []
        if projects < 3: imp.append('Build more real-world projects to strengthen practical experience')
        if internships < 1: imp.append('Gain internship experience for industry exposure')
        if certs < 2: imp.append('Earn industry-recognized certifications in your domain')
        if cgpa < 7.0: imp.append('Focus on improving academic performance')
        if not has_github: imp.append('Create and maintain an active GitHub profile to showcase your work')
        if not has_linkedin: imp.append('Build a professional LinkedIn profile for networking')
        if not has_portfolio: imp.append('Create a personal portfolio website to display your projects')
        if languages < 2: imp.append('Learn additional programming languages to expand your skill set')
        if soft_skills < 3: imp.append('Develop soft skills through group projects and presentations')
        if workshops < 2: imp.append('Participate in hackathons and workshops to gain exposure')
        if skills < 6: imp.append('Expand technical skill set by learning in-demand technologies')
        return imp if imp else ['Continue building on your current progress']

    def recommendations():
        rec = []
        if projects < 4: rec.append('Complete two additional full-stack projects using the MERN stack')
        if skills < 8: rec.append('Learn advanced frameworks and technologies in your domain')
        if internships < 1: rec.append('Apply for internship opportunities to gain industry experience')
        if category == 'Needs Improvement':
            rec.extend(['Focus on building Data Structures and Algorithms fundamentals', 'Enroll in a structured coding bootcamp or online certification program'])
        elif category == 'Average':
            rec.extend(['Earn AWS or Google Cloud certification to boost your profile', 'Improve Data Structures and Algorithms for technical interviews'])
        elif category == 'Good':
            rec.extend(['Contribute to open-source projects to build credibility', 'Participate in coding competitions on platforms like LeetCode or Codeforces'])
        elif category == 'Excellent':
            rec.extend(['Mentor junior developers and contribute to the tech community', 'Explore advanced specializations like AI/ML or cloud architecture'])
        rec.append('Build a strong online presence through technical blogging on LinkedIn or Medium')
        return rec

    def suitable_roles():
        selected = []
        if skills >= 6 or projects >= 3: selected.extend(['Full Stack Developer', 'Software Engineer'])
        if skills >= 4: selected.extend(['Frontend Developer', 'Backend Developer'])
        if skills >= 3 or projects >= 2: selected.append('Python Developer')
        if category == 'Excellent': selected.extend(['DevOps Engineer', 'Machine Learning Engineer'])
        elif category == 'Good': selected.extend(['Data Analyst', 'UI/UX Developer'])
        else: selected.extend(['QA Engineer', 'Junior Developer'])
        pool = ['Frontend Developer', 'Backend Developer', 'Full Stack Developer', 'Python Developer',
                'Software Engineer', 'Data Analyst', 'Machine Learning Engineer', 'UI/UX Developer',
                'QA Engineer', 'DevOps Engineer', 'Cloud Engineer', 'Mobile App Developer']
        for r in pool:
            if r not in selected: selected.append(r)
            if len(selected) >= max(3, min(6, skills // 2)): break
        return selected[:6]

    summary_map = {
        'Excellent': f"This student demonstrates an outstanding professional profile with a strong command of {skills} technical skills and practical experience through {projects} projects. The academic record is impressive with a CGPA of {cgpa}, complemented by {internships} internship(s) and {certs} certification(s). {'An active GitHub profile and ' if has_github else ''}{'a LinkedIn presence ' if has_linkedin else ''}{'and a portfolio website ' if has_portfolio else ''}further strengthen the digital footprint. The student is highly employable and ready for competitive roles in the industry.",
        'Good': f"This student has a solid professional foundation with {skills} technical skills and {projects} project(s) demonstrating practical ability. With a CGPA of {cgpa}, {internships} internship(s), and {certs} certification(s), the profile shows good academic and practical balance.",
        'Average': f"This student has a developing profile with {skills} technical skills and {projects} project(s). The CGPA of {cgpa} indicates satisfactory academic performance. There is room for growth in practical exposure.",
        'Needs Improvement': f"This student's profile is at an early stage with {skills} technical skills and {projects} project(s). The CGPA of {cgpa} suggests academic potential that needs to be complemented with practical experience.",
    }

    return {
        'category': category,
        'profile_score': score,
        'profile_completion': completion,
        'industry_readiness': ir,
        'placement_readiness': pr,
        'confidence': conf,
        'career_growth_potential': cgp,
        'summary': summary_map.get(category, ''),
        'strengths': strengths(),
        'areas_for_improvement': improvements(),
        'recommendations': recommendations(),
        'suitable_roles': suitable_roles(),
    }
