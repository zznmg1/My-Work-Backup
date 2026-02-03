@echo off
echo Starting Gradle Build... > build_log.txt
call gradlew.bat assembleDebug >> build_log.txt 2>&1
echo Done. >> build_log.txt
