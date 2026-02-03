@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo Dream Fortune AI - GitHub Upload Assistant
echo ========================================================
echo.
echo [1/3] Git 초기화 및 파일 담기...
git init
git add .
git commit -m "First Commit: Dream Fortune AI (Gemini + Capacitor)"

echo.
echo ========================================================
echo [중요] GitHub 웹사이트에서 'New Repository'를 만드셨나요?
echo 주소 형식: https://github.com/아이디/레포지토리이름.git
echo ========================================================
echo.
set /p REPO_URL="만드신 저장소 주소(URL)를 붙여넣으세요: "

echo.
echo [2/3] 원격 저장소 연결 중...
git branch -M main
git remote remove origin 2>nul
git remote add origin %REPO_URL%

echo.
echo [3/3] 코드 업로드 (Push) 중...
echo (로그인 창이 뜨면 로그인해주세요)
git push -u origin main

echo.
echo ========================================================
echo 업로드 완료! 이제 Render에서 이 코드를 가져갈 수 있습니다.
echo ========================================================
pause
