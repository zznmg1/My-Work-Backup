@echo off
cd backend
if exist .venv (
    echo .venv found
    .venv\Scripts\python --version
) else (
    echo .venv NOT found
)
