import os
import asyncio
import google.generativeai as genai
from dotenv import load_dotenv

async def test_gen():
    load_dotenv(dotenv_path="../dream-fortune-ai/backend/.env")
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        print("No API Key")
        return

    genai.configure(api_key=api_key)
    # Using 2.0-flash as decided
    model = genai.GenerativeModel('gemini-2.0-flash')
    
    print("Attempting generation with gemini-2.0-flash...")
    try:
        response = await model.generate_content_async("Tell me a short fortune cookie saying.")
        print(f"Success! Response: {response.text}")
    except Exception as e:
        print(f"Failed: {e}")

if __name__ == "__main__":
    asyncio.run(test_gen())
