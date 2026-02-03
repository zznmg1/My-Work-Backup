@echo off
chcp 65001 > nul
echo ============================================
echo    테뚜리뚜 빌드 및 배포 스크립트
echo ============================================
echo.

REM 현재 디렉토리를 스크립트 위치로 변경
cd /d "%~dp0"

echo [1/3] 의존성 설치 중...
call npm install
if errorlevel 1 (
    echo 오류: npm install 실패!
    pause
    exit /b 1
)
echo 의존성 설치 완료!
echo.

echo [2/3] 프로젝트 빌드 중...
call npm run build
if errorlevel 1 (
    echo 오류: 빌드 실패!
    pause
    exit /b 1
)
echo 빌드 완료!
echo.

echo [3/3] Firebase에 배포 중...
cd ..
call firebase deploy --only hosting:tetris
if errorlevel 1 (
    echo 오류: 배포 실패!
    pause
    exit /b 1
)

echo.
echo ============================================
echo    빌드 및 배포가 완료되었습니다!
echo ============================================
echo.
pause
