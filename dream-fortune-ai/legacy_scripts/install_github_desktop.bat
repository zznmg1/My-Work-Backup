@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo [도우미] GitHub Desktop 설치 중...
echo ========================================================
echo.
echo 1. 마이크로소프트 공식 도구(winget)로 안전하게 설치합니다.
echo 2. 설치가 끝나면 자동으로 프로그램이 실행됩니다.
echo.

winget install --id GitHub.GitHubDesktop -e --source winget --accept-package-agreements --accept-source-agreements

echo.
echo ========================================================
echo 설치 완료! 이제 GitHub Desktop이 열리면:
echo 1. 로그인 하시고
echo 2. 'Add an Existing Repository from your Hard Drive' 클릭
echo 3. 'c:\Projects\dream-fortune-ai' 폴더 선택
echo 4. 'Publish repository' 버튼 클릭
echo ========================================================
pause
