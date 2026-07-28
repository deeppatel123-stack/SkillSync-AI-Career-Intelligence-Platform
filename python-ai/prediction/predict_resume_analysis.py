"""
Resume Analysis - Prediction Module
Loads DecisionTreeClassifier and generates a comprehensive report
Fully deterministic — identical inputs always produce identical outputs
"""

import joblib
import pandas as pd
from pathlib import Path


def load_model():
    models_dir = Path(__file__).resolve().parent.parent / 'trained_models'
    try:
        model = joblib.load(models_dir / 'resume_analysis_model.pkl')
        encoder = joblib.load(models_dir / 'resume_analysis_encoder.pkl')
        features = joblib.load(models_dir / 'resume_analysis_features.pkl')
        return model, encoder, features
    except FileNotFoundError:
        return None, None, None


def _get_score_for_category(category, features):
    skills = features.get('Technical_Skills', 0)
    projects = features.get('Projects', 0)
    internships = features.get('Internships', 0)
    certs = features.get('Certifications', 0)
    cgpa = features.get('CGPA', 0)
    has_github = features.get('Has_GitHub', 0)
    has_linkedin = features.get('Has_LinkedIn', 0)
    has_portfolio = features.get('Has_Portfolio', 0)
    languages = features.get('Languages_Known', 0)
    soft_skills = features.get('Soft_Skills', 0)
    workshops = features.get('Workshops', 0)

    bonus = (
        min(skills, 18) * 0.5 +
        min(projects, 10) * 1.0 +
        min(internships, 5) * 1.5 +
        min(certs, 8) * 0.8 +
        min(cgpa, 10.0) * 0.5 +
        has_github * 2 +
        has_linkedin * 1 +
        has_portfolio * 2 +
        min(languages, 5) * 1.0 +
        min(soft_skills, 6) * 0.8 +
        min(workshops, 5) * 0.8
    )

    ranges = {
        'Excellent': (90, 100),
        'Good': (75, 89),
        'Average': (60, 74),
        'Needs Improvement': (40, 59),
    }
    low, high = ranges.get(category, (40, 59))
    score = low + int(bonus) % (high - low + 1)
    return min(score, high)


def _generate_summary(category, features):
    skills = features.get('Technical_Skills', 0)
    projects = features.get('Projects', 0)
    internships = features.get('Internships', 0)
    certs = features.get('Certifications', 0)
    cgpa = features.get('CGPA', 0)
    has_github = features.get('Has_GitHub', 0)
    has_linkedin = features.get('Has_LinkedIn', 0)
    has_portfolio = features.get('Has_Portfolio', 0)
    languages = features.get('Languages_Known', 0)
    soft_skills = features.get('Soft_Skills', 0)
    workshops = features.get('Workshops', 0)

    if category == 'Excellent':
        return (
            f"This student demonstrates an outstanding professional profile with a strong command of {skills} technical skills "
            f"and practical experience through {projects} projects. "
            f"The academic record is impressive with a CGPA of {cgpa}, complemented by {internships} internship(s) "
            f"and {certs} certification(s). "
            f"The student has cultivated {soft_skills} soft skills and participated in {workshops} workshop(s)/hackathon(s), "
            f"showcasing a well-rounded professional development. "
            f"{'An active GitHub profile and ' if has_github else ''}"
            f"{'a LinkedIn presence ' if has_linkedin else ''}"
            f"{'and a portfolio website ' if has_portfolio else ''}"
            f"further strengthen the digital footprint. "
            f"The student is highly employable and ready for competitive roles in the industry."
        )
    elif category == 'Good':
        return (
            f"This student has a solid professional foundation with {skills} technical skills and "
            f"{projects} project(s) demonstrating practical ability. "
            f"With a CGPA of {cgpa}, {internships} internship(s), and {certs} certification(s), "
            f"the profile shows good academic and practical balance. "
            f"Proficiency in {languages} programming language(s) and {soft_skills} soft skills "
            f"indicate strong communication and technical capabilities. "
            f"The student is on the right track and with targeted improvements can become an outstanding candidate."
        )
    elif category == 'Average':
        return (
            f"This student has a developing profile with {skills} technical skills and "
            f"{projects} project(s). The CGPA of {cgpa} indicates satisfactory academic performance. "
            f"{'With ' + str(internships) + ' internship(s) ' if internships else ''}"
            f"{'and ' + str(certs) + ' certification(s) ' if certs else ''}"
            f"there is room for growth in practical exposure. "
            f"Focusing on building more projects, gaining certifications, and strengthening technical fundamentals "
            f"will significantly improve employability."
        )
    else:
        return (
            f"This student's profile is at an early stage with {skills} technical skills "
            f"and {projects} project(s). The CGPA of {cgpa} suggests academic potential that needs to be "
            f"complemented with practical experience. "
            f"There is a need to actively build projects, pursue internships, earn certifications, "
            f"and strengthen the overall skill set. "
            f"With consistent effort and structured career planning, the student can significantly improve their profile."
        )


def _generate_strengths(features):
    strengths = []
    skills = features.get('Technical_Skills', 0)
    projects = features.get('Projects', 0)
    internships = features.get('Internships', 0)
    certs = features.get('Certifications', 0)
    cgpa = features.get('CGPA', 0)
    has_github = features.get('Has_GitHub', 0)
    has_portfolio = features.get('Has_Portfolio', 0)
    languages = features.get('Languages_Known', 0)
    soft_skills = features.get('Soft_Skills', 0)
    workshops = features.get('Workshops', 0)

    if skills >= 8: strengths.append('Strong technical skill set with expertise in multiple technologies')
    elif skills >= 5: strengths.append('Good technical skill foundation')
    if projects >= 4: strengths.append('Substantial project portfolio with practical implementation experience')
    elif projects >= 2: strengths.append('Practical project experience demonstrating applied learning')
    if internships >= 2: strengths.append('Valuable industry internship experience')
    elif internships == 1: strengths.append('Industry internship exposure')
    if certs >= 3: strengths.append('Multiple industry certifications showing continuous learning')
    elif certs >= 1: strengths.append('Certification in relevant domain')
    if cgpa >= 8.5: strengths.append('Excellent academic performance with strong CGPA')
    elif cgpa >= 7.0: strengths.append('Good academic performance')
    if has_github: strengths.append('Active GitHub profile showcasing technical work and contributions')
    if has_portfolio: strengths.append('Professional portfolio website demonstrating work')
    if languages >= 3: strengths.append('Proficiency in multiple programming languages')
    if soft_skills >= 4: strengths.append('Strong communication and interpersonal skills')
    elif soft_skills >= 2: strengths.append('Developing professional soft skills')
    if workshops >= 3: strengths.append('Active participation in workshops and hackathons')
    elif workshops >= 1: strengths.append('Participation in co-curricular events and workshops')

    return strengths if strengths else ['Building foundational technical skills']


def _generate_improvements(features):
    improvements = []
    skills = features.get('Technical_Skills', 0)
    projects = features.get('Projects', 0)
    internships = features.get('Internships', 0)
    certs = features.get('Certifications', 0)
    cgpa = features.get('CGPA', 0)
    has_github = features.get('Has_GitHub', 0)
    has_linkedin = features.get('Has_LinkedIn', 0)
    has_portfolio = features.get('Has_Portfolio', 0)
    languages = features.get('Languages_Known', 0)
    soft_skills = features.get('Soft_Skills', 0)
    workshops = features.get('Workshops', 0)

    if projects < 3: improvements.append('Build more real-world projects to strengthen practical experience')
    if internships < 1: improvements.append('Gain internship experience for industry exposure')
    if certs < 2: improvements.append('Earn industry-recognized certifications in your domain')
    if cgpa < 7.0: improvements.append('Focus on improving academic performance')
    if not has_github: improvements.append('Create and maintain an active GitHub profile to showcase your work')
    if not has_linkedin: improvements.append('Build a professional LinkedIn profile for networking')
    if not has_portfolio: improvements.append('Create a personal portfolio website to display your projects')
    if languages < 2: improvements.append('Learn additional programming languages to expand your skill set')
    if soft_skills < 3: improvements.append('Develop soft skills through group projects and presentations')
    if workshops < 2: improvements.append('Participate in hackathons and workshops to gain exposure')
    if skills < 6: improvements.append('Expand technical skill set by learning in-demand technologies')

    return improvements if improvements else ['Continue building on your current progress']


def _generate_recommendations(features, category):
    recommendations = []
    skills = features.get('Technical_Skills', 0)
    projects = features.get('Projects', 0)
    internships = features.get('Internships', 0)

    if projects < 4:
        recommendations.append('Complete two additional full-stack projects using the MERN stack')
    if skills < 8:
        recommendations.append('Learn advanced frameworks and technologies in your domain')
    if internships < 1:
        recommendations.append('Apply for internship opportunities to gain industry experience')
    if category == 'Needs Improvement':
        recommendations.append('Focus on building Data Structures and Algorithms fundamentals')
        recommendations.append('Enroll in a structured coding bootcamp or online certification program')
    if category == 'Average':
        recommendations.append('Earn AWS or Google Cloud certification to boost your profile')
        recommendations.append('Improve Data Structures and Algorithms for technical interviews')
    if category == 'Good':
        recommendations.append('Contribute to open-source projects to build credibility')
        recommendations.append('Participate in coding competitions on platforms like LeetCode or Codeforces')
    if category == 'Excellent':
        recommendations.append('Mentor junior developers and contribute to the tech community')
        recommendations.append('Explore advanced specializations like AI/ML or cloud architecture')

    recommendations.append('Build a strong online presence through technical blogging on LinkedIn or Medium')

    return recommendations


def _generate_roles(features, category):
    skills = features.get('Technical_Skills', 0)
    projects = features.get('Projects', 0)

    selected = []
    if skills >= 6 or projects >= 3:
        selected.extend(['Full Stack Developer', 'Software Engineer'])
    if skills >= 4:
        selected.extend(['Frontend Developer', 'Backend Developer'])
    if skills >= 3 or projects >= 2:
        selected.append('Python Developer')

    if category == 'Excellent':
        selected.extend(['DevOps Engineer', 'Machine Learning Engineer'])
    elif category == 'Good':
        selected.extend(['Data Analyst', 'UI/UX Developer'])
    else:
        selected.extend(['QA Engineer', 'Junior Developer'])

    roles_pool = [
        'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
        'Python Developer', 'Software Engineer', 'Data Analyst',
        'Machine Learning Engineer', 'UI/UX Developer', 'QA Engineer',
        'DevOps Engineer', 'Cloud Engineer', 'Mobile App Developer',
    ]

    available = [r for r in roles_pool if r not in selected]
    needed = max(3, min(6, skills // 2))
    while len(selected) < needed and available:
        selected.append(available.pop(0))

    return selected[:6]


def _generate_insights(features, category):
    skills = features.get('Technical_Skills', 0)
    projects = features.get('Projects', 0)
    internships = features.get('Internships', 0)
    certs = features.get('Certifications', 0)
    cgpa = features.get('CGPA', 0)
    has_github = features.get('Has_GitHub', 0)
    has_linkedin = features.get('Has_LinkedIn', 0)
    has_portfolio = features.get('Has_Portfolio', 0)
    languages = features.get('Languages_Known', 0)
    soft_skills = features.get('Soft_Skills', 0)
    workshops = features.get('Workshops', 0)

    max_skills = 18; max_projects = 10; max_internships = 5
    max_certs = 8; max_languages = 5; max_soft = 6; max_workshops = 5

    completion = min(100, int(
        (skills / max_skills) * 15 + (projects / max_projects) * 15 +
        (internships / max_internships) * 12 + (certs / max_certs) * 10 +
        (min(float(cgpa), 10.0) / 10.0) * 10 + (has_github) * 6 +
        (has_linkedin) * 4 + (has_portfolio) * 6 +
        (languages / max_languages) * 7 + (soft_skills / max_soft) * 8 +
        (workshops / max_workshops) * 7
    ))

    readiness_map = {
        'Excellent': ('Advanced', 'Highly Ready', 92, 'High'),
        'Good': ('Intermediate', 'Ready', 78, 'Moderate-High'),
        'Average': ('Beginner-Intermediate', 'Needs Preparation', 60, 'Moderate'),
        'Needs Improvement': ('Beginner', 'Not Ready', 40, 'Low'),
    }
    readiness, placement, confidence, growth = readiness_map.get(category, ('Beginner', 'Not Ready', 40, 'Low'))

    return {
        'profile_completion': completion,
        'industry_readiness': readiness,
        'placement_readiness': placement,
        'confidence': confidence,
        'career_growth_potential': growth,
    }


def predict(**kwargs):
    model, encoder, feature_names = load_model()
    if model is None:
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

    features_array = pd.DataFrame([[
        skills, projects, internships, certs,
        cgpa, has_github, has_linkedin, has_portfolio,
        languages, soft_skills, workshops
    ]], columns=feature_names)

    features_dict = {
        'Technical_Skills': skills, 'Projects': projects,
        'Internships': internships, 'Certifications': certs,
        'CGPA': cgpa, 'Has_GitHub': has_github,
        'Has_LinkedIn': has_linkedin, 'Has_Portfolio': has_portfolio,
        'Languages_Known': languages, 'Soft_Skills': soft_skills,
        'Workshops': workshops,
    }

    encoded_pred = model.predict(features_array)[0]
    category = encoder.inverse_transform([encoded_pred])[0]
    score = _get_score_for_category(category, features_dict)
    summary = _generate_summary(category, features_dict)
    strengths = _generate_strengths(features_dict)
    improvements = _generate_improvements(features_dict)
    recommendations = _generate_recommendations(features_dict, category)
    roles = _generate_roles(features_dict, category)
    insights = _generate_insights(features_dict, category)

    return {
        'category': category,
        'resume_score': score,
        'profile_completion': insights['profile_completion'],
        'industry_readiness': insights['industry_readiness'],
        'placement_readiness': insights['placement_readiness'],
        'confidence': insights['confidence'],
        'career_growth_potential': insights['career_growth_potential'],
        'summary': summary,
        'strengths': strengths,
        'areas_for_improvement': improvements,
        'recommendations': recommendations,
        'suitable_roles': roles,
    }
