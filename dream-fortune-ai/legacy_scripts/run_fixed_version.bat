@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo Dream Fortune AI - 최종 수정본 실행 (Final Run)
echo ========================================================
echo.

echo [1/2] 기존 프로세스 정리...
taskkill /F /IM python.exe > nul 2>&1
taskkill /F /IM node.exe > nul 2>&1

echo.
echo [2/2] 서버 재시작...
echo 새 창이 2개 열립니다. 닫지 마세요!
echo.

start "DreamFortune Backend" cmd /k "cd backend && .venv\Scripts\python main.py"
start "DreamFortune Frontend" cmd /k "cd frontend && npm run dev"

echo.
echo 서버가 실행되었습니다.
echo 브라우저에서 http://localhost:5173 으로 접속하세요.
echo ========================================================
pause
