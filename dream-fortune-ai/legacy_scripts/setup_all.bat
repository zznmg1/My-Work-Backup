@echo off
setlocal
echo ==========================================
echo Dream Fortune AI - 전체 환경 설정 복구 도구
echo ==========================================
echo.

echo [1/2] 백엔드 설정 (Backend Setup)
cd backend
if exist .venv (
    echo 기존 가상환경 제거 중...
    rmdir /s /q .venv
)

echo 가상환경 생성 중...
py -m venv .venv
if not exist .venv (
    echo 'py' 명령어 실패, 'python'으로 재시도...
    python -m venv .venv
)

if not exist .venv (
    echo [오류] Python 가상환경 생성 실패! Python이 설치되어 있는지 확인해주세요.
    pause
    exit /b
)

echo 필수 패키지 설치 중...
.venv\Scripts\python -m pip install --upgrade pip
.venv\Scripts\pip install -r requirements.txt
if %errorlevel% neq 0 (
    echo [오류] 패키지 설치 실패!
    pause
    exit /b
)
echo 백엔드 설정 완료.
echo.

echo [2/2] 프론트엔드 설정 (Frontend Setup)
cd ..\frontend
if not exist node_modules (
    echo Node.js 패키지 설치 중...
    call npm install
) else (
    echo 이미 node_modules가 존재합니다. 건너뜁니다.
)
echo 프론트엔드 설정 완료.

echo.
echo ==========================================
echo 모든 설정이 완료되었습니다!
echo 이제 'run_app.bat'를 실행하여 서버를 시작할 수 있습니다.
echo ==========================================
pause
