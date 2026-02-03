@echo off
chcp 65001 > nul
setlocal
cd /d "%~dp0"

echo ========================================================
echo Dream Fortune AI - Manual Direct Setup
echo ========================================================
echo.

:: 1. 범인인 'py'나 'python' 단축명령어를 쓰지 않고 주소를 직접 찍습니다.
set "TARGET_PY=%USERPROFILE%\AppData\Local\Programs\Python\Python312\python.exe"

echo [1/3] Python 위치 확인:
echo %TARGET_PY%

if not exist "%TARGET_PY%" (
    echo [오류] Python 파일이 해당 위치에 없습니다.
    pause
    exit /b
)

echo.
echo [2/3] 백엔드 설치 (Direct Mode)...
cd backend
if exist .venv rmdir /s /q .venv

echo - 가상환경 생성 중 (절대경로 사용)...
"%TARGET_PY%" -m venv .venv

if not exist .venv\Scripts\python.exe (
    echo [치명적 오류] 절대 경로로도 가상환경 생성이 안됩니다. 보안 프로그램 등을 확인해주세요.
    pause
    exit /b
)

echo - 패키지 설치 중...
.venv\Scripts\python -m pip install --upgrade pip
.venv\Scripts\pip install -r requirements.txt

echo.
echo [3/3] 프론트엔드 설치...
cd ..\frontend
if not exist node_modules call npm install

echo.
echo ========================================================
echo 설치가 진짜로 완료되었습니다! 'run_app.bat'를 실행하세요.
echo ========================================================
pause
