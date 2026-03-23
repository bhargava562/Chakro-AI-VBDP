# Chakro AI — Virtual Business Development Partner (VBDP)

<div align="center">
  <img src="https://img.icons8.com/wired/128/artificial-intelligence.png" alt="Chakro AI Logo" width="128" />
  <br />
  
  [![Build Status](https://github.com/${{ github.repository }}/actions/workflows/ci.yml/badge.svg)](https://github.com/${{ github.repository }}/actions/workflows/ci.yml)
  [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  [![Spring Boot](https://img.shields.io/badge/Spring--Boot-3.5.2-brightgreen.svg)](https://spring.io/projects/spring-boot)
  [![React](https://img.shields.io/badge/React-19.2-blue.svg)](https://react.dev/)
  [![Java](https://img.shields.io/badge/Java-25-orange.svg)](https://openjdk.org/projects/jdk/25/)
  [![Supabase](https://img.shields.io/badge/Database-Supabase-black.svg)](https://supabase.com/)
</div>

---

## 🚀 Overview
**Chakro AI VBDP** is an enterprise-grade AI SaaS platform designed to automate the discovery, security assessment, and technical proposal generation for hackathons and business tenders. By leveraging **Java 25 Virtual Threads** and the **Groq Llama-3** model, Chakro AI provides high-concurrency orchestration of multiple specialized agents.

## 🏗 Architecture

### System Overview
```mermaid
graph TD
    subgraph "Frontend (React + Vite)"
        UI[User Interface]
        Client[API Client]
    end

    subgraph "Backend (Spring Boot)"
        Controller[REST Controllers]
        CEO[Master Agent / CEO]
        
        subgraph "Agent Swarm"
            Discovery[Discovery Agent]
            Security[Security Agent]
            Analysis[Analysis Agent]
            Response[Response Agent]
        end
        
        Orch[Orchestration Service]
    end

    subgraph "Infrastucture"
        DB[(Supabase PostgreSQL)]
        LLM[Groq Llama-3 API]
    end

    UI --> Client
    Client --> Controller
    Controller --> CEO
    CEO --> Orch
    Orch --> Discovery
    Orch --> Security
    Orch --> Analysis
    Orch --> Response
    Discovery & Security & Analysis & Response <--> LLM
    CEO --> DB
```

### Agent Orchestration Flow
```mermaid
sequenceDiagram
    participant User
    participant CEO as Master Agent
    participant D as Discovery
    participant S as Security
    participant A as Analysis
    participant R as Response
    participant DB

    User->>CEO: Search Query
    CEO->>D: Discovery Request
    D->>CEO: Candidates List
    CEO->>S: Security Review
    S->>CEO: Sanitized List
    CEO->>User: Display Results
    
    User->>CEO: Commit / Create Proposal
    CEO->>DB: Store Opportunity
    CEO->>A: analyze Opportunity
    A->>CEO: Analysis Result
    CEO->>R: Generate Proposal
    R->>CEO: Proposal Draft
    CEO->>DB: Store Draft
    CEO->>User: Return Draft (Success)
```

## 🛠 Tech Stack

### Backend
- **Core**: Java 25 (OpenJDK Temurin)
- **Framework**: Spring Boot 3.5.2
- **Concurrency**: Java Virtual Threads (Project Loom)
- **AI Integration**: LangChain4j, Groq Llama-3 API
- **Persistence**: Supabase (PostgreSQL), Flyway Migrations
- **Security**: Spring Security, JWT, BCrypt

### Frontend
- **Framework**: React 19, Vite 7
- **Styling**: Tailwind CSS 4, Framer Motion
- **UI Components**: Radix UI, Shadcn UI (variants)
- **State/Routing**: Zustand, React Router

## 📊 Performance & Metrics

| Component | Concurrency Model | Avg. Response Time | Optimization |
| :--- | :--- | :--- | :--- |
| **Discovery Agent** | Virtual Threads | ~2.5s (8 URLs) | Parallel Scrapping |
| **Security Agent** | Virtual Threads | ~1.2s | Parallel LLM Validation |
| **Analysis Agent** | Sequential/Async | ~3.0s | Token-optimized Prompts |
| **Response Agent** | Sequential/Async | ~4.5s | Structured Output |
| **Global API** | Non-blocking I/O | < 200ms | Virtual Thread Executor |

### Monitoring
- **Actuator**: Health, Metrics, and Info endpoints.
- **MicroMeter**: Integrated with Prometheus for real-time monitoring.

## 🛡 Security & Best Practices
- **Secret Management**: All sensitive keys (`GROQ_API_KEY`, `JWT_SECRET`) are externalized to environment variables.
- **Commit-Only Logic**: Personal data and opportunities are only persisted upon explicit user command to ensure data privacy and prevent spam.
- **Dependency Audit**: Regular screening for vulnerabilities (CVEs) and utilizing stable LTS versions of core libraries.

---
<p align="center">
  Built with ❤️ by the Chakro AI Team.
</p>
