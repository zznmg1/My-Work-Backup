@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo Dream Fortune AI - Google Login
echo ========================================================
echo.
echo [중요] AI 꿈해몽을 위해 구글 로그인이 필요합니다.
echo.
echo 1. 잠시 후 브라우저가 열리고 구글 로그인 화면이 뜹니다.
echo 2. 로그인을 완료하고 "Authentication successful" 메시지가 뜨면
echo 3. 이 창으로 돌아와서 안내를 따라주세요.
echo.
echo (준비되면 아무 키나 누르세요)
pause

cd backend
if not exist .venv (
    echo [Error] 가상환경이 없습니다. 먼저 start_dream_fortune.bat을 실행하세요.
    pause
    exit /b
)

echo.
echo [Login] 로그인 도구 실행 중...
.venv\Scripts\notebooklm login

echo.
echo ========================================================
echo 로그인이 완료되었나요?
echo 이제 서버를 재시작하면 "진짜 AI"가 꿈을 해석해줍니다!
echo ========================================================
pause
