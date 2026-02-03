import uvicorn
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sys
import os
import random
import google.generativeai as genai

# --- CONFIGURATION ---
# Try to get API Key from environment or hardcode for demo if provided
API_KEY = os.getenv("GEMINI_API_KEY") 
# NOTE: If API_KEY is None, we will fail gracefully to Mock Mode.

app = FastAPI()

# --- CORS (CRITICAL FOR BROWSER) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- MODELS ---
class DreamRequest(BaseModel):
    content: str
    user_context: str = ""

# --- LOGIC ---
@app.get("/")
def read_root():
    return {"status": "Oneira AI Online", "model": "Gemini Pro"}

@app.post("/analyze_dream")
async def analyze_dream(request: DreamRequest):
    print(f"🔮 Received request: {request.content[:50]}...")
    
    # 1. Fallback Mock Data (Safety Net)
    mock_response = {
        "interpretation": f"1. [한줄 요약]: 당신의 '{request.content[:10]}...'에 대한 꿈은 곧 다가올 변화를 암시합니다.\n\n2. [심층 분석]: AI 서버가 방금 연결되었습니다! 아직 'GEMINI_API_KEY'가 설정되지 않아 데모 모드로 응답합니다. 당신의 무의식은 이미 답을 알고 있습니다.\n\n3. [조언]: 환경 변수에 API 키를 설정하면 실제 AI가 예언을 시작합니다.",
        "luck_score": random.randint(70, 99),
        "lotto_numbers": sorted(random.sample(range(1, 46), 6)),
        "mode": "DEMO"
    }

    # 2. Try Real AI if Key exists
    if API_KEY:
        try:
            genai.configure(api_key=API_KEY)
            model = genai.GenerativeModel('gemini-pro')
            
            prompt = f"""
            Act as a mystical fortune teller named 'Oneira'.
            Analyze this input ({request.content}) which is a {request.user_context}.
            
            Format strictly as:
            1. [한줄 요약]: (One poetic sentence summary)
            2. [심층 분석]: (Deep psychological or mystical interpretation, 2-3 sentences)
            3. [조언]: (Actionable advice)
            4. [금전운]: (Short financial outlook)
            
            Keep the tone mysterious, elegant, and positive. Korean language only.
            """
            
            response = model.generate_content(prompt)
            text = response.text
            
            return {
                "interpretation": text,
                "luck_score": random.randint(60, 100), # AI doesn't give scores yet, mocking it
                "lotto_numbers": sorted(random.sample(range(1, 46), 6)),
                "mode": "REAL"
            }
        except Exception as e:
            print(f"❌ GenAI Error: {e}")
            mock_response["interpretation"] += f"\n\n(AI Error: {str(e)})"
            return mock_response
    
    else:
        print("⚠️ No API Key found. Returning Mock.")
        return mock_response

if __name__ == "__main__":
    print("🚀 Oneira AI Server Starting on Port 8000...")
    # Clean previous processes if needed? No, purely starting fresh.
    uvicorn.run(app, host="0.0.0.0", port=8000)
