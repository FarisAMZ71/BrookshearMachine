<#  setup.ps1 ── Windows one-shot bootstrap for Flask + React project
    • Installs Chocolatey (if missing)
    • Installs Node LTS + npm  and Python 3
    • Runs npm ci   in  .\frontend
    • Creates venv  in  .\venv
    • pip install -r backend\requirements.txt
#>

param(
    [string]$FrontEndPath = "frontend",
    [string]$BackEndReq   = "backend\requirements.txt"
)

# ───────────────────────────────────────────────────────────────────
function Write-Info($msg) { Write-Host "▶ $msg" -ForegroundColor Cyan }
function Abort($msg)      { Write-Host "✖ $msg" -ForegroundColor Red; exit 1 }

# 0.  Require Administrator rights for Chocolatey installs
If (-not ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)) {
    Abort "Run PowerShell **as Administrator** (right-click → Run as administrator)"
}

# 1.  Chocolatey
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Info "Installing Chocolatey…"
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
} else {
    Write-Info "Chocolatey already installed"
}

# 2.  Node LTS + Python via Choco (re-run is safe)
Write-Info "Installing / upgrading Node LTS and Python…"
choco upgrade -y nodejs-lts python

# 3.  Verify tools
Write-Info "node/npm versions:"
node -v; npm -v
Write-Info "python version:"
python --version

# 4.  NPM dependencies
$frontend = Join-Path $PWD $FrontEndPath
if (!(Test-Path $frontend\package.json)) { Abort "Cannot find package.json in $frontend" }
Write-Info "Installing JS deps (npm ci) in $FrontEndPath…"
Push-Location $frontend
npm ci
Pop-Location

# 5.  Python venv + pip deps
Write-Info "Creating venv (.\venv)…"
python -m venv venv
& .\venv\Scripts\Activate.ps1
Write-Info "Upgrading pip + wheel"
pip install --upgrade pip wheel

$reqFile = Join-Path $PWD $BackEndReq
if (!(Test-Path $reqFile)) { Abort "Cannot find requirements.txt at $reqFile" }
Write-Info "Installing backend dependencies (pip)…"
pip install -r $reqFile
# & .\venv\Scripts\deactivate

Write-Host ""
Write-Host "✅  DONE!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:"
Write-Host "1)  .\venv\Scripts\Activate" -ForegroundColor Yellow
Write-Host "2)  npm run dev          # or whatever script starts Flask + React" -ForegroundColor Yellow
Write-Host ""
