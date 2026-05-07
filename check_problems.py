import requests

base_url = "http://localhost:3001"

# Get Problems
res = requests.get(f"{base_url}/problems")
problems = res.json()
for p in problems:
    print(f"ID: {p['id']}, Title: {p['title']}")
    # Get test cases
    res_tc = requests.get(f"{base_url}/problems/{p['id']}")
    tc_data = res_tc.json().get('testCases', [])
    print(f"  Test Cases: {tc_data}")
