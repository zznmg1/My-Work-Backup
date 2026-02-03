import sys
import os

print(f"Python Executable: {sys.executable}")
print("Loading modules...")

try:
    from dotenv import load_dotenv
    import google.generativeai as genai
    print("Modules loaded.")
except ImportError as e:
    print(f"Import Error: {e}")
    print("Please run: pip install google-generativeai python-dotenv")
    sys.exit(1)

load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    print("❌ ERROR: GEMINI_API_KEY not found in .env")
    # Try looking in parent directory just in case
    print("Checking parent directory for .env...")
    load_dotenv("../.env")
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("❌ Still not found.")
        sys.exit(1)

print(f"✅ API Key found (Length: {len(api_key)})")

genai.configure(api_key=api_key)

print("\n--- Available Models ---")
try:
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f" - {m.name}")
except Exception as e:
    print(f"❌ Error listing models: {e}")
    try:
        # Fallback: Just try to use the model we want
        print("Listing failed, attempting direct generation with 'gemini-1.5-flash'...")
        model = genai.GenerativeModel('gemini-1.5-flash')
        res = model.generate_content("Hello")
        print("✅ Direct generation SUCCESS!")
    except Exception as e2:
        print(f"❌ Direct generation failed: {e2}")

print("\n--- Test Finished ---")
