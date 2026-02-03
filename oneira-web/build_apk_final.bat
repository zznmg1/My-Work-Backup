@echo off
set "JAVA_HOME=C:\Program Files\Android\Android Studio\jbr"
echo Using JAVA_HOME: %JAVA_HOME%
cd c:\Projects\oneira-web\android
call gradlew.bat assembleDebug
echo.
echo Build process completed.
if exist "app\build\outputs\apk\debug\app-debug.apk" (
    echo APK Created Successfully!
    echo Location: app\build\outputs\apk\debug\app-debug.apk
) else (
    echo APK Build FAILED. Check output above.
)
pause
