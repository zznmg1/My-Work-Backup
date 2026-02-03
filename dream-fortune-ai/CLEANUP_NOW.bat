@echo off
setlocal enabledelayedexpansion
set "TARGET=legacy_scripts"

if not exist "%TARGET%" mkdir "%TARGET%"

echo ===================================================
echo   CLEANUP START (Manual Execution)
echo ===================================================

REM List of files to KEEP in the root
set "KEEP=CLEANUP_NOW.bat build_premium_design.bat verify_pc_build.bat start_dream_fortune.bat dream_data.txt .gitignore .gitattributes package.json package-lock.json"

for %%F in (*.bat *.py *.ps1 *.txt *.log *.zip *.exe) do (
    set "FOUND_KEEP=0"
    for %%K in (%KEEP%) do (
        if /I "%%F"=="%%K" set "FOUND_KEEP=1"
    )
    
    if "!FOUND_KEEP!"=="0" (
        echo [MOVE] %%F -^> %TARGET%
        move /Y "%%F" "%TARGET%\" >nul
    )
)

echo.
echo Cleanup complete! Please check the folder now.
pause
