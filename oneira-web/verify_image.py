import requests
import urllib.parse
import random
import os

# 1. Simulate the Logic from zero_build.html
image_prompt = "Deep space galaxy nebula, mystic"
print(f"Testing Simple Prompt: {image_prompt}")

# Truncate (The Fix)
if len(image_prompt) > 150:
    image_prompt = image_prompt[:150]
    print(f"Truncated Prompt: {image_prompt}")

# Encode
encoded_prompt = urllib.parse.quote(image_prompt)
seed = random.randint(0, 999999)

# URL Construction (Backup: Picsum)
url = f"https://picsum.photos/seed/{seed}/800/1200"

print(f"Testing URL: {url}")

# 2. Attempt Download
try:
    print("Sending Request...")
    response = requests.get(url, timeout=10)
    
    if response.status_code == 200:
        print("SUCCESS: Image Request returned 200 OK")
        print(f"Content-Type: {response.headers.get('Content-Type')}")
        print(f"Image Size: {len(response.content)} bytes")
        
        # Save to verify it's a real image
        with open("test_result.jpg", "wb") as f:
            f.write(response.content)
        print("Saved to test_result.jpg")
    else:
        print(f"FAILURE: Status Code {response.status_code}")
        print(f"Response: {response.text}")

except Exception as e:
    print(f"CRITICAL ERROR: {e}")
