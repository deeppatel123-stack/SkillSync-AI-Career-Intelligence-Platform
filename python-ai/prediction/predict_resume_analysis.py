"""
Resume Analysis - Prediction Script
Loads model, predicts score, and generates professional resume assessment report
"""

import joblib
import numpy as np
from pathlib import Path

def load_model():
    models_dir = Path(__file__).resolve().parent.parent / 'trained_models'
    try:
        model = joblib.load(models_dir / 'resume_analysis_model.pkl')
        features = joblib.load(models_dir / 'resume_analysis_features.pkl')
        return model, features
    except FileNotFoundError:
        return None, None

def _generate_report(score, features_dict):
    strengths = []
    improvements = []
    recommendations = []
    suitable_roles = []

    if features_dict.get('Projects_Count', 0) >= 3:
        strengths.append("Good project portfolio with practical experience")
    else:
        improvements.append("Build more projects to strengthen practical experience")

    if features_dict.get('Internship_Count', 0) >= 1:
        strengths.append("Industry internship experience")
    else:
        improvements.append("Gain internship experience for industry exposure")

    if features_dict.get('Certification_Count', 0) >= 2:
        strengths.append("Multiple certifications showing learning initiative")
    else:
        improvements.append("Earn certifications in your domain")

    if features_dict.get('Has_GitHub', 0) == 1:
        strengths.append("Active GitHub presence showcasing work")
    else:
        improvements.append("Create a GitHub portfolio to showcase projects")

    if features_dict.get('Has_Portfolio', 0) == 1:
        strengths.append("Professional portfolio website")
    else:
        improvements.append("Build a personal portfolio website")

    if features_dict.get('Has_LinkedIn', 0) == 1:
        strengths.append("Professional LinkedIn profile")
    else:
        improvements.append("Create a LinkedIn profile for networking")

    if features_dict.get('Education_Level', 0) >= 2:
        strengths.append("Strong educational background")
    else:
        recommendations.append("Consider higher education or specialized courses")

    if features_dict.get('Skills_Count', 0) >= 8:
        strengths.append("Wide range of technical skills")
    else:
        improvements.append("Expand your technical skillset")
        recommendations.append("Learn in-demand technologies in your domain")

    if score >= 70:
        suitable_roles = [
            "Full Stack Developer",
            "Backend Developer",
            "Frontend Developer",
            "Software Engineer"
        ]
    elif score >= 50:
        suitable_roles = [
            "Junior Developer",
            "QA Engineer",
            "Technical Support Engineer",
            "Associate Software Engineer"
        ]
    else:
        suitable_roles = [
            "Intern / Trainee",
            "Junior Developer (with additional preparation)",
            "Technical Writer"
        ]

    if score >= 80:
        overall = "Strong"
        summary = "Your profile demonstrates solid practical experience with a good balance of projects, internships, and certifications. You are well-positioned for software development roles."
    elif score >= 60:
        overall = "Good"
        summary = "Your profile shows good potential with decent technical skills and project work. Focus on filling the identified gaps to become a stronger candidate."
    elif score >= 40:
        overall = "Average"
        summary = "Your profile has foundational elements but needs more practical experience. Focus on building projects and gaining hands-on exposure."
    else:
        overall = "Needs Improvement"
        summary = "Your profile needs significant development. Focus on building projects, learning in-demand skills, and gaining practical experience."

    return {
        "overall_strength": overall,
        "summary": summary,
        "strengths": strengths,
        "improvements": improvements,
        "recommendations": recommendations if recommendations else ["Continue building your profile with more practical projects"],
        "suitable_roles": suitable_roles
    }

def predict(skills_count, projects_count, internship_count, certification_count,
            education_level, has_portfolio, has_github, has_linkedin, languages_known):
    model, feature_names = load_model()
    if model is None:
        return {"error": "Model not found. Train the model first."}

    features = np.array([[
        skills_count, projects_count, internship_count, certification_count,
        education_level, has_portfolio, has_github, has_linkedin, languages_known
    ]])

    score = model.predict(features)[0]
    score = round(max(0, min(100, score)), 1)

    features_dict = {
        "Skills_Count": skills_count,
        "Projects_Count": projects_count,
        "Internship_Count": internship_count,
        "Certification_Count": certification_count,
        "Education_Level": education_level,
        "Has_Portfolio": has_portfolio,
        "Has_GitHub": has_github,
        "Has_LinkedIn": has_linkedin,
        "Languages_Known": languages_known
    }

    report = _generate_report(score, features_dict)

    return {
        "resume_score": score,
        "overall_strength": report["overall_strength"],
        "summary": report["summary"],
        "strengths": report["strengths"],
        "improvements": report["improvements"],
        "recommendations": report["recommendations"],
        "suitable_roles": report["suitable_roles"]
    }
