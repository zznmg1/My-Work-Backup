@echo off
chcp 65001 >nul
echo Killing old processes...
taskkill /F /IM node.exe /IM python.exe /IM uvicorn.exe >nul 2>&1

echo Starting Backend Server (0.0.0.0:8000)...
start "AI Backend" cmd /k "cd /d c:\Project\My-Work-Backup\dream-fortune-ai\backend && powershell -NoProfile -ExecutionPolicy Bypass -File run_backend.ps1"

echo Starting Frontend Server (127.0.0.1:3000)...
cd /d c:\Project\My-Work-Backup\oneira-web
call npm run dev
