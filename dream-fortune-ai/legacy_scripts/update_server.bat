@echo off
chcp 65001 > nul
setlocal

echo ========================================================
set GIT="C:\Program Files\Git\cmd\git.exe"

echo.
echo ========================================================
echo [1/3] 변경 변경 사항을 확인하고 추가합니다...
echo ========================================================
%GIT% add .

echo.
echo [2/3] 변경 내역을 저장합니다...
%GIT% commit -m "Auto-Update: Optimized by AI"

echo.
echo [3/3] 서버(GitHub)로 전송 중...
%GIT% push origin main

echo.
echo ========================================================
echo [완료] 모든 작업이 끝났습니다. 창이 3초 뒤에 닫힙니다.
echo ========================================================
timeout /t 3
