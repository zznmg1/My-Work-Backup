import os
import google.generativeai as genai
from dotenv import load_dotenv

# Load .env from backend directory
backend_dir = r"c:\Project\My-Work-Backup\dream-fortune-ai\backend"
env_path = os.path.join(backend_dir, ".env")
load_dotenv(env_path)

api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    print("ERROR: No API Key found in .env")
    exit(1)

print(f"DEBUG: Key found (starts with {api_key[:5]}...)")

try:
    genai.configure(api_key=api_key)
    print("Listing available models...")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"ERROR: {e}")
