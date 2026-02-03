@echo off
setlocal
echo [Auto Clean Build] Starting... > auto_build.log

:: 1. Clean Path Setup
set "ROOT_DIR=%CD%"
set "FRONTEND_DIR=%ROOT_DIR%\frontend"
set "ANDROID_DIR=%FRONTEND_DIR%\android"
set "DIST_DIR=%FRONTEND_DIR%\dist"
set "BUILD_DIR=%ANDROID_DIR%\app\build"

echo Root: %ROOT_DIR% >> auto_build.log
echo Frontend: %FRONTEND_DIR% >> auto_build.log
echo Android: %ANDROID_DIR% >> auto_build.log

:: 2. Clean Artifacts
echo [1/4] Cleaning artifacts... >> auto_build.log

if exist "%DIST_DIR%" (
    echo Deleting %DIST_DIR%... >> auto_build.log
    rmdir /s /q "%DIST_DIR%"
) else (
    echo %DIST_DIR% not found. >> auto_build.log
)

if exist "%BUILD_DIR%" (
    echo Deleting %BUILD_DIR%... >> auto_build.log
    rmdir /s /q "%BUILD_DIR%"
) else (
    echo %BUILD_DIR% not found. >> auto_build.log
)

:: 3. Frontend Build
echo [2/4] Building Frontend... >> auto_build.log
cd "%FRONTEND_DIR%"
call npm run build >> ..\auto_build.log 2>&1
if %errorlevel% neq 0 (
    echo [Error] React build failed! >> ..\auto_build.log
    exit /b %errorlevel%
)

:: 4. Cap Sync
echo [3/4] Syncing Capacitor... >> ..\auto_build.log
call npx cap sync >> ..\auto_build.log 2>&1
if %errorlevel% neq 0 (
    echo [Error] Cap sync failed! >> ..\auto_build.log
    exit /b %errorlevel%
)

:: 5. Gradle Build
echo [4/4] Building Android APK... >> ..\auto_build.log
cd "%ANDROID_DIR%"
call gradlew.bat clean assembleDebug >> ..\..\auto_build.log 2>&1
if %errorlevel% neq 0 (
    echo [Error] Gradle build failed! >> ..\..\auto_build.log
    exit /b %errorlevel%
)

:: 6. Verify
cd "%ROOT_DIR%"
echo [Success] Build Complete. >> auto_build.log
echo Checking timestamp... >> auto_build.log
dir "%ANDROID_DIR%\app\build\outputs\apk\debug\app-debug.apk" >> auto_build.log
