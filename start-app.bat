@echo off
REM Google Calendar Free Time Finder - Startup Script
REM This script starts the development server and opens the browser

echo Starting Google Calendar Free Time Finder...
echo.

REM Change to the script directory
cd /d "%~dp0"

REM Start the development server
echo Starting development server...
start /B npm run dev

REM Wait for server to start (15 seconds)
echo Waiting for server to start...
timeout /t 15 /nobreak > nul

REM Open browser
echo Opening browser...
start http://localhost:3000

echo.
echo Application started!
echo Close this window to stop the server.
echo.

REM Keep the window open and wait for user input
pause
