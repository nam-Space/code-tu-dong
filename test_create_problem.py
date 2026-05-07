import requests

base_url = "http://localhost:3001"

# Login
res = requests.post(f"{base_url}/auth/login", json={"email": "admin@oj.com", "password": "password123"})
token = res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Create Problem
problem_data = {
    "title": "Test Problem",
    "description": "Test Description",
    "difficulty": "Easy",
    "timeLimit": 1000,
    "memoryLimit": 256,
    "contestId": "",
    "testCases": [
        {"input": "1", "expectedOutput": "1", "isSample": True}
    ]
}

res = requests.post(f"{base_url}/problems", headers=headers, json=problem_data)
print(res.status_code)
print(res.json())
