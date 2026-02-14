# Deployment Guide

## Prerequisites

- Docker Engine 24+ and Docker Compose v2
- At least 4 GB RAM available for containers
- Ports 80, 3001, 5432, 6379, 8080, 9090 available

## Quick Deploy

```bash
# 1. Clone the repo
git clone https://github.com/YOUR_USERNAME/chakro.git && cd chakro

# 2. Create production environment file
cp env/.env.production.example env/.env.production
# Edit with strong passwords

# 3. Build and start
make up

# 4. Verify
make status
```

## Services & Ports

| Service    | Internal Port | Default External Port | URL                    |
|------------|---------------|----------------------|------------------------|
| Client     | 80            | 80                   | http://localhost       |
| Server     | 8080          | 8080                 | http://localhost:8080  |
| PostgreSQL | 5432          | 5432                 | —                      |
| Redis      | 6379          | 6379                 | —                      |
| Prometheus | 9090          | 9090                 | http://localhost:9090  |
| Grafana    | 3000          | 3001                 | http://localhost:3001  |

## Environment Configuration

All environment variables are managed in the `env/` directory:

| File                       | Purpose                           | Commit? |
|----------------------------|-----------------------------------|---------|
| `.env.example`             | Full variable reference           | ✅      |
| `.env.development`         | Dev defaults (safe values)        | ✅      |
| `.env.production.example`  | Prod template (empty passwords)   | ✅      |
| `.env.production`          | Actual prod secrets               | ❌      |

## Common Operations

```bash
make up        # Start all services
make down      # Stop all services
make logs      # Tail service logs
make restart   # Restart everything
make clean     # Stop + remove volumes (DESTRUCTIVE)
make status    # Show container health
```

## Production Hardening Checklist

- [ ] Set strong, unique passwords in `.env.production`
- [ ] Restrict Actuator endpoints (update nginx conf)
- [ ] Enable TLS/SSL (add certs to nginx)
- [ ] Set up external backup for PostgreSQL volumes
- [ ] Configure log rotation
- [ ] Set Grafana `allow_sign_up: false` (default)
- [ ] Use Docker secrets or Vault for sensitive values
