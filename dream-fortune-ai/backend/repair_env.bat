@echo off
echo ==========================================
echo  Environment Repair Script
echo ==========================================
echo.
echo 1. Checking Python...
python --version
if errorlevel 1 (
    echo [ERROR] Python not found! Please install Python 3.10+
    pause
    exit /b
)

echo.
echo 2. Creating Virtual Environment (.venv_fix)...
python -m venv .venv_fix
if errorlevel 1 (
    echo [ERROR] Failed to create venv.
    pause
    exit /b
)

echo.
echo 3. Installing Dependencies...
.venv_fix\Scripts\python -m pip install --upgrade pip
.venv_fix\Scripts\pip install fastapi uvicorn google-generativeai python-dotenv
if errorlevel 1 (
    echo [ERROR] Failed to install dependencies.
    pause
    exit /b
)

echo.
echo ==========================================
echo  Repair Complete! 
echo ==========================================
echo.
pause
