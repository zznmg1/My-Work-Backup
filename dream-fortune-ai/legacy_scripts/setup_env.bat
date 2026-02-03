@echo off
echo Setting up backend...
cd backend
python -m venv .venv
call .venv\Scripts\activate
python -m pip install --upgrade pip
pip install -r requirements.txt
cd ..

echo Setting up frontend...
cd frontend
call npm install
cd ..

echo Setup complete.
pause
