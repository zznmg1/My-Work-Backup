import requests
import json
import sys

# Force UTF-8 for Windows Console
sys.stdout.reconfigure(encoding='utf-8')

url = "http://127.0.0.1:8000/analyze_dream"
headers = {"Content-Type": "application/json"}
data = {
    "content": "I was flying over a golden city.",
    "user_context": "Name: Tester, Birth: 2000-01-01, Gender: Male"
}

print(f"Testing connection to {url}...")
try:
    response = requests.post(url, headers=headers, json=data, timeout=30)
    print(f"Status Code: {response.status_code}")
    print("Response JSON:")
    print(json.dumps(response.json(), indent=2, ensure_ascii=False))
except Exception as e:
    print(f"FAILED: {e}")
