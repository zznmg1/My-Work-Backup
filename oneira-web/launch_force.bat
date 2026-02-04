@echo off
:: Force Kill
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM uvicorn.exe >nul 2>&1

:: 1. Start Backend (New Window)
start "BACKEND_SERVER" cmd /k "cd /d c:\Project\My-Work-Backup\dream-fortune-ai\backend && .venv_fix\Scripts\activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000"

:: 2. Start Frontend (New Window)
start "FRONTEND_SERVER" cmd /k "cd /d c:\Project\My-Work-Backup\oneira-web && python -m http.server 5500"

:: 3. Open Browser
timeout /t 3
start http://localhost:5500/zero_build.html
