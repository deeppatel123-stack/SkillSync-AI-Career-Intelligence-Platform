"""Test all Django API endpoints."""
import json
import urllib.request
import sys

BASE = 'http://127.0.0.1:8000'

tests = [
    ('GET', '/api/health/', None),
    ('GET', '/api/careers/', None),
    ('POST', '/api/learning-roadmap/', {'career': 'Full Stack Developer'}),
    ('POST', '/api/resume-analysis/', {
        'skills_count': 8, 'projects_count': 4,
        'internship_count': 2, 'certification_count': 3,
        'education_level': 3, 'has_portfolio': 1, 'has_github': 1,
        'has_linkedin': 1, 'languages_known': 2
    }),
    ('POST', '/api/career-role/', {
        'python': 1, 'java': 0, 'javascript': 1, 'react': 1,
        'node': 1, 'express': 1, 'mongodb': 1, 'sql': 0,
        'html': 1, 'css': 1, 'git': 1, 'dsa': 1,
        'communication': 1, 'problem_solving': 1,
        'projects_count': 3, 'internship_count': 1, 'certification_count': 2,
        'interested_domain': 2
    }),
    ('POST', '/api/skill-gap/', {
        'skills': ['Python', 'JavaScript', 'React', 'Git'],
        'target_role': 'Full Stack Developer'
    }),
]

all_passed = True
for method, path, body in tests:
    try:
        if method == 'GET':
            req = urllib.request.Request(f'{BASE}{path}')
        else:
            data = json.dumps(body).encode() if body else b'{}'
            req = urllib.request.Request(f'{BASE}{path}', data=data, headers={'Content-Type': 'application/json'})
        resp = urllib.request.urlopen(req, timeout=15)
        result = json.loads(resp.read())
        has_error = isinstance(result, dict) and result.get('error')
        status = 'FAIL' if has_error else 'OK'
        if has_error:
            print(f'{status} {path}: {result["error"]}')
            all_passed = False
        else:
            preview = json.dumps(result)[:100]
            print(f'{status} {path} -> {preview}')
    except Exception as e:
        print(f'FAIL {path}: {e}')
        all_passed = False

if all_passed:
    print('\nAll tests passed!')
    sys.exit(0)
else:
    print('\nSome tests failed!')
    sys.exit(1)
