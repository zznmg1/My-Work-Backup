@echo off
chcp 65001 > nul
setlocal enabledelayedexpansion

echo [1/4] Cleaning previous processes...
taskkill /F /IM python.exe > nul 2>&1
taskkill /F /IM node.exe > nul 2>&1

echo [2/4] Starting Backend (Background)...
cd backend
start /B .venv\Scripts\python main.py > backend.log 2>&1

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 > nul

echo [3/4] Testing Connection with CURL...
echo Sending request to http://localhost:8000/analyze_dream...
curl -v -X POST http://localhost:8000/analyze_dream ^
    -H "Content-Type: application/json" ^
    -d "{\"content\":\"test dream\", \"user_context\":\"test\"}" > curl_result.txt 2>&1

echo.
echo [4/4] CURL Result Content:
type curl_result.txt
echo.
echo Backend Log Content (Last 10 lines):
powershell -Command "Get-Content backend.log -Tail 10"

echo.
if exist curl_result.txt (
    findstr "200 OK" curl_result.txt > nul
    if !errorlevel! equ 0 (
        echo [SUCCESS] Backend is WORKING properly!
    ) else (
        echo [FAILURE] Backend returned an error or did not connect.
    )
)

echo.
echo Starting Frontend now...
cd ../frontend
start cmd /c "npm run dev"

pause
