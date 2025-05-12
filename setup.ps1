<#  setup.ps1  ── bootstrap Node + npm deps (incl. concurrently) + Python venv
    • Installs Chocolatey if needed
    • Installs / upgrades Node LTS + Python 3
    • npm ci   in <frontendPath>
    • adds concurrently (npm install --save-dev concurrently) if it is not present
    • python -m venv   venv      &&  pip install -r <requirementsFile>
#>

param(
    [string]$frontEndPath  = "frontend",                   # adjust if needed
    [string]$requirements  = "backend\requirements.txt"    # "
)

# ── helper ────────────────────────────────────────────────────────────────
function Write-Info  ($msg) { Write-Host "▶ $msg" -ForegroundColor Cyan }
function Write-ErrorMsg ($msg) { Write-Host "✖ $msg" -ForegroundColor Red }
function Abort ($msg) { Write-ErrorMsg $msg; exit 1 }

# ── require admin (Chocolatey installs) ──────────────────────────────────
If (-not ([Security.Principal.WindowsPrincipal] `
    [Security.Principal.WindowsIdentity]::GetCurrent() `
    ).IsInRole([Security.Principal.WindowsBuiltinRole]::Administrator)) {
    Abort "Run PowerShell **as Administrator**."
}

# ── Chocolatey ───────────────────────────────────────────────────────────
if (!(Get-Command choco -ErrorAction SilentlyContinue)) {
    Write-Info "Installing Chocolatey…"
    Set-ExecutionPolicy Bypass -Scope Process -Force
    [System.Net.ServicePointManager]::SecurityProtocol = 3072
    Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
} else { Write-Info "Chocolatey already present." }

# ── Node LTS + Python via choco ──────────────────────────────────────────
Write-Info "Installing / upgrading Node LTS and Python 3…"
choco upgrade -y nodejs-lts python

# refresh PATH for this session
$env:Path += ";$([Environment]::GetEnvironmentVariable('Path','Machine'))"

Write-Info "Node / npm versions:"
node -v; npm -v
Write-Info "Python version:"
python --version

# ── Front-end JS dependencies ────────────────────────────────────────────
$fe = Join-Path $PWD $frontEndPath
if (!(Test-Path "$fe\package.json")) { Abort "package.json not found in $fe" }

Write-Info "Running npm ci in $frontEndPath…"
Push-Location $fe
npm ci

# ensure concurrently exists (devDependency)
$needsConcurrently = -not (npm ls concurrently --depth=0 --json | ConvertFrom-Json).dependencies
if ($needsConcurrently) {
    Write-Info "Adding concurrently (dev-dependency)…"
    npm install --save-dev concurrently
} else {
    Write-Info "concurrently already listed in package.json"
}
Pop-Location

# ── Python venv + backend deps ───────────────────────────────────────────
Write-Info "Creating Python virtual env (.\venv)…"
python -m venv venv
& .\venv\Scripts\Activate.ps1
pip install --upgrade pip wheel

$req = Join-Path $PWD $requirements
if (!(Test-Path $req)) { Abort "requirements.txt not found at $req" }

Write-Info "Installing backend requirements…"
pip install -r $req
& .\venv\Scripts\Deactivate.ps1

# ── Finish ───────────────────────────────────────────────────────────────
Write-Host ""
Write-Host "✅  Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "  1)  .\\venv\\Scripts\\Activate" -ForegroundColor Yellow
Write-Host "  2)  npm run dev           (front-end + back-end together)" -ForegroundColor Yellow
Write-Host ""
