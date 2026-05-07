import requests
import json

base_url = "http://localhost:3001"

# Login
res = requests.post(f"{base_url}/auth/login", json={"email": "admin@oj.com", "password": "password123"})
token = res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Get Problems
res = requests.get(f"{base_url}/problems")
problems = res.json()
sum_problem = next(p for p in problems if "Sum" in p["title"])

# Submit Solution
code = """
import sys
line = sys.stdin.read()
if line:
    a, b = map(int, line.split())
    print(a + b)
"""
res = requests.post(f"{base_url}/submissions", headers=headers, json={
    "code": code,
    "language": "python",
    "problemId": sum_problem["id"]
})
sub_id = res.json()["id"]
print(f"Submission ID: {sub_id}")

# Wait for result
import time
for _ in range(10):
    res = requests.get(f"{base_url}/submissions/{sub_id}", headers=headers)
    status = res.json()["status"]
    print(f"Status: {status}")
    if status not in ["PENDING", "RUNNING"]:
        print(json.dumps(res.json(), indent=2))
        break
    time.sleep(2)
