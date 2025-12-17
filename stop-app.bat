@echo off
REM Stop the development server

echo Stopping Google Calendar Free Time Finder...

REM Kill all node processes (this will stop the dev server)
taskkill /F /IM node.exe /T 2>nul

if %errorlevel% equ 0 (
    echo Server stopped successfully.
) else (
    echo No running server found.
)

timeout /t 3 /nobreak > nul
