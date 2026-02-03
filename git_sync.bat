@echo off
setlocal enabledelayedexpansion

echo [Git Sync] Starting synchronization for all repositories in c:\Projects...

set commit_message="Auto commit: %DATE% %TIME%"
if not "%~1"=="" set commit_message="%~1"

for /d %%D in (c:\Projects\*) do (
    if exist "%%D\.git\" (
        echo.
        echo [Syncing] %%~nxD
        cd /d "%%D"
        
        echo [Status] Checking for changes...
        git status -s
        
        echo [Action] Adding changes...
        git add .
        
        echo [Action] Committing changes with message: !commit_message!
        git commit -m !commit_message!
        
        echo [Action] Pushing to remote...
        git push
        
        if !errorlevel! equ 0 (
            echo [Success] %%~nxD synced successfully.
        ) else (
            echo [Warning] %%~nxD sync encountered issues or no changes to push.
        )
    )
)

echo.
echo [Git Sync] Process completed.
pause
