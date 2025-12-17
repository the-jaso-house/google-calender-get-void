# Google Calendar Free Time Finder - PowerShell Startup Script
# This script ensures the server stops when the window is closed

# Set window title
$host.UI.RawUI.WindowTitle = "Google Calendar Free Time Finder"

Write-Host "========================================"  -ForegroundColor Cyan
Write-Host "Google Calendar Free Time Finder" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Change to script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Start the development server as a job
Write-Host "[1/3] Starting development server..." -ForegroundColor Yellow
$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:scriptPath
    npm run dev
}

# Wait for server to start
Write-Host "[2/3] Waiting for server to start (15 seconds)..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Open browser
Write-Host "[3/3] Opening browser..." -ForegroundColor Yellow
Start-Process "http://localhost:3000"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "Server is running!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Browser opened at: http://localhost:3000"
Write-Host ""
Write-Host "To STOP the server:" -ForegroundColor Red
Write-Host "  - Close this window (X button)" -ForegroundColor Red
Write-Host "  - Or press Ctrl+C" -ForegroundColor Red
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Function to cleanup on exit
function Cleanup {
    Write-Host ""
    Write-Host "Stopping server..." -ForegroundColor Yellow

    # Stop the job
    Stop-Job -Job $serverJob -ErrorAction SilentlyContinue
    Remove-Job -Job $serverJob -Force -ErrorAction SilentlyContinue

    # Kill all node processes (backup)
    Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue

    Write-Host "Server stopped." -ForegroundColor Green
    Start-Sleep -Seconds 2
}

# Register cleanup on exit
Register-EngineEvent -SourceIdentifier PowerShell.Exiting -Action { Cleanup }

# Keep the window open
try {
    # Wait indefinitely (until Ctrl+C or window close)
    Wait-Job -Job $serverJob
} finally {
    # This runs when the script is interrupted
    Cleanup
}
