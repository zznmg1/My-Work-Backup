@echo off
chcp 65001 > nul
setlocal
cd /d "%~dp0"

echo ========================================================
echo Dream Fortune AI - Final Connection (Clean Python)
echo ========================================================
echo.

set "NEW_PY=C:\Python312\python.exe"

echo [1/3] 설치된 Python 확인:
echo %NEW_PY%

if not exist "%NEW_PY%" (
    echo [오류] C:\Python312\python.exe가 없습니다.
    echo 이전 단계(Python 설치)가 실패한 것 같습니다.
    pause
    exit /b
)

echo.
echo [2/3] 백엔드 연결 중...
cd backend
if exist .venv rmdir /s /q .venv

echo - 가상환경 생성 (Clean Path)...
"%NEW_PY%" -m venv .venv

if not exist .venv\Scripts\python.exe (
    echo [오류] 가상환경 생성 실패!
    pause
    exit /b
)

echo - 패키지 설치...
.venv\Scripts\python -m pip install --upgrade pip
.venv\Scripts\pip install -r requirements.txt

echo.
echo [3/3] 프론트엔드 연결...
cd ..\frontend
if not exist node_modules call npm install

echo.
echo ========================================================
echo 모든 준비가 끝났습니다!
echo 이제 'run_app.bat'를 실행하면 서버가 켜집니다.
echo ========================================================
pause
