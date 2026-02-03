import requests
import json
import time

print("Checking Backend Status...")

try:
    response = requests.get("http://127.0.0.1:8000/docs", timeout=5)
    print(f"Docs Endpoint: {response.status_code}")
except Exception as e:
    print(f"Docs Endpoint Failed: {e}")

try:
    print("Sending Dummy Dream Analysis Request...")
    payload = {"content": "DREAM", "user_context": "I was flying over a rainbow"}
    response = requests.post("http://127.0.0.1:8000/analyze_dream", json=payload, timeout=30)
    if response.status_code == 200:
        print("Analysis Success!")
        print(json.dumps(response.json(), indent=2, ensure_ascii=False))
    else:
        print(f"Analysis Failed: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"Analysis Exception: {e}")
