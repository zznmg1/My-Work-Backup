@echo off
setlocal
echo [Manual Clean Build] Starting... > final_build.log
echo [Manual Clean Build] Starting...

:: 1. Clean Path Setup
set "ROOT_DIR=%CD%"
set "FRONTEND_DIR=%ROOT_DIR%\frontend"
set "ANDROID_DIR=%FRONTEND_DIR%\android"
set "DIST_DIR=%FRONTEND_DIR%\dist"
set "BUILD_DIR=%ANDROID_DIR%\app\build"

echo Root: %ROOT_DIR% >> final_build.log
echo Frontend: %FRONTEND_DIR% >> final_build.log
echo Android: %ANDROID_DIR% >> final_build.log

:: 2. Clean Artifacts
echo [1/4] Cleaning artifacts...
echo [1/4] Cleaning artifacts... >> final_build.log

if exist "%DIST_DIR%" (
    echo Deleting %DIST_DIR%...
    rmdir /s /q "%DIST_DIR%"
) else (
    echo %DIST_DIR% not found (already clean).
)

if exist "%BUILD_DIR%" (
    echo Deleting %BUILD_DIR%...
    rmdir /s /q "%BUILD_DIR%"
) else (
    echo %BUILD_DIR% not found (already clean).
)

:: 3. Frontend Build
echo [2/4] Building Frontend...
echo [2/4] Building Frontend... >> final_build.log
cd "%FRONTEND_DIR%"
call npm run build >> ..\final_build.log 2>&1
if %errorlevel% neq 0 (
    echo [Error] React build failed!
    echo [Error] React build failed! >> ..\final_build.log
    pause
    exit /b %errorlevel%
)
echo Frontend build success.

:: 4. Cap Sync
echo [3/4] Syncing Capacitor...
echo [3/4] Syncing Capacitor... >> ..\final_build.log
call npx cap sync >> ..\final_build.log 2>&1
if %errorlevel% neq 0 (
    echo [Error] Cap sync failed!
    echo [Error] Cap sync failed! >> ..\final_build.log
    pause
    exit /b %errorlevel%
)
echo Sync success.

:: 5. Gradle Build
echo [4/4] Building Android APK...
echo [4/4] Building Android APK... >> ..\final_build.log
cd "%ANDROID_DIR%"
call gradlew.bat clean assembleDebug >> ..\..\final_build.log 2>&1
if %errorlevel% neq 0 (
    echo [Error] Gradle build failed!
    echo [Error] Gradle build failed! >> ..\..\final_build.log
    pause
    exit /b %errorlevel%
)

:: 6. Verify
cd "%ROOT_DIR%"
echo [Success] Build Complete. >> final_build.log
echo [Success] Build Complete.
echo Checking timestamp...
dir "%ANDROID_DIR%\app\build\outputs\apk\debug\app-debug.apk" >> final_build.log
dir "%ANDROID_DIR%\app\build\outputs\apk\debug\app-debug.apk"

pause
