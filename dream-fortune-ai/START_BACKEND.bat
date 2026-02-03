@echo off
title Oneira AI Backend Launcher
echo ==========================================
echo    ONEIRA AI BACKEND LAUNCHER
echo ==========================================
echo.

:: 1. Check Python
where python >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Python not found in PATH. Please install Python 3.9+.
    pause
    exit /b
)

echo [INFO] Python found. Checking dependencies...
python -m pip install fastapi uvicorn pydantic google-generativeai --quiet

:: 2. Check for API KEY
if "%GEMINI_API_KEY%"=="" (
    echo [WARNING] GEMINI_API_KEY environment variable is NOT set.
    echo [INFO] Server will run in DEMO/MOCK mode.
) else (
    echo [SUCCESS] GEMINI_API_KEY detected. AI is READY.
)

echo.
echo [INFO] Starting FastAPI server on http://localhost:8000 ...
echo [INFO] Keep this window open while using the app.
echo.

python backend/test_server_minimal.py

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Server crashed or failed to start.
    echo [TIP] Check if port 8000 is occupied by another process.
    pause
)
