@echo off
cd /d "%~dp0"

echo [1/3] Checking/Creating local virtual environment (.venv)...
if not exist ".venv" (
    echo Creating .venv...
    "%USERPROFILE%\AppData\Local\Programs\Python\Python312\python.exe" -m venv .venv
    echo .venv created successfully.
) else (
    echo .venv already exists. Skipping creation.
)

echo.
echo [2/3] Upgrading pip in local environment...
.venv\Scripts\python.exe -m pip install --upgrade pip

echo.
echo [3/3] Installing dependencies into local .venv...
.venv\Scripts\python.exe -m pip install -i https://mirror.kakao.com/pypi/simple -r requirements.txt

echo.
echo ===================================================
echo  Installation Complete!
echo  Python Environment: %CD%\.venv
echo ===================================================
echo.
pause
