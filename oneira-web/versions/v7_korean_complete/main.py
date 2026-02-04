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
        # Fix: Use valid model from list_models()
        model = genai.GenerativeModel('gemini-2.0-flash')
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
        "interpretation": "1. 요약\n별들이 잠시 숨을 고르고 있습니다. (통신량 초과로 기본 운세를 전합니다.)\n\n2. 심층\n지금은 잠시 멈추어 서서 내면을 정비해야 할 시기입니다. 우주의 에너지가 충전될 때까지, 당신의 내면도 잠시 휴식을 취하십시오. 이 쉼표는 더 큰 도약을 위한 준비 단계입니다.\n\n3. 조언\n따뜻한 차를 마시며 마음의 여유를 가지십시오.\n\n4. [이미지 프롬프트]: Mystical Fog, dreamy atmosphere, purple and blue light, tarot style",
        "lotto_numbers": sorted(random.sample(range(1, 46), 6)),
        "luck_score": random.randint(70, 95)
    }

    if not GEMINI_AVAILABLE:
        with open("debug_log.txt", "a") as log:
            log.write("ERROR: GEMINI_AVAILABLE is False. API Key missing or invalid.\n")
        return mock_response

    # 지식 베이스 읽기
    knowledge = load_dream_knowledge()
    
    # 프롬프트 구성 (Updated for Length and Tone)
    prompt = f"""
    [역할]
    당신은 삶의 본질을 꿰뚫어보는 신비로운 예언가입니다. 
    사용자 정보와 입력된 내용("{request.content}": "{request.user_context}")을 종합적으로 분석하여, 
    정중하고 격식 있는 '하십시오체(습니다)'로 답하세요.
    
    **개인화 지침**:
    - 사용자의 이름, 생년월일, 성별이 제공되면 이를 운세 해석에 적극 반영하세요. (예: "00님, 00년생의 기운으로는...", "여성/남성/비공개 분의 섬세한/강인한 에너지로...")
    - 이름이 있다면 반드시 이름을 한 번 이상 불러주세요.

    [출력 형식]
    반드시 아래 4가지 항목으로만 답변하세요. 각 항목 사이에는 빈 줄을 두어 가독성을 높이세요.
    **경고: 각 항목의 제목(예: 1. 요약) 또는 본문에 아스테리스크(**)나 마크다운 볼드를 절대 사용하지 마세요.**

    1. 요약
    (삶의 방향을 제시하는 정중하고 깊이 있는 한 문장.)

    2. 심층
    (현재 상황에 대한 깊이 있는 통찰. 내면의 흐름을 읽어내어 설명하되, 반드시 '~입니다', '~합니다'와 같은 경어체를 사용하세요.
    **중요: 무조건 긍정적인 말만 하지 말고, 현실적이고 날카로운 비판이나 우려점도 포함하여 신빙성을 높이세요.**
    **필수 조건: 내용은 공백 포함 500자 이상, 3개 이상의 문단으로 나누어 아주 상세하게 작성해야 합니다. 절대 짧게 쓰지 마세요.**)

    3. 조언
    (실천 가능한 따뜻한 조언 한 마디. '~하십시오' 또는 '~하는 것이 좋습니다' 형태로 작성.)

    4. [이미지 프롬프트]: (타로 카드 스타일의 영어 묘사. 20단어 이내로 간결하게 작성. 예: 'A glowing lighthouse in a storm, tarot style, mystical colors')
    """
        
    # Try multiple models in sequence to find one with available quota
    candidate_models = [
        "gemini-2.0-flash", 
        "gemini-2.0-flash-lite",
        "gemini-flash-latest",
        "gemini-2.5-flash",
        "gemini-2.5-pro",
        "gemini-1.5-flash-8b"
    ]
    
    last_exception = None
    
    for model_name in candidate_models:
        try:
            print(f"DEBUG: Attempting generation with {model_name}...")
            # Configure model specifically for this attempt to ensure no lingering state
            model = genai.GenerativeModel(model_name)
            
            # Gemini 호출
            response = await asyncio.to_thread(model.generate_content, prompt)
            
            return {
                "interpretation": response.text,
                "lotto_numbers": sorted(random.sample(range(1, 46), 6)), 
                "luck_score": random.randint(70, 95)
            }
        except Exception as e:
            last_exception = e
            error_msg = str(e)
            print(f"WARNING: Failed with {model_name}: {error_msg}")
            # Continue to next model if this one failed
            continue

    # If all models failed
    with open("debug_log.txt", "a") as log:
        log.write(f"ERROR: All models failed. Last error: {str(last_exception)}\n")
    
    if "429" in str(last_exception) or "quota" in str(last_exception).lower():
         return mock_response
         
    return {
        "interpretation": f"1. 오류\n모든 AI 모델 연결에 실패했습니다.\n\n2. 내용\n{str(last_exception)}\n\n4. [이미지 프롬프트]: Mystical Fog, dreamy atmosphere, purple and blue light, tarot style",
        "lotto_numbers": [],
        "luck_score": 0
    }

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
