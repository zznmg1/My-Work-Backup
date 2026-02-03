@echo off
rem 한글 경로 인식을 위해 UTF-8 코드페이지 설정
chcp 65001 > nul
setlocal

rem 관리자 권한으로 실행 시 현재 폴더로 이동
cd /d "%~dp0"

echo ========================================================
echo Dream Fortune AI - Auto Setup (UTF-8 Mode)
echo ========================================================
echo.

echo [1/3] Python 찾는 중...

rem 1. 'python' 명령어 시도
python --version > nul 2>&1
if %errorlevel% equ 0 (
    echo - 'python' 명령어 확인됨.
    set PY_CMD=python
    goto :FOUND_PYTHON
)

rem 2. 'py' 명령어 시도
py --version > nul 2>&1
if %errorlevel% equ 0 (
    echo - 'py' 명령어 확인됨.
    set PY_CMD=py
    goto :FOUND_PYTHON
)

rem 3. 절대 경로 시도 (한글 경로 포함)
set "TARGET_PY=%USERPROFILE%\AppData\Local\Programs\Python\Python312\python.exe"
if exist "%TARGET_PY%" (
    echo - 절대 경로에서 Python 발견됨.
    set "PY_CMD="%TARGET_PY%""
    goto :FOUND_PYTHON
)

echo [오류] Python을 찾을 수 없습니다. Python 3.12를 설치해주세요.
pause
exit /b

:FOUND_PYTHON
echo 사용할 Python 명령: %PY_CMD%
echo.

echo [2/3] 백엔드 설정 (Backend)...
cd backend
if exist .venv (
    echo - 기존 가상환경 제거 중...
    rmdir /s /q .venv
)

echo - 가상환경 생성 중...
%PY_CMD% -m venv .venv

if not exist .venv\Scripts\python.exe (
    echo [오류] 가상환경 생성 실패!
    pause
    exit /b
)

echo - 필수 패키지 설치 중...
.venv\Scripts\python -m pip install --upgrade pip
.venv\Scripts\pip install -r requirements.txt

echo.
echo [3/3] 프론트엔드 설정 (Frontend)...
cd ..\frontend
if not exist node_modules (
    echo - Node.js 패키지 설치 중...
    call npm install
)

echo.
echo ========================================================
echo 모든 설정이 완료되었습니다!
echo 창을 닫고 'run_app.bat'를 실행하여 서버를 켜세요.
echo ========================================================
pause
