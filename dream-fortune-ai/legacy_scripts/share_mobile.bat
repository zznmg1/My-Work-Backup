@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo Dream Fortune AI - Mobile Access Setup (Ngrok)
echo ========================================================
echo.
echo [1/3] 서버가 켜져 있는지 확인합니다...
tasklist /FI "IMAGENAME eq python.exe" | find "python.exe" > nul
if errorlevel 1 (
    echo [Error] 서버(start_dream_fortune.bat)가 꺼져 있습니다!
    echo 먼저 서버를 켜고 이 파일을 실행해주세요.
    pause
    exit /b
)

echo [2/3] 외부 접속 도구(Ngrok) 설치 중...
cd backend
.venv\Scripts\pip install pyngrok

echo.
echo [3/3] 모바일 접속용 주소 생성 중...
echo.
echo 잠시 후 생성되는 [ * Public URL ] 주소를 스마트폰에 입력하세요.
echo (주의: 이 검은 창을 끄면 모바일 접속도 끊깁니다)
echo.

:: ngrok으로 5173(프론트엔드) 포트를 엽니다.
:: 프론트엔드 프록시가 백엔드(8000)까지 연결해줍니다.

.venv\Scripts\python -c "from pyngrok import ngrok; public_url = ngrok.connect(5173); print(f'\n[접속 주소]: {public_url}\n'); import time; time.sleep(99999)"

pause
