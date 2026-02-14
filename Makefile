# =============================================
# Chakro — Makefile
# Convenience commands for Docker operations
# =============================================

COMPOSE_FILE := deploy/docker-compose.yml
ENV_FILE     := env/.env.production

.PHONY: build up down logs restart clean status ps

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
