Set WshShell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")

' Get the directory where this script is located
scriptDir = fso.GetParentFolderName(WScript.ScriptFullName)

' Run PowerShell script hidden
WshShell.Run "powershell.exe -ExecutionPolicy Bypass -WindowStyle Hidden -NoProfile -File """ & scriptDir & "\start-with-tray.ps1""", 0, False

' Clean up
Set WshShell = Nothing
Set fso = Nothing
