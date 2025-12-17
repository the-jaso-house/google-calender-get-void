# Google Calendar Free Time Finder with System Tray Icon
# This script runs the server in background and adds a tray icon for easy stopping

Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing

# Change to script directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Kill any existing server
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Milliseconds 500

# Start the development server as a background job
$serverJob = Start-Job -ScriptBlock {
    Set-Location $using:scriptPath
    npm run dev 2>&1 | Out-Null
}

# Wait for server to start (8 seconds for faster startup)
Start-Sleep -Seconds 8

# Open browser
Start-Process "http://localhost:3000"

# Create system tray icon
$icon = [System.Drawing.Icon]::ExtractAssociatedIcon("C:\Windows\System32\shell32.dll")

$notifyIcon = New-Object System.Windows.Forms.NotifyIcon
$notifyIcon.Icon = $icon
$notifyIcon.Text = "Google Calendar サーバー実行中"
$notifyIcon.Visible = $true

# Create context menu
$contextMenu = New-Object System.Windows.Forms.ContextMenuStrip

# Open browser menu item
$openBrowserItem = New-Object System.Windows.Forms.ToolStripMenuItem
$openBrowserItem.Text = "ブラウザを開く"
$openBrowserItem.Add_Click({
    Start-Process "http://localhost:3000"
})

# Stop server menu item
$stopItem = New-Object System.Windows.Forms.ToolStripMenuItem
$stopItem.Text = "サーバーを停止して終了"
$stopItem.Add_Click({
    $notifyIcon.Visible = $false
    Stop-Job -Job $serverJob -ErrorAction SilentlyContinue
    Remove-Job -Job $serverJob -Force -ErrorAction SilentlyContinue
    Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
    if (Test-Path "$scriptPath\server.pid") {
        Remove-Item "$scriptPath\server.pid" -Force
    }
    [System.Windows.Forms.Application]::Exit()
})

$contextMenu.Items.Add($openBrowserItem)
$contextMenu.Items.Add($stopItem)
$notifyIcon.ContextMenuStrip = $contextMenu

# Show notification
$notifyIcon.ShowBalloonTip(3000, "Google Calendar", "サーバーが起動しました", [System.Windows.Forms.ToolTipIcon]::Info)

# Keep script running
$appContext = New-Object System.Windows.Forms.ApplicationContext
[System.Windows.Forms.Application]::Run($appContext)

# Cleanup on exit
$notifyIcon.Dispose()
Stop-Job -Job $serverJob -ErrorAction SilentlyContinue
Remove-Job -Job $serverJob -Force -ErrorAction SilentlyContinue
Get-Process -Name node -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
