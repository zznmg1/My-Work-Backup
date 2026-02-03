@echo off
cd /d "%~dp0"
echo ==========================================
echo Simple Setup (No Encoding Check)
echo ==========================================
echo.

set "PY=C:\Python312\python.exe"

if exist "%PY%" (
    echo Found Python at C:\Python312
    echo.
    echo Creating venv...
    "%PY%" -m venv backend\.venv
    
    if exist backend\.venv\Scripts\pip.exe (
        echo.
        echo Installing packages...
        backend\.venv\Scripts\python -m pip install -r backend\requirements.txt
        echo.
        echo Installing frontend...
        cd frontend
        call npm install
        echo.
        echo DONE!
    ) else (
        echo [ERROR] Venv creation failed.
    )
) else (
    echo [ERROR] Python not found at C:\Python312
)

echo.
echo Please check the message above.
pause
