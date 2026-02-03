@echo off
echo [Start Debug Build]
echo [1/3] React Build...
cd frontend
call npm run build
if %errorlevel% neq 0 (
    echo [Error] React build failed
    exit /b %errorlevel%
)
echo REACT_BUILD_DONE

echo [2/3] Cap Sync...
call npx cap sync
if %errorlevel% neq 0 (
    echo [Error] Sync failed
    exit /b %errorlevel%
)
echo SYNC_DONE

echo [3/3] Gradle Build...
cd android
call gradlew.bat assembleDebug
if %errorlevel% neq 0 (
    echo [Error] Gradle build failed
    exit /b %errorlevel%
)
echo APK_BUILD_DONE
echo [All Done]
pause
