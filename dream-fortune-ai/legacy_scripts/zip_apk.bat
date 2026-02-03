@echo off
rem Zip the APK
powershell Compress-Archive -Path "c:\Projects\dream-fortune-ai\frontend\android\app\build\outputs\apk\debug\app-debug.apk" -DestinationPath "c:\Projects\dream-fortune-ai\dream-fortune-app.zip" -Force
echo Zipped.
