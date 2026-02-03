@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo Dream Fortune AI - 긴급 복구 및 재시작
echo ========================================================
echo.

echo [1/3] 기존 프로세스 정리 중...
taskkill /F /IM python.exe > nul 2>&1
taskkill /F /IM node.exe > nul 2>&1

echo.
echo [2/3] 백엔드 서버 시작 (Port: 8000)
echo logs will appear in the new window...
cd backend
if not exist .venv (
    echo [오류] 가상환경(.venv)이 없습니다. setup_final.bat를 먼저 실행하세요.
    pause
    exit /b
)
start "DreamFortune Backend" cmd /k ".venv\Scripts\python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
cd ..

echo.
echo [3/3] 프론트엔드 서버 시작 (Port: 5173)
cd frontend
if not exist node_modules (
    echo [알림] node_modules가 없어 설치를 진행합니다...
    call npm install
)
start "DreamFortune Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================================
echo 복구가 완료되었습니다!
echo 1. 새로 열린 두 개의 검은 창을 닫지 마세요.
echo 2. 브라우저에서 localhost:5173 페이지를 새로고침하세요.
echo ========================================================
start http://localhost:5173
pause
