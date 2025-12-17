Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get the directory where this script is located
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)

' Change to the application directory
WshShell.CurrentDirectory = scriptDir

' Create a unique PID file to track this server instance
pidFile = scriptDir & "\server.pid"

' Kill any existing server
WshShell.Run "taskkill /F /IM node.exe", 0, False
WScript.Sleep 500

' Start the development server in background (completely hidden)
WshShell.Run "cmd /c npm run dev > nul 2>&1", 0, False

' Write a marker file to indicate server is running
Set pidFileObj = fso.CreateTextFile(pidFile, True)
pidFileObj.WriteLine("running")
pidFileObj.Close

' Wait for server to start (reduced to 8 seconds for faster startup)
WScript.Sleep 8000

' Open browser
WshShell.Run "http://localhost:3000", 1, False

' Clean up
Set WshShell = Nothing
Set fso = Nothing
