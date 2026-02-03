import sys
import os

print("Python 환경 테스트 시작...", flush=True)

try:
    import fastapi
    print("FastAPI 임포트 성공")
except ImportError as e:
    print(f"FastAPI 임포트 실패: {e}")

try:
    import uvicorn
    print("Uvicorn 임포트 성공")
except ImportError as e:
    print(f"Uvicorn 임포트 실패: {e}")

try:
    from notebooklm import NotebookLMClient
    print("NotebookLMClient 임포트 성공")
except ImportError as e:
    print(f"NotebookLMClient 임포트 실패 (무시 가능): {e}")

print("기본 의존성 검사 완료.", flush=True)

# 메인 앱 임포트 시도
try:
    from main import app
    print("main.py 앱 객체 임포트 성공")
except Exception as e:
    print(f"main.py 앱 객체 임포트 실패: {e}")
    sys.exit(1)

print("테스트 완료: 서버 실행 준비됨.")
