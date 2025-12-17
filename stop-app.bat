@echo off
REM Stop the Google Calendar development server

REM Change to the script directory
cd /d "%~dp0"

REM Kill all node processes
taskkill /F /IM node.exe /T >nul 2>&1

REM Remove PID file if exists
if exist "server.pid" del /F /Q "server.pid"

REM No output - just close immediately
exit
