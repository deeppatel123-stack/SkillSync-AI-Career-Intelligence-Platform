"""
Career Role Recommendation - Prediction Script
Loads model and generates professional career recommendation report
"""

import joblib
import numpy as np
from pathlib import Path

ROLE_REASONS = {
    "Frontend Developer": "Your JavaScript, React, HTML, and CSS skills align well with frontend development requirements.",
    "Backend Developer": "Your Python, Node.js, SQL, and database skills match backend development profiles.",
    "Full Stack Developer": "Your combined frontend and backend skills make you suitable for full stack development.",
    "Data Analyst": "Your Python, SQL, and analytical skills match data analysis requirements.",
    "Data Scientist": "Your Python, DSA, and problem-solving skills align with data science roles.",
    "AI/ML Engineer": "Your Python, DSA, and problem-solving background fits AI and machine learning roles.",
    "DevOps Engineer": "Your Git, scripting, and deployment-related skills match DevOps requirements.",
    "QA Engineer": "Your attention to detail and testing-oriented skills suit quality assurance roles.",
    "UI/UX Designer": "Your design skills, HTML, CSS, and user-focused approach match UI/UX roles.",
    "Cyber Security Analyst": "Your security awareness and technical skills align with cybersecurity roles.",
}

def load_model():
    models_dir = Path(__file__).resolve().parent.parent / 'trained_models'
    try:
        model = joblib.load(models_dir / 'career_role_model.pkl')
        feature_names = joblib.load(models_dir / 'career_role_features.pkl')
        return model, feature_names
    except FileNotFoundError:
        return None, None

def _get_key_skills(features_dict, top_n=5):
    skill_labels = {
        'Python': 'Python', 'Java': 'Java', 'JavaScript': 'JavaScript',
        'React': 'React', 'Node': 'Node.js', 'Express': 'Express',
        'MongoDB': 'MongoDB', 'SQL': 'SQL', 'HTML': 'HTML', 'CSS': 'CSS',
        'Git': 'Git/GitHub', 'DSA': 'Data Structures & Algorithms',
        'Communication': 'Communication', 'Problem_Solving': 'Problem Solving'
    }
    scored = []
    for key, label in skill_labels.items():
        val = features_dict.get(key, 0)
        if val >= 0.5:
            scored.append((label, val))
    scored.sort(key=lambda x: -x[1])
    return [s[0] for s in scored[:top_n]]

def predict(python, java, javascript, react, node, express,
            mongodb, sql, html, css, git, dsa,
            communication, problem_solving,
            projects_count, internship_count, certification_count,
            interested_domain):
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

    features = np.array([[features_dict[f] for f in feature_names]])
    prediction = model.predict(features)[0]
    probabilities = model.predict_proba(features)[0]

    top_indices = np.argsort(probabilities)[::-1][:3]
    all_classes = model.classes_

    primary = all_classes[top_indices[0]]
    alternatives = [all_classes[idx] for idx in top_indices[1:]]
    reason = ROLE_REASONS.get(primary, "Your skills match this career role.")

    key_skills = _get_key_skills(features_dict)

    return {
        "primary_recommendation": primary,
        "reason": reason,
        "alternative_roles": alternatives,
        "key_skills": key_skills,
        "confidence": round(float(probabilities[top_indices[0]] * 100), 1)
    }
