@echo off
set "APK=c:\Projects\dream-fortune-ai\frontend\android\app\build\outputs\apk\debug\app-debug.apk"
set "STATUS=c:\Projects\dream-fortune-ai\status.txt"

echo CHECKING... > "%STATUS%"

if exist "%APK%" (
    del /f /q "%APK%"
)

if exist "%APK%" (
    echo FAILED_STILL_EXISTS > "%STATUS%"
) else (
    echo SUCCESS_DELETED > "%STATUS%"
)
