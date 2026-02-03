@echo off
chcp 65001 > nul
echo ====================================================
echo AI 연구원 수익화 전략 회의
echo ====================================================
echo.
echo 4명의 연구원(사원, 대리, 과장, 차장)을 소집하여
echo 수익화 아이디어 회의를 시작합니다.
echo.
echo 진행 과정이 아래에 표시됩니다...
echo.

cd /d "c:\Projects\My_researchers"
".venv\Scripts\python.exe" "revenue_meeting.py"

echo.
echo ====================================================
echo 회의가 종료되었습니다!
echo 'meeting_result_revenue.md' 파일에 결과가 저장되었습니다.
echo 확인 후 아무 키나 누르면 닫힙니다.
echo ====================================================
pause
