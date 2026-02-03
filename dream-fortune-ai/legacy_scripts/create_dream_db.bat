@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo [DB Setup] 꿈해몽 전용 지식(Notebook) 만들기
echo ========================================================
echo.

cd backend
if not exist .venv (
    echo [Error] 가상환경이 없습니다. start_dream_fortune.bat을 먼저 실행하세요.
    pause
    exit /b
)

echo 스크립트를 실행합니다...
.venv\Scripts\python setup_db.py

echo.
echo ========================================================
echo 완료되었습니다.
echo 이제 start_dream_fortune.bat으로 서버를 켜면
echo 공용 데이터(꿈해몽_DB)를 사용합니다.
echo ========================================================
pause
