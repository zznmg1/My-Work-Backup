@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo [PROXY FIX] Dream Fortune AI - Restarting with Proxy
echo ========================================================
echo.

echo [1/3] Terminating old processes...
taskkill /F /IM python.exe > nul 2>&1
taskkill /F /IM node.exe > nul 2>&1

echo.
echo [2/3] Starting Backend...
cd backend
start /B .venv\Scripts\python -u main.py > backend_proxy.log 2>&1
cd ..

echo.
echo [3/3] Starting Frontend (with Proxy)...
cd frontend
if not exist node_modules call npm install
start /B cmd /c "npm run dev > frontend_proxy.log 2>&1"
cd ..

echo.
echo Waiting 10 seconds for servers to stabilize...
timeout /t 10 > nul

echo.
echo [Verification] Testing Proxy Connection via Frontend...
echo Requesting http://localhost:5173/api/analyze_dream...
curl -v -X POST http://localhost:5173/api/analyze_dream ^
    -H "Content-Type: application/json" ^
    -d "{\"content\":\"proxy test\", \"user_context\":\"test\"}" > proxy_test.txt 2>&1

echo.
echo [Result] Check below if 200 OK:
findstr "200 OK" proxy_test.txt
if %errorlevel% equ 0 (
    echo [SUCCESS] Proxy is working! The frontend is successfully talking to the backend.
) else (
    echo [WARNING] Proxy test might have failed or timed out. Check proxy_test.txt.
)

echo.
echo ========================================================
echo FIXED. Please refresh: http://localhost:5173
echo ========================================================
pause
