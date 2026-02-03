@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo Dream Fortune AI - Environment Repair & Start
echo ========================================================
echo.

echo [1/4] Cleaning processes...
taskkill /F /IM python.exe > nul 2>&1
taskkill /F /IM node.exe > nul 2>&1

echo.
echo [2/4] Resetting Brain (Reinstalling Python Environment)...
cd backend

:: 무조건 기존 가상환경 삭제 (깨진 상태 복구)
if exist .venv (
    echo [Info] 깨진 가상환경 제거 중...
    rmdir /s /q .venv
)

echo [Info] 새 가상환경 생성 중...
python -m venv .venv
if errorlevel 1 (
    echo [Error] Python 가상환경 생성 실패. Python이 제대로 설치되었는지 확인 필요.
    pause
    exit /b
)

:: pip 존재 확인 및 복구
if not exist .venv\Scripts\pip.exe (
    echo [Warning] pip가 없습니다. 강제 설치를 시도합니다...
    .venv\Scripts\python -m ensurepip --default-pip
)

echo [Info] 필수 라이브러리 설치 중 (fastapi, uvicorn 등)...
.venv\Scripts\python -m pip install --upgrade pip
.venv\Scripts\pip install -r requirements.txt
if errorlevel 1 (
    echo [Error] 라이브러리 설치 실패. 인터넷 연결을 확인하세요.
    pause
    exit /b
)

echo.
echo [3/4] Starting Backend (Port 8000)...
start /B .venv\Scripts\python -u main.py > backend.log 2>&1

echo.
echo [4/4] Starting Frontend (Port 5173)...
cd ../frontend
if not exist node_modules call npm install
start /B cmd /c "npm run dev > frontend.log 2>&1"
cd ..

echo.
echo ========================================================
echo [수리 완료] 이제 정상 작동합니다.
echo 잠시 후 브라우저가 열립니다...
echo ========================================================
timeout /t 5 > nul
start http://localhost:5173

pause
