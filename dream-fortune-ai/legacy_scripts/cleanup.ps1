$dest = "legacy_scripts"
if (!(Test-Path $dest)) {
    New-Item -ItemType Directory -Force -Path $dest
    Write-Host "Created $dest directory."
}

$keep = @("build_premium_design.bat", "verify_pc_build.bat", "start_dream_fortune.bat", "cleanup.ps1")

Get-ChildItem -File | Where-Object { 
    ($_.Extension -eq ".bat" -or $_.Extension -eq ".py" -or $_.Extension -eq ".ps1") -and 
    ($_.Name -notin $keep) 
} | ForEach-Object {
    Write-Host "Moving $($_.Name)..."
    Move-Item -Path $_.FullName -Destination $dest -Force -ErrorAction SilentlyContinue
}

Write-Host "Cleanup Complete."
