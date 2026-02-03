@echo off
set "PATH=%PATH%;C:\Program Files\nodejs;C:\Users\ㅋㅋ\AppData\Roaming\npm"
set "PROJECT_ROOT=%~dp0"
set "TETRIS_DIR=%PROJECT_ROOT%tetris"

cd /d "%TETRIS_DIR%"

echo [1/3] Cleaning old build...
if exist dist (
    echo Deleting %TETRIS_DIR%\dist folder...
    rd /s /q dist
)

echo [2/3] Building v1.2.4...
call npm run build
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Build failed. Deployment cancelled.
    exit /b %ERRORLEVEL%
)

echo [3/3] Deploying to Firebase...
:: Use cmd /c and --non-interactive to prevent hangs and bypass PS policy issues
call cmd /c "C:\Users\ㅋㅋ\AppData\Roaming\npm\firebase.cmd" deploy --only hosting:tetris --non-interactive
if %ERRORLEVEL% neq 0 (
    echo [ERROR] Deployment failed.
    exit /b %ERRORLEVEL%
)

echo Done! Update reflected.
