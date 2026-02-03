@echo off
chcp 65001 > nul
echo ====================================================
echo NotebookLM 환경 복구 및 로그인
echo ====================================================

cd /d "c:\Projects\My_researchers"

echo [1/2] Playwright 브라우저(Chromium) 설치 확인 중...
REM PATH에 Scripts 추가하여 playwright 명령어가 인식되도록 설정
set "PATH=%cd%\.venv\Scripts;%PATH%"

REM 브라우저 설치 강제 실행 (설치되어 있으면 빠르게 넘어감)
set PYTHONUTF8=1
call playwright.exe install chromium

echo.
echo [2/2] 로그인 스크립트 실행
python.exe auto_login.py

if %ERRORLEVEL% equ 0 (
    echo.
    echo 모든 작업이 성공적으로 완료되었습니다.
) else (
    echo.
    echo 작업 중 오류가 발생했습니다.
)
pause
