@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo Dream Fortune AI - API Key Setup
echo ========================================================
echo.
echo 구글 AI 스튜디오에서 발급받은 API 키를 입력해주세요.
echo (https://aistudio.google.com/app/apikey)
echo.
set /p API_KEY="API Key 붙여넣기 (Ctrl+V): "

cd backend
echo GEMINI_API_KEY=%API_KEY% > .env

echo.
echo [성공] API 키가 저장되었습니다!
echo 이제 start_dream_fortune.bat을 실행하면 Gemini가 작동합니다.
echo ========================================================
pause
