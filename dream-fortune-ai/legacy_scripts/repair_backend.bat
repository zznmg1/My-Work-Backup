@echo off
cd backend
echo Creating venv...
py -m venv .venv
if not exist .venv (
    echo py failed, trying python...
    python -m venv .venv
)

if exist .venv (
    echo Installing requirements...
    .venv\Scripts\python -m pip install -r requirements.txt
    echo Done.
) else (
    echo Failed to create venv.
)
