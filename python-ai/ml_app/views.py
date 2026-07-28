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
    return JsonResponse({'careers': [
        'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
        'Data Analyst', 'Data Scientist', 'AI/ML Engineer',
        'DevOps Engineer', 'QA Engineer', 'UI/UX Designer',
        'Cyber Security Analyst'
    ]})


@csrf_exempt
def profile_analysis(request):
    if request.method != 'POST': return JsonResponse({'error': 'POST required'}, status=405)
    try:
        d = json.loads(request.body)
        r = analyze_profile(technical_skills=int(d.get('technical_skills', 0)),
            projects=int(d.get('projects', 0)), internships=int(d.get('internships', 0)),
            certifications=int(d.get('certifications', 0)), cgpa=float(d.get('cgpa', 0)),
            has_github=int(d.get('has_github', 0)), has_linkedin=int(d.get('has_linkedin', 0)),
            has_portfolio=int(d.get('has_portfolio', 0)), languages_known=int(d.get('languages_known', 1)),
            soft_skills=int(d.get('soft_skills', 0)), workshops=int(d.get('workshops', 0)))
        return JsonResponse(r)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def career_role(request):
    if request.method != 'POST': return JsonResponse({'error': 'POST required'}, status=405)
    try:
        d = json.loads(request.body)
        r = predict_career(python=float(d.get('python', 0)), java=float(d.get('java', 0)),
            javascript=float(d.get('javascript', 0)), react=float(d.get('react', 0)),
            node=float(d.get('node', 0)), express=float(d.get('express', 0)),
            mongodb=float(d.get('mongodb', 0)), sql=float(d.get('sql', 0)),
            html=float(d.get('html', 0)), css=float(d.get('css', 0)),
            git=float(d.get('git', 0)), dsa=float(d.get('dsa', 0)),
            communication=float(d.get('communication', 0)), problem_solving=float(d.get('problem_solving', 0)),
            projects_count=int(d.get('projects_count', 0)), internship_count=int(d.get('internship_count', 0)),
            certification_count=int(d.get('certification_count', 0)), interested_domain=int(d.get('interested_domain', 0)),
            skills_list=d.get('skills', d.get('skills_list', [])))
        return JsonResponse(r)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def skill_gap(request):
    if request.method != 'POST': return JsonResponse({'error': 'POST required'}, status=405)
    try:
        d = json.loads(request.body)
        return JsonResponse(analyze_skill_gap(d.get('skills', []), d.get('target_role', '')))
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)


@csrf_exempt
def learning_roadmap(request):
    if request.method != 'POST': return JsonResponse({'error': 'POST required'}, status=405)
    try:
        d = json.loads(request.body)
        return JsonResponse(generate_roadmap(d.get('career', ''), d.get('skills', [])))
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=400)
