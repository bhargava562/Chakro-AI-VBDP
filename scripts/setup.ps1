# =============================================
# Chakro — One-Command Setup Script (Windows)
# =============================================
# Usage: .\scripts\setup.ps1
#
# This script:
#   1. Copies env template if .env.production doesn't exist
#   2. Installs client dependencies
#   3. Starts all Docker services (DB included)

$ErrorActionPreference = "Stop"

$RootDir = Split-Path -Parent $PSScriptRoot
Set-Location $RootDir

Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "  Chakro AI - Setup" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""

# ---- Step 1: Environment file ----
if (-not (Test-Path "env\.env.production")) {
    Write-Host "Copying env template..." -ForegroundColor Yellow
    Copy-Item "env\.env.production.example" "env\.env.production"
    Write-Host "  WARNING: Edit env\.env.production with your actual secrets before production use!" -ForegroundColor Red
    Write-Host ""
}

# ---- Step 2: Check Docker ----
try {
    $null = Get-Command docker -ErrorAction Stop
    $dockerInfo = docker info 2>&1
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Docker daemon is not running. Please start Docker Desktop." -ForegroundColor Red
        exit 1
    }
    Write-Host "Docker is running" -ForegroundColor Green
} catch {
    Write-Host "Docker is not installed. Please install Docker Desktop first." -ForegroundColor Red
    Write-Host "  https://docs.docker.com/get-docker/" -ForegroundColor Gray
    exit 1
}
Write-Host ""

# ---- Step 3: Install client dependencies ----
if (Test-Path "client") {
    Write-Host "Installing client dependencies..." -ForegroundColor Yellow
    Push-Location client
    npm ci --silent
    Pop-Location
    Write-Host "Client dependencies installed" -ForegroundColor Green
    Write-Host ""
}

# ---- Step 4: Start all services ----
Write-Host "Starting all services (this may take a few minutes on first run)..." -ForegroundColor Yellow
Write-Host ""
docker compose -f deploy/docker-compose.yml --env-file env/.env.production up -d --build

Write-Host ""
Write-Host "=============================================" -ForegroundColor Green
Write-Host "  Setup Complete!" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green
Write-Host ""
Write-Host "  App:        http://localhost"
Write-Host "  API:        http://localhost:8080"
Write-Host "  Grafana:    http://localhost:3001  (admin/admin)"
Write-Host "  Prometheus: http://localhost:9090"
Write-Host ""
Write-Host "  Useful commands:"
Write-Host "    make logs      - View logs"
Write-Host "    make status    - Container status"
Write-Host "    make down      - Stop services"
Write-Host ""
