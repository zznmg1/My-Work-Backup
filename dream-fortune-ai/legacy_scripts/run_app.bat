@echo off
chcp 65001 > nul
setlocal
cd /d "%~dp0"

echo ========================================================
echo Dream Fortune AI - 통합 실행기
echo ========================================================
echo.

:: 1. 백엔드 환경 확인
if not exist "backend\.venv\Scripts\python.exe" (
    echo [오류] 백엔드 설정이 보이지 않습니다.
    echo 먼저 'auto_setup.bat'를 실행해서 설치를 완료해주세요!
    pause
    exit /b
)

:: 2. 백엔드 실행
echo [1/2] 백엔드 서버 시작 (Backend)...
cd backend
start "DreamFortune Backend" cmd /c ".venv\Scripts\python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000"
cd ..

:: 3. 프론트엔드 실행
echo [2/2] 프론트엔드 서버 시작 (Frontend)...
cd frontend
start "DreamFortune Frontend" cmd /c "npm run dev"
cd ..

:: 4. 브라우저 열기
echo.
echo 5초 뒤에 웹사이트가 열립니다...
timeout /t 5 > nul
start http://localhost:5173

echo.
echo 서버가 실행되었습니다!
echo 종료하려면 열린 두 개의 검은색 창을 각각 닫아주세요.
echo ========================================================
pause
