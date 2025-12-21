<#
Run the backend with GEMINI env vars set interactively.

Usage:
 - Open PowerShell and run this script from any folder:
   \Path\To\repo\backend\run-gemini.ps1

 - You can pass values as arguments:
   .\run-gemini.ps1 -GEMINI_API_URL "https://...:generateContent" -GEMINI_API_KEY "KEY"

 - Or just run and you'll be prompted to paste them.

#>

param(
    [string]$GEMINI_API_URL = "",
    [string]$GEMINI_API_KEY = ""
)

if (-not $GEMINI_API_URL -or $GEMINI_API_URL -eq "") {
    $GEMINI_API_URL = Read-Host "Enter GEMINI_API_URL (example: https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent)"
}
if (-not $GEMINI_API_KEY -or $GEMINI_API_KEY -eq "") {
    $GEMINI_API_KEY = Read-Host -AsSecureString "Enter GEMINI_API_KEY (will be masked)"
    # convert secure string to plain text for this session
    $ptr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($GEMINI_API_KEY)
    try { $GEMINI_API_KEY = [System.Runtime.InteropServices.Marshal]::PtrToStringBSTR($ptr) } finally { [System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($ptr) }
}

# Move to script folder (backend)
Set-Location $PSScriptRoot

Write-Host "Starting backend with GEMINI_API_URL and GEMINI_API_KEY set in this session..." -ForegroundColor Cyan

$env:GEMINI_API_URL = $GEMINI_API_URL
$env:GEMINI_API_KEY = $GEMINI_API_KEY

Write-Host "GEMINI_API_URL=" -NoNewline; Write-Host $env:GEMINI_API_URL -ForegroundColor Yellow
Write-Host "(GEMINI_API_KEY is set in env for this session)"

Write-Host "Running: .\mvnw.cmd spring-boot:run" -ForegroundColor Green
.\mvnw.cmd spring-boot:run
