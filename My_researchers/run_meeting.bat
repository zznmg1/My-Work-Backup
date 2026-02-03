@echo off
cd /d "%~dp0"

echo Running Conduct Meeting script using local .venv...
.venv\Scripts\python.exe conduct_meeting.py

echo.
echo Script finished. Press any key to exit.
pause
