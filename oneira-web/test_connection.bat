@echo off
echo Testing Backend Connection (Port 8000)...
curl -v http://localhost:8000/docs >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Backend is reachable.
) else (
    echo [ERROR] Backend is NOT reachable.
)

echo.
echo Testing Frontend Connection (Port 5173)...
curl -v http://localhost:5173 >nul 2>&1
if %errorlevel% equ 0 (
    echo [OK] Frontend is reachable.
) else (
    echo [ERROR] Frontend is NOT reachable.
)
pause
