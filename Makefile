# =============================================
# Chakro — Makefile
# Convenience commands for Docker operations
# =============================================

COMPOSE_FILE := deploy/docker-compose.yml
ENV_FILE     := env/.env.production

.PHONY: build up down logs restart clean status ps setup dev-server dev-client db-shell

## Build all Docker images
build:
	docker compose -f $(COMPOSE_FILE) build

## Start all services (detached)
up:
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) up -d --build

## Stop all services
down:
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) down

## Tail logs from all services
logs:
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) logs -f

## Restart all services
restart: down up

## Stop services and remove volumes (DESTRUCTIVE)
clean:
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) down -v --remove-orphans

## Show container status
status:
	docker compose -f $(COMPOSE_FILE) --env-file $(ENV_FILE) ps

ps: status

## One-command setup (copies env, installs deps, starts services)
setup:
ifeq ($(OS),Windows_NT)
	powershell -ExecutionPolicy Bypass -File scripts/setup.ps1
else
	bash scripts/setup.sh
endif

## Run server locally (dev mode)
dev-server:
	cd server && ./mvnw spring-boot:run

## Run client locally (dev mode)
dev-client:
	cd client && npm run dev

## Open PostgreSQL shell
db-shell:
	docker exec -it chakro-postgres psql -U $${POSTGRES_USER:-chakro} -d $${POSTGRES_DB:-chakro}

