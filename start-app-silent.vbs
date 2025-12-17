Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get the directory where this script is located
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)

' Change to the application directory
WshShell.CurrentDirectory = scriptDir

' Start the batch file hidden (no window)
WshShell.Run "cmd /c start-app.bat", 0, False

' Clean up
Set WshShell = Nothing
Set fso = Nothing
