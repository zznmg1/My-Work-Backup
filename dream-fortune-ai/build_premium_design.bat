@echo off
setlocal
set "PROJECT_ROOT=%~dp0"
set "FRONTEND_DIR=%PROJECT_ROOT%frontend"
set "ANDROID_DIR=%FRONTEND_DIR%\android"

echo ===================================================
echo   PREMIUM DESIGN BUILD START
echo ===================================================

REM --- Auto-detect JAVA_HOME ---
if not defined JAVA_HOME (
    echo [Setup] JAVA_HOME not set. Searching for common paths...
    
    if exist "C:\Program Files\Android\Android Studio\jbr" (
        set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
    ) else if exist "C:\Program Files\Android\Android Studio\jre" (
        set "JAVA_HOME=C:\Program Files\Android\Android Studio\jre"
    ) else if exist "C:\Program Files\Java\jdk-17" (
        set "JAVA_HOME=C:\Program Files\Java\jdk-17"
    )
)

if defined JAVA_HOME (
    echo [Setup] Found JAVA_HOME: %JAVA_HOME%
    set "PATH=%JAVA_HOME%\bin;%PATH%"
) else (
    echo [WARNING] Could not auto-detect JAVA_HOME. Build might fail.
)
REM -----------------------------

echo [1/5] Cleaning previous build artifacts...
if exist "%FRONTEND_DIR%\dist" (
    echo Deleting dist...
    rd /s /q "%FRONTEND_DIR%\dist"
)
if exist "%ANDROID_DIR%\app\build" (
    echo Deleting android/app/build...
    rd /s /q "%ANDROID_DIR%\app\build"
)
REM Explicitly delete the synced asset to force a refresh
if exist "%ANDROID_DIR%\app\src\main\assets\public\index.html" (
    echo Deleting old android assets...
    del /f /q "%ANDROID_DIR%\app\src\main\assets\public\index.html"
)

echo.
echo [2/5] Building React Frontend (Premium Design)...
cd /d "%FRONTEND_DIR%"
call npm run build
if errorlevel 1 (
    echo [ERROR] npm run build failed!
    pause
    exit /b 1
)

echo.
echo [3/5] Syncing with Capacitor...
call npx cap sync
if errorlevel 1 (
    echo [ERROR] npx cap sync failed!
    pause
    exit /b 1
)

echo.
echo [4/5] Verify Asset Update...
if not exist "%ANDROID_DIR%\app\src\main\assets\public\index.html" (
    echo [ERROR] Asset sync failed. index.html not found in Android assets.
    echo Please check if capacitor.config.json points to 'dist'.
    pause
    exit /b 1
)
echo Asset Verification: OK (index.html present in android assets)

echo.
echo [5/5] Building Android APK...
cd /d "%ANDROID_DIR%"
call gradlew.bat clean assembleDebug
if errorlevel 1 (
    echo [ERROR] Gradle build failed!
    pause
    exit /b 1
)

echo.
echo ===================================================
echo   BUILD SUCCESSFUL!
echo ===================================================
echo.
echo Generated APK Location:
for /r "%ANDROID_DIR%\app\build\outputs\apk\debug" %%F in (app-debug.apk) do (
    echo %%F
    echo Timestamp: %%~tF
)
echo.
echo Please install this newly generated APK.
pause
