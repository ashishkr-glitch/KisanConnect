<#
  start-backend-with-key.ps1

  Prompts securely for GEMINI_API_KEY then runs the Spring Boot backend
  with that API key set in the current process environment. The key is
  not written to disk by this script.

  Usage (PowerShell):
    cd backend
    .\start-backend-with-key.ps1

  After the backend process exits, the environment variable will be cleared
#>

Write-Host "This script will prompt for your GEMINI_API_KEY and start the backend (mvnw)."
$secure = Read-Host -Prompt "Enter GEMINI_API_KEY (input hidden)" -AsSecureString

# Convert SecureString to plain text for the lifetime of this process only
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($secure)
$key = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)
[System.Runtime.InteropServices.Marshal]::ZeroFreeBSTR($bstr)

if (-not $key) {
  Write-Error "No key entered. Aborting."
  exit 1
}

$env:GEMINI_API_KEY = $key
Write-Host "GEMINI_API_KEY set in this shell. Starting backend..."

try {
  & .\mvnw.cmd spring-boot:run
} finally {
  # Clear the env var when mvnw finishes
  Remove-Item Env:GEMINI_API_KEY -ErrorAction SilentlyContinue
  Write-Host "GEMINI_API_KEY cleared from session. Backend stopped or exited."
}
