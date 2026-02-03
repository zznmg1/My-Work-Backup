@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo [FINAL FIX] Dream Fortune AI - Force Restart
echo ========================================================
echo.

echo [1/3] Terminating old processes...
taskkill /F /IM python.exe > nul 2>&1
taskkill /F /IM node.exe > nul 2>&1

echo.
echo [2/3] Starting Backend (127.0.0.1:8000)...
cd backend
if not exist .venv (
    echo [Error] Virtual environment missing. Running setup...
    python -m venv .venv
    .venv\Scripts\pip install -r requirements.txt
)
start "DreamFortune Backend" cmd /k ".venv\Scripts\python main.py"
cd ..

echo.
echo [3/3] Starting Frontend...
cd frontend
start "DreamFortune Frontend" cmd /k "npm run dev"
cd ..

echo.
echo ========================================================
echo  DONE. Please refresh your browser: http://localhost:5173
echo ========================================================
pause
