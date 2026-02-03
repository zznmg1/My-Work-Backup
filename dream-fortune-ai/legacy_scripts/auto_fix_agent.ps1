# 에이전트 자동화 복구 스크립트 (Agent Auto-Fix)
$ErrorActionPreference = "Stop"
$logFile = "agent_install_log.txt"

function Log($message) {
    Write-Host $message
    Add-Content -Path $logFile -Value "[$(Get-Date -Format 'HH:mm:ss')] $message"
}

try {
    Log "작업 시작: 독립형 Python 환경 구축"
    
    # 1. 작업 디렉토리 정리
    if (Test-Path "python_min") {
        Log "기존 python_min 폴더 제거 중..."
        Remove-Item -Recurse -Force "python_min"
    }
    New-Item -ItemType Directory -Force -Path "python_min" | Out-Null

    # 2. Python Embeddable 다운로드
    $pyUrl = "https://www.python.org/ftp/python/3.12.2/python-3.12.2-embed-amd64.zip"
    $pyZip = "python_min.zip"
    Log "Python 다운로드 중... ($pyUrl)"
    Invoke-WebRequest -Uri $pyUrl -OutFile $pyZip
    
    # 3. 압축 해제
    Log "압축 해제 중..."
    Expand-Archive -Path $pyZip -DestinationPath "python_min" -Force
    Remove-Item $pyZip
    
    # 4. python312._pth 수정 (import site 활성화 - pip 설치를 위해 필수)
    $pthFile = "python_min\python312._pth"
    Log "설정 파일 수정 중... ($pthFile)"
    $content = Get-Content $pthFile
    $content = $content -replace "#import site", "import site"
    Set-Content -Path $pthFile -Value $content

    # 5. pip 설치 (get-pip.py)
    Log "get-pip.py 다운로드 중..."
    Invoke-WebRequest -Uri "https://bootstrap.pypa.io/get-pip.py" -OutFile "python_min\get-pip.py"
    
    Log "pip 설치 중..."
    & ".\python_min\python.exe" "python_min\get-pip.py" --no-warn-script-location
    
    # 6. 의존성 설치
    Log "라이브러리 설치 중... (requirements.txt)"
    & ".\python_min\python.exe" -m pip install -r "backend\requirements.txt" --no-warn-script-location
    
    # 7. 프론트엔드 설치 (npm)
    Log "프론트엔드 설정 확인 중..."
    if (-not (Test-Path "frontend\node_modules")) {
        Log "npm install 실행..."
        Set-Location "frontend"
        cmd /c "npm install"
        Set-Location ".."
    }

    # 8. 최종 검증
    $ver = & ".\python_min\python.exe" --version
    Log "설치 완료! Python 버전: $ver"
    Log "SUCCESS_FLAG"

} catch {
    Log "치명적 오류 발생: $_"
    exit 1
}
