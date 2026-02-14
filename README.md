<div align="center">

# ⚙️ Chakro AI
**The Enterprise Multi-Agent Virtual Business Development Partner**

[![Java](https://img.shields.io/badge/Java-25-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)](https://www.java.com/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.2-6DB33F?style=for-the-badge&logo=spring-boot&logoColor=white)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![LangChain4j](https://img.shields.io/badge/LangChain4j-1.11.0-blue?style=for-the-badge&logo=chainlink&logoColor=white)](https://github.com/langchain4j/langchain4j)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-pgvector-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

*Democratizing high-value project acquisition for Indian MSMEs through orchestrated, agentic AI.*

[Explore the Docs](#) · [Report Bug](#) · [Request Feature](#)

</div>

---

## 📖 Overview

**Chakro AI** is a cutting-edge, human-in-the-loop Agentic AI platform engineered to automate the entire business development and tender acquisition lifecycle. Operating as a digital extension of an SME's core team, Chakro AI orchestrates a specialized hierarchy of autonomous agents to discover, validate, analyze, and draft proposals for government and corporate tenders.

Built with an unyielding focus on backend engineering, the platform leverages the lightweight concurrency of **Java 25 Virtual Threads**, the robust ecosystem of **Spring Boot 4.0**, and the advanced RAG capabilities of **LangChain4j** powered by IBM Granite LLMs.



---

## ✨ The Agentic Ecosystem

Chakro AI moves beyond single-prompt interfaces by utilizing a highly specialized multi-agent hierarchy orchestrated by a central **CEO Agent**.

<table>
  <tr>
    <td align="center" width="20%"><img src="https://img.icons8.com/fluency/64/000000/radar.png" alt="Discovery"/></td>
    <td><b>The Discovery Agent</b><br/>Continuously monitors 500+ fragmented government (GeM, NeGP) and corporate portals in real-time, matching opportunities to specific MSME profiles.</td>
  </tr>
  <tr>
    <td align="center"><img src="https://img.icons8.com/fluency/64/000000/security-checked.png" alt="Security"/></td>
    <td><b>The Security Agent</b><br/>Executes a rigorous zero-trust protocol. Validates SSL/TLS certificates, cross-references domain reputation, and mitigates prompt injection vulnerabilities before data ingestion.</td>
  </tr>
  <tr>
    <td align="center"><img src="https://img.icons8.com/fluency/64/000000/document.png" alt="Analysis"/></td>
    <td><b>The Analysis Agent</b><br/>Leverages a pgvector-backed RAG pipeline to deconstruct hundreds of pages of dense legal and technical jargon into actionable compliance and eligibility matrices.</td>
  </tr>
  <tr>
    <td align="center"><img src="https://img.icons8.com/fluency/64/000000/rocket.png" alt="Response"/></td>
    <td><b>The Response Agent</b><br/>Synthesizes analyzed data to auto-generate highly compliant, competitive draft proposals, seamlessly integrating into a collaborative React 19 rich-text workspace for human review.</td>
  </tr>
</table>

---

## 🏗️ Enterprise Tech Stack

### Backend & AI Capabilities
* **Core:** Java 25 & Spring Boot 4.0.2
* **AI Orchestration:** LangChain4j (v1.11.0-beta19)
* **LLM Engine:** IBM Granite (Optimized for enterprise reasoning)
* **Database & Migrations:** PostgreSQL + `pgvector` + Spring Boot Flyway (Auto-schema generation)
* **Caching & Queues:** Redis
* **Observability:** Micrometer + OpenTelemetry + ELK Stack

### Frontend Studio
* **Framework:** React 19 + TypeScript + Vite
* **Routing & State:** TanStack Router & React Query + Zustand
* **Real-Time Data:** SockJS + STOMP (WebSockets)
* **Document UI:** React-PDF & TipTap (Human-in-the-loop editors)

---

## 🚀 Getting Started

Chakro AI is designed for immediate "clone-and-use" developer onboarding. Through the power of Docker Compose and Flyway, spinning up the complete distributed platform requires zero manual database configuration.

### Prerequisites
* [Docker](https://docs.docker.com/get-docker/) & Docker Compose
* [Git](https://git-scm.com/)
* API Key for IBM Granite / chosen LLM provider

### 2-Step Installation

**1. Clone the repository and configure your environment:**
```bash
git clone [https://github.com/your-username/chakro-ai.git](https://github.com/your-username/chakro-ai.git)
cd chakro-ai
cp .env.example .env
# Add your LLM_API_KEY to the .env file

```

**2. Deploy the Enterprise Stack:**

```bash
docker-compose up -d --build

```

**What happens next?**

1. Docker provisions the **PostgreSQL `pgvector` database** and **Redis** cache.
2. The **Spring Boot 4.0 backend** starts, and **Flyway** instantly executes the migration scripts to build all necessary schemas, tables, and vector dimensions.
3. The **React 19 Vite server** compiles the frontend.
4. Access the multi-agent studio at `http://localhost:3000`.

---

## 📂 Repository Structure

```text
chakro-ai/
├── 🐳 docker-compose.yml       # Central infrastructure orchestration
├── ⚙️ .env.example             # Environment variable templates
│
├── ☕ backend/                 # Spring Boot + Java 25 Application
│   ├── src/main/java/.../api/    # REST & WebSocket Controllers
│   ├── src/main/java/.../agents/ # LangChain4j AI Services
│   └── src/main/resources/
│       └── db/migration/         # Flyway SQL (V1__Init_Schema.sql)
│
└── ⚛️ frontend/                # React + TypeScript Studio
    ├── src/features/             # Domain-driven UI modules
    ├── src/components/           # Shared TipTap & Form components
    └── src/hooks/                # Custom React Query & WebSocket hooks

```

---

## 🛡️ Security & Compliance

Chakro AI is built with platform engineering best practices. The internal `Security Agent` acts as a firewall against malicious data sources, while the backend relies on robust Spring Security configurations to manage session integrity and API rate limiting via Redis.

---

<div align="center">
<p>Engineered with ❤️ for the future of Agentic AI and India's MSME ecosystem.</p>
<p>
<img src="https://www.google.com/search?q=https://img.icons8.com/color/48/000000/java-coffee-cup-logo--v1.png" alt="Java"/>
<img src="https://www.google.com/search?q=https://img.icons8.com/color/48/000000/spring-logo.png" alt="Spring"/>
<img src="https://www.google.com/search?q=https://img.icons8.com/color/48/000000/react-native.png" alt="React"/>
</p>
</div>
