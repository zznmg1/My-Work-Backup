@echo off
setlocal
title Oneira System Launcher (Final Emergency Mode)
color 0f

echo.
echo ==========================================================
echo    ONEIRA AI SYSTEM LAUNCHER
echo    (Zero-Build Strategy)
echo ==========================================================
echo.

echo [1/5] Terminating previous instances...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM uvicorn.exe >nul 2>&1
timeout /t 1 >nul

echo [2/5] Checking Environment...
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo.
    echo [CRITICAL ERROR] Python is not installed or not in PATH.
    echo Please install Python 3.10+ and tick "Add to PATH".
    pause
    exit /b
)

if not exist "c:\Projects\oneira-web\zero_build.html" (
    echo.
    echo [CRITICAL ERROR] 'zero_build.html' is missing in oneira-web.
    pause
    exit /b
)

echo [3/5] Starting AI Backend (Port 8000)...
start "AI Backend" cmd /k "cd /d c:\Projects\dream-fortune-ai\backend && echo Activating Venv... && if exist .venv\Scripts\activate.bat (call .venv\Scripts\activate.bat) else (echo Venv missing, running global...) && python main.py"

echo [4/5] Starting Frontend Server (Port 7777)...
cd /d c:\Projects\oneira-web
start "Oneira Frontend" cmd /k "python -m http.server 7777"

echo [5/5] Launching Browser...
timeout /t 3 >nul
start http://localhost:7777/zero_build.html

echo.
echo ==========================================================
echo    SYSTEM LAUNCHED
echo ==========================================================
echo 1. Check the 'AI Backend' window for errors.
echo 2. Check the browser window.
echo.
echo If the browser shows "Unable to connect", keep this window open
echo and try refreshing the page after 5 seconds.
echo.
pause
