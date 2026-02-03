@echo off
chcp 65001 > nul
set GIT="C:\Program Files\Git\cmd\git.exe"

echo [Deploy Start] > deploy.log
date /t >> deploy.log
time /t >> deploy.log

echo Adding files... >> deploy.log
%GIT% add . 2>> deploy.log

echo Committing... >> deploy.log
%GIT% commit -m "Fix: Final Force Update to Gemini 2.5" 2>> deploy.log

echo Pushing... >> deploy.log
%GIT% push origin main 2>> deploy.log

echo [Deploy End] >> deploy.log
echo Done.
