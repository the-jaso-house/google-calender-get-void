@echo off
REM Google Calendar Free Time Finder - Startup Script
REM This launches the PowerShell script for better cleanup handling

REM Change to the script directory
cd /d "%~dp0"

REM Launch PowerShell script with execution policy bypass
powershell.exe -ExecutionPolicy Bypass -NoProfile -File "%~dp0start-app.ps1"

REM If PowerShell fails, show error message
if errorlevel 1 (
    echo.
    echo ERROR: Failed to start the application.
    echo Please make sure PowerShell is installed.
    echo.
    pause
)
