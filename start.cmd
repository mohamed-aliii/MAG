@echo off
set "PATH=%PATH%;C:\Program Files\nodejs\"
echo Installing packages...
call npm install
echo Starting development server...
call npm run dev
pause
