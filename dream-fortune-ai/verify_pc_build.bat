@echo off
setlocal
set "PROJECT_ROOT=%~dp0"
set "FRONTEND_DIR=%PROJECT_ROOT%frontend"

echo ===================================================
echo   PC DESIGN VERIFICATION
echo ===================================================

echo [1/2] Building React Frontend...
cd /d "%FRONTEND_DIR%"
call npm run build
if errorlevel 1 (
    echo [ERROR] Build failed!
    pause
    exit /b 1
)

echo.
echo [2/2] Starting Preview Server...
echo A browser window should open shortly.
echo Please CHECK if the design is PURPLE (Premium) or WHITE (Old).
echo.
call npx vite preview --port 5000 --open
pause
