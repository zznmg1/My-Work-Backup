$OutputEncoding = [Console]::InputEncoding = [Console]::OutputEncoding = New-Object System.Text.UTF8Encoding

Write-Host "Searching for Python..." -ForegroundColor Cyan

# Try to find python in standard paths or PATH
$pythonPath = Get-Command python -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Source
if (-not $pythonPath) {
    $possiblePaths = @(
        "$env:LOCALAPPDATA\Programs\Python\Python312\python.exe",
        "$env:LOCALAPPDATA\Programs\Python\Python311\python.exe",
        "C:\Python312\python.exe",
        "C:\Python311\python.exe"
    )
    foreach ($p in $possiblePaths) {
        if (Test-Path $p) {
            $pythonPath = $p
            break
        }
    }
}

if (-not $pythonPath) {
    Write-Error "Python not found. Please install Python and add it to PATH."
    exit 1
}

Write-Host "Found Python at: $pythonPath" -ForegroundColor Green

$venvPath = ".\.venv_final"

if (-not (Test-Path $venvPath)) {
    Write-Host "Creating Virtual Environment at $venvPath..." -ForegroundColor Cyan
    & $pythonPath -m venv $venvPath
    if ($LASTEXITCODE -ne 0) {
        Write-Error "Failed to create venv."
        exit 1
    }
}

$pipPath = "$venvPath\Scripts\pip.exe"
$uvicornPath = "$venvPath\Scripts\uvicorn.exe"

Write-Host "Installing/Verifying Dependencies..." -ForegroundColor Cyan
& $pipPath install google-generativeai fastapi uvicorn python-dotenv flask flask-cors --no-cache-dir

Write-Host "Starting Backend Server (0.0.0.0:8000)..." -ForegroundColor Green
& $uvicornPath main:app --reload --host 0.0.0.0 --port 8000
