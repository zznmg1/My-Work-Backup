@echo off
echo [Start Manual Build] > manual_build.log
date /t >> manual_build.log
time /t >> manual_build.log

echo [1/3] React Build... >> manual_build.log
cd frontend
call npm run build >> ..\manual_build.log 2>&1
if %errorlevel% neq 0 (
    echo [Error] React build failed >> ..\manual_build.log
    exit /b %errorlevel%
)
echo REACT_BUILD_DONE >> ..\manual_build.log

echo [2/3] Cap Sync... >> manual_build.log
call npx cap sync >> ..\manual_build.log 2>&1
if %errorlevel% neq 0 (
    echo [Error] Sync failed >> ..\manual_build.log
    exit /b %errorlevel%
)
echo SYNC_DONE >> ..\manual_build.log

echo [3/3] Gradle Build... >> manual_build.log
cd android
call gradlew.bat assembleDebug >> ..\..\manual_build.log 2>&1
if %errorlevel% neq 0 (
    echo [Error] Gradle build failed >> ..\..\manual_build.log
    exit /b %errorlevel%
)
echo APK_BUILD_DONE >> ..\..\manual_build.log
echo [All Done] >> ..\..\manual_build.log
