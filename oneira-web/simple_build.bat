@echo off
echo STARTING > result.txt
call npx vite build >> result.txt 2>&1
echo DONE >> result.txt
