"""
Django API views for AI-powered profile analysis, career recommendation,
skill gap analysis, and learning roadmap generation.
"""

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parent.parent))

from prediction.predict_profile_analysis import predict as analyze_profile
from prediction.predict_career_role import predict as predict_career
from prediction.skill_gap_analyzer import analyze as analyze_skill_gap
from ml_app.ml_models.learning_roadmap import generate_roadmap


def health(request):
    return JsonResponse({'status': 'ok', 'service': 'SkillSync AI'})


def careers(request):
    careers_list = [
        'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
        'Data Analyst', 'Data Scientist', 'AI/ML Engineer',
        'DevOps Engineer', 'QA Engineer', 'UI/UX Designer',
        'Cyber Security Analyst'
    ]
    return JsonResponse({'careers': careers_list})


@csrf_exempt
def profile_analysis(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        data = json.loads(request.body)
        result = analyze_profile(
            technical_skills=int(data.get('technical_skills', 0)),
            projects=int(data.get('projects', 0)),
            internships=int(data.get('internships', 0)),
            certifications=int(data.get('certifications', 0)),
            cgpa=float(data.get('cgpa', 0)),
            has_github=int(data.get('has_github', 0)),
            has_linkedin=int(data.get('has_linkedin', 0)),
            has_portfolio=int(data.get('has_portfolio', 0)),
            languages_known=int(data.get('languages_known', 1)),
            soft_skills=int(data.get('soft_skills', 0)),
            workshops=int(data.get('workshops', 0)),
        )
        return JsonResponse(result)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def career_role(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        data = json.loads(request.body)
        skills_list = data.get('skills', data.get('skills_list', []))
        result = predict_career(
            python=float(data.get('python', 0)),
            java=float(data.get('java', 0)),
            javascript=float(data.get('javascript', 0)),
            react=float(data.get('react', 0)),
            node=float(data.get('node', 0)),
            express=float(data.get('express', 0)),
            mongodb=float(data.get('mongodb', 0)),
            sql=float(data.get('sql', 0)),
            html=float(data.get('html', 0)),
            css=float(data.get('css', 0)),
            git=float(data.get('git', 0)),
            dsa=float(data.get('dsa', 0)),
            communication=float(data.get('communication', 0)),
            problem_solving=float(data.get('problem_solving', 0)),
            projects_count=int(data.get('projects_count', 0)),
            internship_count=int(data.get('internship_count', 0)),
            certification_count=int(data.get('certification_count', 0)),
            interested_domain=int(data.get('interested_domain', 0)),
            skills_list=skills_list,
        )
        return JsonResponse(result)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def skill_gap(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        data = json.loads(request.body)
        skills = data.get('skills', [])
        target_role = data.get('target_role', '')
        result = analyze_skill_gap(skills, target_role)
        return JsonResponse(result)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def learning_roadmap(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        data = json.loads(request.body)
        career_name = data.get('career', '')
        skills = data.get('skills', [])
        result = generate_roadmap(career_name, skills)
        return JsonResponse(result)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
