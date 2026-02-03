@echo off
:: 작업 디렉토리를 현재 스크립트가 있는 곳으로 강제 변경 (관리자 실행 시 필요)
cd /d "%~dp0"

echo ===========================================
echo Dream Fortune AI - Ultimate Repair Tool
echo ===========================================
echo Current Folder: %CD%
echo.

:: PowerShell을 사용하여 복잡한 경로 및 설치 작업 처리
powershell -NoProfile -ExecutionPolicy Bypass -Command "& { $ErrorActionPreference = 'Stop'; Write-Host '[1/4] Finding Python...'; $py = Get-Command python.exe -ErrorAction SilentlyContinue; if (!$py) { $py = Get-ChildItem -Path $env:USERPROFILE\AppData\Local\Programs\Python -Filter python.exe -Recurse | Where-Object { $_.FullName -notmatch 'Scripts' } | Select-Object -First 1 }; if (!$py) { Write-Error 'Python executable not found. Please install Python.'; exit 1 }; Write-Host 'Found:' $py.Source; Write-Host '[2/4] Entering backend...'; Set-Location 'backend'; if (Test-Path .venv) { Write-Host 'Removing old .venv...'; Remove-Item -Recurse -Force .venv }; Write-Host '[3/4] Creating .venv...'; Start-Process -FilePath $py.Source -ArgumentList '-m venv .venv' -Wait -NoNewWindow; if (-not (Test-Path .venv\Scripts\python.exe)) { Write-Error 'Failed to create .venv'; exit 1 }; Write-Host '[4/4] Installing dependencies...'; & .venv\Scripts\python -m pip install --upgrade pip; & .venv\Scripts\pip install -r requirements.txt; Write-Host 'Backend Setup Complete!'; Write-Host 'Checking Frontend...'; Set-Location '../frontend'; if (-not (Test-Path node_modules)) { npm install }; Write-Host 'All Done!' }"

if %errorlevel% neq 0 (
    echo.
    echo [ERROR] Something went wrong.
    pause
    exit /b
)

echo.
echo ===========================================
echo Success! You can close this window.
echo ===========================================
pause
