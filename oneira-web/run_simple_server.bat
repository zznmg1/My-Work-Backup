@echo off
chcp 65001 >nul
echo Killing old processes...
taskkill /F /IM node.exe /IM python.exe /IM uvicorn.exe >nul 2>&1

echo Starting Backend Server (0.0.0.0:8000)...
start "AI Backend" cmd /k "cd /d c:\Project\My-Work-Backup\dream-fortune-ai\backend && .venv_fix\Scripts\activate && python main.py"

echo Starting Frontend Host (Port 5500)...
start "Frontend Host" cmd /k "python -m http.server 5500 --directory c:\Project\My-Work-Backup\oneira-web"

echo Opening Zero-Build Mode...
timeout /t 3 >nul
start http://localhost:5500/zero_build.html

echo.
echo ====================================================
echo  [Emergency Zero-Build Mode Active]
echo  Build tools are blocked on this machine.
echo  Using Browser-Side Compilation.
echo ====================================================
pause
