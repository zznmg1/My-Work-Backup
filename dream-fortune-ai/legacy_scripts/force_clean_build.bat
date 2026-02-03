@echo off
setlocal
echo [Force Clean Build] Starting...

:: 1. Clean previous build artifacts
echo [1/4] Cleaning old artifacts...
if exist "frontend\dist" (
    echo Deleting frontend\dist...
    rmdir /s /q "frontend\dist"
)
if exist "android\app\build" (
    echo Deleting android\app\build...
    rmdir /s /q "android\app\build"
)
echo Clean done.

:: 2. Build Frontend
echo [2/4] Building Frontend...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo [Error] React build failed!
    exit /b %errorlevel%
)
cd ..
echo Frontend build success.

:: 3. Sync Capacitor
echo [3/4] Syncing Capacitor...
call npx cap sync
if %errorlevel% neq 0 (
    echo [Error] Cap sync failed!
    exit /b %errorlevel%
)
echo Sync success.

:: 4. Build Android APK
echo [4/4] Building Android APK (Clean + Assemble)...
cd android
call gradlew.bat clean assembleDebug
if %errorlevel% neq 0 (
    echo [Error] Gradle build failed!
    exit /b %errorlevel%
)
cd ..

echo [Success] Build Complete.
echo Verify timestamp of APK below:
dir "android\app\build\outputs\apk\debug\app-debug.apk" | findstr ":"
pause
