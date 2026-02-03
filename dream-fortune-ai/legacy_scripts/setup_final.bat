@echo off
setlocal
echo ==========================================
echo Dream Fortune AI - Final Setup Tool
echo ==========================================
echo.

:: Use USERPROFILE to avoid Korean character encoding issues
set "PYTHON_PATH=C:\Python312\python.exe"

echo [1/4] Checking Python at:
echo %PYTHON_PATH%

if not exist "%PYTHON_PATH%" (
    echo [ERROR] Python not found at default location.
    echo Please install Python 3.12 or check your installation.
    pause
    exit /b
)

cd backend

:: 1. Remove broken venv
if exist .venv (
    echo [2/4] Removing broken .venv...
    rmdir /s /q .venv
)

:: 2. Create venv using explicit python path
echo [3/4] Creating virtual environment...
"%PYTHON_PATH%" -m venv .venv

if not exist .venv\Scripts\python.exe (
    echo [ERROR] Failed to create .venv.
    pause
    exit /b
)

:: 3. Install dependencies
echo [4/4] Installing dependencies...
.venv\Scripts\python -m pip install --upgrade pip
.venv\Scripts\pip install -r requirements.txt

echo.
echo ==========================================
echo *** SETUP COMPLETE ***
echo You can now close this window and run 'run_app.bat'.
echo ==========================================
pause
