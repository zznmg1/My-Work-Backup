import sys
import os
import asyncio
import random
from typing import Optional

# Windows 콘솔 인코딩 강제 설정
sys.stdout.reconfigure(encoding='utf-8')

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai

# 환경변수 로드 (.env 파일에서 GEMINI_API_KEY 가져오기)
load_dotenv()
API_KEY = os.getenv("GEMINI_API_KEY")

# Gemini API 설정
GEMINI_AVAILABLE = False
if API_KEY:
    try:
        import google.generativeai as genai
        print(f"INFO: google-generativeai version: {genai.__version__}")
        genai.configure(api_key=API_KEY)
        # Fix: Use valid 2026 model found via diagnosis
        model = genai.GenerativeModel('gemini-2.5-flash')
        GEMINI_AVAILABLE = True
        print(f"INFO: Gemini API Key loaded. (Key length: {len(API_KEY)})")
    except Exception as e:
        print(f"ERROR: Failed to configure Gemini API: {e}")
else:
    print("WARNING: GEMINI_API_KEY not found in .env. Falling back to Mock mode.")

app = FastAPI(title="AI 꿈해몽 & 운세 API (Gemini Powered)")

# CORS 설정
origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 데이터 모델
class DreamRequest(BaseModel):
    content: str
    user_context: Optional[str] = None

# 지식 베이스 로드 함수
def load_dream_knowledge():
    try:
        with open("../dream_data.txt", "r", encoding="utf-8") as f:
            return f.read()
    except FileNotFoundError:
        return ""

@app.get("/")
def read_root():
    return {"message": "Dream Fortune AI (Gemini Engine) Running"}

@app.post("/analyze_dream")
async def analyze_dream(request: DreamRequest):
    print(f"DEBUG: Analyze Dream Request: {request.content[:50]}...")

    # 기본 Mock 데이터 (API 키 없거나 실패 시 사용)
    mock_response = {
        "interpretation": "1. [한줄 요약]: 당신의 꿈은 '새로운 기회와 예상치 못한 행운'을 암시합니다! ✨\n\n2. [심층 분석]: 이 꿈은 긍정적인 변화의 신호입니다. 길몽으로 보이며, 조만간 귀인의 도움을 받거나 기다리던 소식을 듣게 될 것입니다.\n\n3. [조언]: 긍정적인 마음으로 하루를 시작하세요.\n\n4. [금전운]: 85점 (매우 좋음)",
        "lotto_numbers": sorted(random.sample(range(1, 46), 6)),
        "luck_score": random.randint(70, 95)
    }

    if not GEMINI_AVAILABLE:
        print("Using Mock Data (No API Key)")
        return mock_response

    try:
        # 지식 베이스 읽기
        knowledge = load_dream_knowledge()
        
        # 프롬프트 구성
        prompt = f"""
        [역할]
        당신은 30년 경력의 꿈해몽 전문가이자 심리 분석가입니다.
    prompt = f"""
    Act as a mystical fortune teller. Interpret this input: "{request.user_context}" (Type: {request.content}).
    
    RETURN ONLY JSON Format:
    {{
        "luck_score": (integer 0-100),
        "lotto_numbers": [6 integers],
        "interpretation": "Structured text formatted exactly as follows:\\n\\n1. [한줄 요약]: (Impactful and rich summary, 1-2 sentences)\\n\\n2. [심층 분석]: (interpret the meaning, max 200 characters)\\n\\n3. [조언]: (Actionable advice, max 1 sentence)"
    }}
    keep the total length of 'interpretation' under 400 characters. Korean language.
    """

        # Gemini 호출 (비동기 처리를 위해 run_in_executor 사용 가능하지만, 간단히 동기 호출)
        # Note: genai.generate_content is blocking, ideally run in threadpool for production
        response = await asyncio.to_thread(model.generate_content, prompt)
        
        return {
            "interpretation": response.text,
            "lotto_numbers": sorted(random.sample(range(1, 46), 6)), # 로또는 여전히 랜덤 (재미 요소)
            "luck_score": random.randint(70, 95)
        }

    except Exception as e:
        print(f"Error calling Gemini API: {e}")
        return mock_response

@app.get("/list_models")
def list_models():
    try:
        import google.generativeai as genai
        if not API_KEY:
            return {"error": "No API Key"}
        genai.configure(api_key=API_KEY)
        models = []
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                models.append(m.name)
        return {"models": models, "lib_version": genai.__version__}
    except Exception as e:
        return {"error": str(e)}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
