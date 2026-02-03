@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo Dream Fortune AI - Login Tool Installer
echo ========================================================
echo.
echo [1/2] 필수 브라우저 도구(Playwright) 설치 중...
cd backend
.venv\Scripts\pip install playwright
.venv\Scripts\playwright install chromium

echo.
echo [2/2] 설치 완료! 이제 로그인을 시도합니다...
echo.
.venv\Scripts\notebooklm login

echo.
echo ========================================================
echo 이제 정말 끝났습니다!
echo 창을 닫고 'start_dream_fortune.bat'을 다시 실행하세요.
echo ========================================================
pause
