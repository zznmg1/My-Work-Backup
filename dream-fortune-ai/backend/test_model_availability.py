import os
import google.generativeai as genai
from dotenv import load_dotenv

# 환경변수 로드
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("ERROR: API Key not found in .env")
    exit(1)

print(f"Using API Key: {api_key[:5]}... (Length: {len(api_key)})")
genai.configure(api_key=api_key)

print(f"Library version: {genai.__version__}")

print("\n--- Checking Available Models ---")
found_flash = False
found_pro = False

try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"Found: {m.name}")
            if 'gemini-1.5-flash' in m.name:
                found_flash = True
            if 'gemini-pro' in m.name:
                found_pro = True
except Exception as e:
    print(f"Error listing models: {e}")

print("\n--- Testing Generation ---")

candidates = ['gemini-1.5-flash', 'gemini-pro', 'gemini-1.0-pro']

for model_name in candidates:
    print(f"\nTesting model: {model_name}...")
    try:
        model = genai.GenerativeModel(model_name)
        response = model.generate_content("Test")
        print(f"✅ SUCCESS: {model_name} works!")
    except Exception as e:
        print(f"❌ FAIL: {model_name} failed. Error: {e}")
