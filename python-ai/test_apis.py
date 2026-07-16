"""Test all Django API endpoints."""
import json
import urllib.request
import sys

BASE = 'http://127.0.0.1:8000'

tests = [
    ('GET', '/api/health/', None),
    ('GET', '/api/careers/', None),
    ('POST', '/api/learning-roadmap/', {'career': 'Full Stack Developer'}),
    ('GET', '/api/placement-statistics/', None),
]

all_passed = True
for method, path, body in tests:
    try:
        if method == 'GET':
            req = urllib.request.Request(f'{BASE}{path}')
        else:
            data = json.dumps(body).encode() if body else b'{}'
            req = urllib.request.Request(f'{BASE}{path}', data=data, headers={'Content-Type': 'application/json'})
        resp = urllib.request.urlopen(req, timeout=10)
        result = json.loads(resp.read())
        has_error = isinstance(result, dict) and result.get('error')
        status = 'FAIL' if has_error else 'OK'
        if has_error:
            print(f'{status} {path}: {result["error"]}')
            all_passed = False
        else:
            print(f'{status} {path}')
    except Exception as e:
        print(f'FAIL {path}: {e}')
        all_passed = False

if all_passed:
    print('\nAll tests passed!')
    sys.exit(0)
else:
    print('\nSome tests failed!')
    sys.exit(1)
