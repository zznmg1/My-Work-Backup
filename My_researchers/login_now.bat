@echo off
chcp 65001 > nul
echo ====================================================
echo NotebookLM 자동 로그인
echo ====================================================
echo.
echo 브라우저가 열리면 Google 계정으로 로그인해주세요.
echo 로그인 후 이 창으로 돌아와 줍니다.
echo.

cd /d "c:\Projects\My_researchers"
set PYTHONUTF8=1
".venv\Scripts\python.exe" "auto_login.py"

echo.
echo 작업이 완료되었습니다.
pause
