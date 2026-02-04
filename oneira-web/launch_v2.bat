@echo off
chcp 65001 >nul
echo [1/4] Closing existing servers...
taskkill /F /IM node.exe >nul 2>&1
taskkill /F /IM python.exe >nul 2>&1
taskkill /F /IM uvicorn.exe >nul 2>&1

echo [2/4] Starting Backend (Port 8000)...
start "AI Backend Monitor" cmd /k "cd /d c:\Project\My-Work-Backup\dream-fortune-ai\backend && echo Activating venv... && .venv_fix\Scripts\activate && echo Starting FastAPI... && python main.py"

echo [3/4] Starting Frontend (Port 5500)...
start "Frontend Host Monitor" cmd /k "cd /d c:\Project\My-Work-Backup\oneira-web && echo Starting Simple HTTP Server... && python -m http.server 5500"

echo [4/4] Launching App...
timeout /t 3 >nul
explorer "http://localhost:5500/zero_build.html"

echo =========================================
echo       SERVERS LAUNCHED SUCCESSFULLY
echo =========================================
echo Please check the two new terminal windows.
echo If they close immediately, there is an error.
pause
