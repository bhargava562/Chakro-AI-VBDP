# Chakro AI

> Intelligent AI-powered platform built with Spring Boot and React.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Java](https://img.shields.io/badge/Java-25-orange.svg)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.0-green.svg)
![React](https://img.shields.io/badge/React-19-blue.svg)

---

## Tech Stack

| Layer        | Technology                                          |
|--------------|-----------------------------------------------------|
| **Backend**  | Spring Boot 4.0, Java 25, Spring AI, Spring WebMVC  |
| **Frontend** | React 19, Vite 7, TailwindCSS 4, TypeScript         |
| **Database** | PostgreSQL 16 + pgvector                             |
| **Cache**    | Redis                                                |
| **Monitoring** | Prometheus, Grafana, OpenTelemetry, Micrometer     |
| **Migration**| Flyway                                               |
| **Infra**    | Docker, Nginx                                        |

---

## Prerequisites

- **Docker** & **Docker Compose** (v2)
- **JDK 25** (for local development)
- **Node.js 22+** (for local frontend development)
- **Maven** (or use the included `mvnw` wrapper)

---

## Quick Start

```bash
# 1. Clone the repository
git clone https://github.com/YOUR_USERNAME/chakro.git
cd chakro

# 2. Set up environment variables
cp env/.env.example env/.env.production
# Edit env/.env.production with your values

# 3. Start all services
make up

# 4. Access the application
# App:        http://localhost
# Grafana:    http://localhost:3001  (admin / admin)
# Prometheus: http://localhost:9090
```

---

## Development Setup

### Backend (Spring Boot)

```bash
cd server
./mvnw spring-boot:run
```

The server uses Spring Boot Docker Compose support — it will automatically start PostgreSQL, Redis, and Grafana LGTM via `server/compose.yaml`.

### Frontend (React + Vite)

```bash
cd client
npm install
npm run dev
```

---

## Project Structure

```
├── client/          # React/Vite frontend application
├── server/          # Spring Boot backend application
├── deploy/          # Docker Compose & Nginx configs
├── monitoring/      # Prometheus & Grafana provisioning
├── env/             # Environment variable templates
├── docs/            # Architecture, deployment & contributing docs
├── Makefile         # Convenience commands
└── README.md
```

See [`docs/`](docs/) for detailed documentation:
- [Architecture](docs/architecture.md)
- [Deployment](docs/deployment.md)
- [Monitoring](docs/monitoring.md)
- [Contributing](docs/contributing.md)

---

## Makefile Commands

| Command        | Description                                      |
|----------------|--------------------------------------------------|
| `make build`   | Build all Docker images                          |
| `make up`      | Start all services in detached mode              |
| `make down`    | Stop all services                                |
| `make logs`    | Tail logs from all services                      |
| `make restart` | Restart all services                             |
| `make clean`   | Stop services and remove volumes                 |
| `make status`  | Show running container status                    |

---

## License

This project is licensed under the [MIT License](LICENSE).
