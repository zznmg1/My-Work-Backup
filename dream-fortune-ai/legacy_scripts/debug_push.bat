@echo off
chcp 65001
echo.
echo === Git Push 디버깅 모드 ===
echo.
echo 서버로 코드를 전송합니다.
echo 에러 메시지가 뜨는지 잘 봐주세요!
echo.
git push origin main
echo.
echo상태: %ERRORLEVEL%
echo.
pause
