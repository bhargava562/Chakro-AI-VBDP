#!/usr/bin/env bash
# =============================================
# Chakro — One-Command Setup Script (Linux/Mac)
# =============================================
# Usage: ./scripts/setup.sh
#
# This script:
#   1. Copies env template if .env.production doesn't exist
#   2. Installs client dependencies
#   3. Starts all Docker services (DB included)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$ROOT_DIR"

echo "============================================="
echo "  Chakro AI — Setup"
echo "============================================="
echo ""

# ---- Step 1: Environment file ----
if [ ! -f "env/.env.production" ]; then
    echo "📋 Creating env/.env.production from template..."
    cp env/.env.production.example env/.env.production
    echo "   ⚠️  Edit env/.env.production with your actual secrets before production use!"
    echo ""
fi

# ---- Step 2: Check Docker ----
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop first."
    echo "   https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info &> /dev/null 2>&1; then
    echo "❌ Docker daemon is not running. Please start Docker Desktop."
    exit 1
fi

echo "✅ Docker is running"
echo ""

# ---- Step 3: Install client dependencies (for local dev) ----
if [ -d "client" ]; then
    echo "📦 Installing client dependencies..."
    cd client
    npm ci --silent
    cd "$ROOT_DIR"
    echo "✅ Client dependencies installed"
    echo ""
fi

# ---- Step 4: Start all services ----
echo "🚀 Starting all services (this may take a few minutes on first run)..."
echo ""
docker compose -f deploy/docker-compose.yml --env-file env/.env.production up -d --build

echo ""
echo "============================================="
echo "  ✅ Setup Complete!"
echo "============================================="
echo ""
echo "  App:        http://localhost"
echo "  API:        http://localhost:8080"
echo "  Grafana:    http://localhost:3001  (admin/admin)"
echo "  Prometheus: http://localhost:9090"
echo ""
echo "  Useful commands:"
echo "    make logs      — View logs"
echo "    make status    — Container status"
echo "    make down      — Stop services"
echo ""
