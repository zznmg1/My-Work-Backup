@echo off
setlocal
cd /d "%~dp0"

echo ========================================================
echo Dream Fortune AI - Operation Clean Path (Python Install)
echo ========================================================
echo.
echo [1/3] Python 3.12.2 다운로드 중... (잠시만 기다려주세요)
echo.

:: curl을 사용하여 공식 홈페이지에서 파이썬 다운로드
curl -L -o python_installer.exe https://www.python.org/ftp/python/3.12.2/python-3.12.2-amd64.exe

if not exist python_installer.exe (
    echo [ERROR] 다운로드 실패! 인터넷 연결을 확인해주세요.
    pause
    exit /b
)

echo.
echo [2/3] C:\Python312 경로에 설치 시작...
echo (화면에 아무것도 안 떠도 백그라운드에서 설치 중입니다! 1~2분 정도 걸립니다.)
echo.

:: 관리자 권한 필수 + 조용한 설치 + 경로 지정
python_installer.exe /quiet InstallAllUsers=1 TargetDir=C:\Python312 PrependPath=1 Include_test=0

echo [3/3] 설치 확인 중...
timeout /t 30 > nul

if exist "C:\Python312\python.exe" (
    echo.
    echo ========================================================
    echo [SUCCESS] Python이 안전한 경로(C:\Python312)에 설치되었습니다!
    echo ========================================================
    echo 이제 한글(ㅋㅋ) 경로 문제로부터 해방되었습니다.
    echo.
    echo 마지막으로 'final_setup.bat'를 실행해서 프로젝트를 연결하겠습니다.
) else (
    echo.
    echo [WARNING] 아직 설치 중이거나 실패했을 수 있습니다.
    echo 잠시 후 C:\Python312 폴더가 생기는지 확인해주세요.
)

:: 다운로드한 설치 파일 삭제
del python_installer.exe

pause
