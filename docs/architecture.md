# Architecture

## System Overview

Chakro AI is a monorepo with a Spring Boot backend and React frontend, backed by PostgreSQL (with pgvector for AI embeddings), Redis for caching, and a full observability stack.

```mermaid
graph TB
    subgraph Client
        React["React 19 + Vite"]
    end

    subgraph Nginx["Nginx (Reverse Proxy)"]
        Static["Static Assets"]
        Proxy["/api/* → Server"]
        WS["/ws → WebSocket"]
    end

    subgraph Server["Spring Boot 4.0"]
        Controllers["REST Controllers"]
        AI["Spring AI"]
        Services["Business Logic"]
        Actuator["Actuator + Metrics"]
    end

    subgraph DataStores
        PG["PostgreSQL 16 + pgvector"]
        Redis["Redis"]
    end

    subgraph Monitoring
        Prometheus["Prometheus"]
        Grafana["Grafana"]
    end

    React --> Nginx
    Nginx --> Server
    Server --> PG
    Server --> Redis
    Actuator --> Prometheus
    Prometheus --> Grafana
```

## Component Responsibilities

| Component     | Purpose                                                  |
|---------------|----------------------------------------------------------|
| `client/`     | React SPA — UI, routing (TanStack Router), state (Zustand), forms (React Hook Form) |
| `server/`     | Spring Boot API — REST endpoints, AI inference, business logic |
| `deploy/`     | Production infrastructure — Docker Compose, Nginx        |
| `monitoring/` | Observability — Prometheus scraping, Grafana dashboards   |
| `env/`        | Environment config — templates for dev and prod           |

## Data Flow

1. **User** → Nginx (port 80) → serves React SPA
2. **React** → Nginx `/api/*` → reverse proxy → **Spring Boot** (port 8080)
3. **Spring Boot** → PostgreSQL (data + pgvector embeddings)
4. **Spring Boot** → Redis (caching, sessions)
5. **Spring Boot Actuator** → Prometheus → Grafana (metrics)
6. **WebSocket** → Nginx `/ws` → Spring Boot (STOMP via SockJS)

## Tech Stack Details

- **Spring AI** — AI/ML model integration with vector store (pgvector)
- **Flyway** — Database schema migrations
- **Micrometer** — Metrics instrumentation (Prometheus registry)
- **OpenTelemetry** — Distributed tracing
- **TailwindCSS 4** — Utility-first CSS framework
- **TanStack Query** — Server state management
- **Tiptap** — Rich text editor
