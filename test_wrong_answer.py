import requests
import json
import time

base_url = "http://localhost:3001"

# Login
res = requests.post(f"{base_url}/auth/login", json={"email": "admin@oj.com", "password": "password123"})
token = res.json()["access_token"]
headers = {"Authorization": f"Bearer {token}"}

# Get Problem "Tính tổng từ 1 đến N"
res = requests.get(f"{base_url}/problems")
problems = res.json()
problem = next(p for p in problems if "tổng" in p["title"].lower())

# Submit C++ Solution
cpp_code = """
#include <bits/stdc++.h>
using namespace std;

int main() {
    int n;
    cin >> n;
    cout << 1ll * n * (n + 1) / 2 << endl;
    return 0;
}
"""
res = requests.post(f"{base_url}/submissions", headers=headers, json={
    "code": cpp_code,
    "language": "cpp",
    "problemId": problem["id"]
})
sub_id = res.json()["id"]
print(f"Submission ID: {sub_id}")

for _ in range(15):
    res = requests.get(f"{base_url}/submissions/{sub_id}", headers=headers)
    data = res.json()
    status = data["status"]
    print(f"Status: {status}")
    if status not in ["PENDING", "RUNNING"]:
        print(json.dumps(data, indent=2))
        break
    time.sleep(2)
