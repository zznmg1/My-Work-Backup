@echo off
setlocal
echo ==========================================
echo Dream Fortune AI - 강제 복구 모드
echo ==========================================
echo.

cd backend

:: 1. 기존 .venv 완전 제거
if exist .venv (
    echo [1/4] 손상된 가상환경 제거 중... (\backend\.venv)
    rmdir /s /q .venv
    if exist .venv (
        echo [오류] .venv 폴더를 삭제할 수 없습니다. 
        echo 열려있는 모든 검은색 창(cmd, 터미널)을 닫고 다시 실행해주세요.
        pause
        exit /b
    )
)

:: 2. 가상환경 생성 (py 대신 python 사용)
echo [2/4] 가상환경 새로 생성 중... (python 명령어 사용)
python -m venv .venv

if not exist .venv\Scripts\python.exe (
    echo [오류] 가상환경 생성 실패! 'python' 명령어가 없거나 작동하지 않습니다.
    echo C:\Users\ㅋㅋ\AppData\Local\Programs\Python\Python312\python.exe 경로로 재시도합니다...
    "C:\Users\ㅋㅋ\AppData\Local\Programs\Python\Python312\python.exe" -m venv .venv
)

if not exist .venv\Scripts\pip.exe (
    echo [오류] pip가 설치되지 않았습니다. 인터넷 연결을 확인하거나 Python 재설치가 필요할 수 있습니다.
    pause
    exit /b
)

:: 3. 패키지 설치
echo [3/4] 패키지 설치 중...
.venv\Scripts\python -m pip install --upgrade pip
.venv\Scripts\pip install -r requirements.txt

echo.
echo [4/4] 프론트엔드 설정 확인...
cd ..\frontend
if not exist node_modules (
    echo npm install 실행...
    call npm install
)

echo.
echo ==========================================
echo *** 복구 완료! ***
echo 이제 run_app.bat를 실행해보세요.
echo ==========================================
pause
