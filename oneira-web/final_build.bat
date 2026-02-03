@echo off
echo ==========================================
echo STARTING FINAL APK BUILD SEQUENCE
echo ==========================================

cd c:\Projects\oneira-web

echo [1/6] Installing Capacitor Dependencies...
call npm install @capacitor/core @capacitor/cli @capacitor/android
if %errorlevel% neq 0 exit /b %errorlevel%

echo [2/6] Initializing Capacitor...
call npx cap init Oneira com.oneira.fortune --web-dir dist
:: Ignore error if already initialized
if %errorlevel% neq 0 echo (Capacitor might already be initialized, proceeding...)

echo [3/6] Adding Android Platform...
call npx cap add android
:: Ignore error if already added
if %errorlevel% neq 0 echo (Android platform might already exist, proceeding...)

echo [4/6] Building Web Project...
call npm run build
if %errorlevel% neq 0 exit /b %errorlevel%

echo [5/6] Syncing Capacitor...
call npx cap sync
if %errorlevel% neq 0 exit /b %errorlevel%

echo [6/6] Building APK with Gradle...
cd android
if exist gradlew.bat (
    call gradlew.bat assembleDebug
) else (
    echo ERROR: gradlew.bat not found in android directory!
    exit /b 1
)

echo ==========================================
echo APK BUILD SUCCESSFUL
echo ==========================================
pause
