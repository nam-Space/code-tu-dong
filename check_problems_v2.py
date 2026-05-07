import requests
import json

base_url = "http://localhost:3001"

# Get Problems
res = requests.get(f"{base_url}/problems")
problems = res.json()

for p in problems:
    # Get test cases
    res_tc = requests.get(f"{base_url}/problems/{p['id']}")
    problem_detail = res_tc.json()
    
    # Check if this is the "Sum to N" problem
    if "1" in p["title"] or "N" in p["title"] or "tổng" in p["title"].lower():
        print(f"Problem: {p['title']}")
        print(f"Test Cases: {json.dumps(problem_detail.get('testCases', []), indent=2)}")
