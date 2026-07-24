"""
Simple Django Views for ML Predictions
No DRF, no serializers, no APIView - just plain Django
"""

import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pathlib import Path
import sys

sys.path.append(str(Path(__file__).resolve().parent.parent))

from prediction.predict_resume_analysis import predict as predict_resume
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
def resume_analysis(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'POST required'}, status=405)
    try:
        data = json.loads(request.body)
        result = predict_resume(
            skills_count=int(data.get('skills_count', 0)),
            projects_count=int(data.get('projects_count', 0)),
            internship_count=int(data.get('internship_count', 0)),
            certification_count=int(data.get('certification_count', 0)),
            education_level=int(data.get('education_level', 0)),
            has_portfolio=int(data.get('has_portfolio', 0)),
            has_github=int(data.get('has_github', 0)),
            has_linkedin=int(data.get('has_linkedin', 0)),
            languages_known=int(data.get('languages_known', 1)),
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
