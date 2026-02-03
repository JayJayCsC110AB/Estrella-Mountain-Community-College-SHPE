# install-and-run-frontend.ps1
# Simple helper to install dependencies and run the dev server for the frontend.

Set-StrictMode -Version Latest

function Check-Command($cmd) {
    $null -ne (Get-Command $cmd -ErrorAction SilentlyContinue)
}

if (-not (Check-Command node)) {
    Write-Host "Node.js not found. Please install Node.js (LTS) from https://nodejs.org/ or use winget: `winget install OpenJS.NodeJS.LTS`" -ForegroundColor Yellow
    exit 1
}

Write-Host "Node found: " (node -v)

Push-Location frontend
try {
    if (-not (Test-Path node_modules)) {
        Write-Host "Running npm install..."
        npm install
    }
    Write-Host "Starting dev server..."
    npm run dev
} finally {
    Pop-Location
}
