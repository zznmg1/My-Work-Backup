import asyncio
import os
import random
import json
import requests
from typing import Optional # Restored
from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles # Added for image serving
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import google.generativeai as genai
import shutil
import uuid

# Ensure assets directory exists
os.makedirs("assets/images", exist_ok=True)

class CacheRequest(BaseModel):
    url: str
    id: str

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

# Mount the assets folder
app.mount("/assets", StaticFiles(directory="assets"), name="assets")

@app.post("/cache_image")
async def cache_image(request: CacheRequest):
    try:
        # Generate filename
        filename = f"{request.id}.jpg"
        filepath = f"assets/images/{filename}"
        
        # Download image
        response = requests.get(request.url, stream=True, timeout=10)
        if response.status_code == 200:
            with open(filepath, 'wb') as f:
                shutil.copyfileobj(response.raw, f)
            
            # Return local URL
            return {"local_url": f"http://127.0.0.1:8000/assets/images/{filename}", "success": True}
        else:
             return {"success": False, "error": "Download failed"}
    except Exception as e:
        print(f"Cache failed: {e}")
        return {"success": False, "error": str(e)}

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
    
    # 모드 감지 (user_context에서 [모드: XXX] 파싱)
    mode = "해몽"  # 기본값
    if "[모드: 운세]" in request.user_context:
        mode = "운세"
    elif "[모드: 심리상담]" in request.user_context:
        mode = "심리상담"
    
    # 모드별 역할 설명
    role_descriptions = {
        "해몽": "당신은 꿈의 상징을 해석하는 신비로운 예언가입니다. 사용자가 꾼 꿈의 의미를 분석하세요.",
        "운세": "당신은 삶의 흐름을 읽는 운세 전문가입니다. 사용자의 고민에 대해 운세를 봐주세요. 꿈 해석이 아닙니다.",
        "심리상담": "당신은 마음을 치유하는 심리 상담사입니다. 사용자의 감정과 내면을 공감하며 상담하세요. 꿈 해석이 아닙니다."
    }
    
    # 모드별 심층 분석 지침
    analysis_instructions = {
        "해몽": "꿈에 나온 상징들의 의미와 무의식이 전하는 메시지를 해석하세요.",
        "운세": "사용자의 현재 상황과 앞으로의 흐름을 읽어 운세를 전해주세요. '꿈'이라는 단어를 절대 사용하지 마세요.",
        "심리상담": "사용자의 감정 상태를 공감하고, 마음의 원인을 분석하여 위로와 조언을 전하세요. '꿈'이라는 단어를 절대 사용하지 마세요."
    }
    
    # 프롬프트 구성 (모드별로 다르게)
    prompt = f"""
    [역할]
    {role_descriptions[mode]}
    절대 자기소개를 하지 마십시오.
    사용자 정보와 입력된 내용("{request.content}": "{request.user_context}")을 종합적으로 분석하여, 
    정중하고 격식 있는 '하십시오체(습니다)'로 답하세요.
    
    [강력한 언어 통제]
    1. **절대 한자(漢字)를 섞어 쓰지 마세요.** (예: 運勢(x) -> 운세(o))
    2. **본문(1~3번)에는 영어를 절대 쓰지 마세요.** 오직 4번 항목에서만 영어를 사용해야 합니다.
    3. 순도 100%의 자연스럽고 아름다운 한국어로만 작성하십시오.

    [금지 문구 - 절대 사용 금지]
    다음과 같은 저급한 마케팅 문구나 자기 홍보는 절대 사용하지 마세요:
    - "XX년 경력", "30년 경력", "전문가", "베테랑", "대가", "마스터"
    - "저는 꿈해몽 전문가로서...", "제 오랜 경험에 따르면..."
    - 자신을 소개하거나 권위를 내세우는 모든 표현
    - "~해드리겠습니다", "~을 봐드리겠습니다" 같은 영업 톤
    당신의 역할은 신비로운 예언이지, 자기 홍보가 아닙니다. 바로 해석 내용만 전달하세요.

    **개인화 지침**:
    - 사용자의 이름, 생년월일, 성별이 제공되면 이를 {mode} 분석에 적극 반영하세요. 
    - (예: "00님, 00년생의 기운으로는...", "여성/남성/비공개 분의 섬세한/강인한 에너지로...")
    - 이름이 있다면 반드시 이름을 한 번 이상 불러주세요.

    [출력 형식]
    반드시 아래 4가지 항목으로만 답변하세요. 각 항목 사이에는 빈 줄을 두어 가독성을 높이세요.
    **경고: 각 항목의 제목(예: 1. 요약) 또는 본문에 아스테리스크(**)나 마크다운 볼드를 절대 사용하지 마세요.**

    1. 요약
    (삶의 방향을 제시하는 정중하고 깊이 있는 한 문장. **한글 전용**)

    2. 심층
    ({analysis_instructions[mode]}
    반드시 '~입니다', '~합니다'와 같은 경어체를 사용하세요.
    **한자나 영어를 섞어 쓰지 마세요.**
    **중요: 무조건 긍정적인 말만 하지 말고, 현실적이고 날카로운 비판이나 우려점도 포함하여 신빙성을 높이세요.**
    **필수 조건: 내용은 공백 포함 400자 이상, 3개 이상의 문단으로 나누어 아주 상세하게 작성해야 합니다.**)

    3. 조언
    (실천 가능한 따뜻한 조언 한 마디. '~하십시오' 또는 '~하는 것이 좋습니다' 형태로 작성. **한글 전용**)

    4. [이미지 프롬프트]: (위의 사용자가 입력한 내용의 핵심 장면을 **'노션 스타일(Notion Style)'의 라인 아트**로 묘사하는 **상세하고 구체적인 영어 문장**으로 작성하세요.
    **중요: 추상적인 단어 대신, 실제로 그림으로 그릴 수 있는 '사물'과 '행동'을 명확히 묘사해야 합니다.**
    (예: 'A person standing on a cliff looking at the moon, comic style line art, simple, black and white, minimalist')
    """
        
    # Groq API Implementation
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        print("ERROR: GROQ_API_KEY not found in .env")
        return {
            "interpretation": "1. 오류\nAPI 키가 설정되지 않았습니다.\n\n2. 내용\n.env 파일에 GROQ_API_KEY가 있는지 확인해주세요.\n\n4. [이미지 프롬프트]: Broken connection",
            "luck_score": 0, "lotto_numbers": []
        }

    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {api_key}"
    }
    
    # Use Llama 3 70B (High quality, free on Groq)
    # Use Llama 3 70B (High quality, free on Groq)
    payload = {
        "messages": [
            {
                "role": "system", 
                "content": "You are a mystical fortune teller AI. Output ONLY valid JSON structure. Response MUST be in Korean. DO NOT use Chinese characters (Hanja) or Japanese. Pure Korean only. CRITICAL: Never introduce yourself or mention your experience/expertise. No phrases like '30년 경력', '전문가', '베테랑'. Just deliver the interpretation directly."
            },
            {
                "role": "user", 
                "content": prompt
            }
        ],
        "model": "llama-3.3-70b-versatile",
        "stream": False,
        "temperature": 0.7
    }

    print(f"DEBUG: Sending request to Groq (Llama 3)...")
    
    try:
        response = await asyncio.to_thread(requests.post, url, headers=headers, json=payload, timeout=30)
        
        if response.status_code != 200:
            print(f"ERROR: Groq returned {response.status_code}: {response.text}")
            raise Exception(f"Groq API Error: {response.text}")

        result = response.json()
        raw_text = result['choices'][0]['message']['content']
        print(f"DEBUG: Grok response received (Length: {len(raw_text)})")
        
        # 1. Clean Markdown
        cleaned_text = raw_text.strip()
        
        # 2. Strong Regex Sanitization
        import re
        
        # Split text into lines to process them individually
        lines = cleaned_text.split('\n')
        processed_lines = []
        is_image_prompt_section = False
        
        for line in lines:
            # Check if we are entering the Image Prompt section (4.)
            if "4." in line and "이미지" in line:
                is_image_prompt_section = True
            
            if is_image_prompt_section:
                # Keep English in Image Prompt section
                processed_lines.append(line)
            else:
                # For non-image sections: Remove English characters, Hanja, and Japanese
                # Remove English (A-Z, a-z)
                line_no_english = re.sub(r'[a-zA-Z]', '', line) 
                # Remove Hanja (Chinese)
                line_no_hanja = re.sub(r'[\u4e00-\u9fff]', '', line_no_english)
                # Remove Japanese
                line_final = re.sub(r'[\u3040-\u309f\u30a0-\u30ff]', '', line_no_hanja)
                processed_lines.append(line_final)
        
        cleaned_text = '\n'.join(processed_lines)
        
        # Just return the text.
        return {
            "interpretation": cleaned_text,
            "luck_score": random.randint(60, 100), 
            "lotto_numbers": sorted(random.sample(range(1, 46), 6))
        }

    except Exception as e:
        print(f"ERROR: Groq Request Failed: {e}")
        last_exception = e
        # Fall through to error handler

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
