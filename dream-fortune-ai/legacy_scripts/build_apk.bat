@echo off
chcp 65001 > nul
setlocal

echo ========================================================
echo Dream Fortune AI - Android App Builder
echo ========================================================
echo.

cd frontend

echo [1/5] Capacitor(앱 포장 도구) 설치 중...
call npm install @capacitor/core @capacitor/cli @capacitor/android
call npm install -D @capacitor/cli

echo.
echo [2/5] 앱 초기화 (최초 1회)...
call npx cap init "Dream Fortune" "com.dreamfortune.ai" --web-dir dist

echo.
echo [3/5] 리액트 웹사이트 빌드 (HTML/CSS/JS 생성)...
call npm run build

echo.
echo [4/5] 안드로이드 프로젝트 생성...
call npx cap add android

echo.
echo [5/5] 최신 코드 동기화...
call npx cap sync

echo.
echo ========================================================
echo [완료] 안드로이드 프로젝트가 생성되었습니다!
echo 'c:\Projects\dream-fortune-ai\frontend\android' 폴더에 있습니다.
echo 
echo 이제 Android Studio에서 이 폴더를 열고 
echo [Build] -> [Build Bundle(s) / APK(s)] -> [Build APK]
echo 를 누르면 스마트폰에 설치할 수 있는 파일이 나옵니다.
echo ========================================================
pause
