@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo [Real-Auto] APK Build System by Agent
echo ========================================================

echo.
echo [1/3] React Web Build...
cd frontend
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo [2/3] Capacitor Sync...
call npx cap sync
if %errorlevel% neq 0 exit /b %errorlevel%

echo.
echo [3/3] Android Gradle Build (True APK Generation)...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo [Error] Gradle build failed.
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo [Success] New APK Generated!
echo Location: frontend/android/app/build/outputs/apk/debug/app-debug.apk
echo ========================================================
