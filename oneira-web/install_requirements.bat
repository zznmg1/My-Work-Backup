@echo off
chcp 65001 >nul
echo Installing AI Server Dependencies...
"c:\Users\ㅋㅋ\AppData\Local\Programs\Python\Python312\python.exe" -m pip install google-generativeai flask flask-cors python-dotenv uvicorn --no-cache-dir
echo.
echo Installation Complete.
echo You can now run start_dev.bat
pause
