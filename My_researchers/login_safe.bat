@echo off
chcp 65001 > nul
echo ====================================================
echo NotebookLM 로그인 (경로 호환성 모드)
echo ====================================================

cd /d "c:\Projects\My_researchers"

REM 1. 시스템 기본 경로(System32 등) 보장
set "PATH=C:\Windows\System32;C:\Windows;C:\Windows\System32\Wbem;%PATH%"

REM 2. 한글이 없는 안전한 곳으로 홈 디렉토리 변경
set "NOTEBOOKLM_HOME=c:\Projects\My_researchers\.notebooklm"
if not exist "%NOTEBOOKLM_HOME%" mkdir "%NOTEBOOKLM_HOME%"

REM 3. UTF-8 강제
set PYTHONUTF8=1

echo [정보] 홈 디렉토리: %NOTEBOOKLM_HOME%
echo.
echo 브라우저가 뜨면 로그인을 진행해주세요.
echo (만일 브라우저가 즉시 닫힌다면 백신 프로그램 실시간 감시를 잠시 꺼보세요)
echo.

".venv\Scripts\python.exe" "auto_login.py"

echo.
pause
