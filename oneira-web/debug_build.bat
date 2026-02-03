@echo off
echo STARTING DEBUG BUILD... > build_log.txt
echo Running npm run build... >> build_log.txt
call npm run build >> build_log.txt 2>&1
echo BUILD FINISHED with errorlevel %errorlevel% >> build_log.txt
