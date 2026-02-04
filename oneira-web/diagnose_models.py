import google.generativeai as genai
import os
from dotenv import load_dotenv

# Load env
backend_dir = r"c:\Project\My-Work-Backup\dream-fortune-ai\backend"
env_path = os.path.join(backend_dir, ".env")
load_dotenv(env_path)

api_key = os.getenv("GEMINI_API_KEY")
genai.configure(api_key=api_key)

# List from previous check_models.py output
models_to_test = [
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
    "gemini-flash-latest",
    "gemini-1.5-flash", 
    "gemini-1.5-pro",
    "gemini-2.5-flash"
]

print("--- DIAGNOSTIC REPORT ---")
for m in models_to_test:
    print(f"\nTesting: {m}")
    try:
        model = genai.GenerativeModel(m)
        response = model.generate_content("Say 'Hello' if you work.")
        print(f"RESULT: SUCCESS - {response.text}")
    except Exception as e:
        print(f"RESULT: FAILED")
        print(f"ERROR: {str(e)[:200]}...") # Truncate error
print("\n--- END REPORT ---")
