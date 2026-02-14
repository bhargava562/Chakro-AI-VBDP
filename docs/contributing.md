# Contributing to Chakro

Thank you for contributing! Please follow these guidelines.

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/chakro.git`
3. Create a feature branch: `git checkout -b feature/your-feature`
4. Set up dev environment (see [README](../README.md))

## Branch Naming

| Type       | Format                     | Example                        |
|------------|----------------------------|--------------------------------|
| Feature    | `feature/description`      | `feature/user-auth`            |
| Bug fix    | `fix/description`          | `fix/login-redirect`           |
| Hotfix     | `hotfix/description`       | `hotfix/null-pointer-crash`    |
| Docs       | `docs/description`         | `docs/api-reference`           |
| Refactor   | `refactor/description`     | `refactor/service-layer`       |

## Commit Conventions

Use [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add user authentication
fix: resolve null pointer in chat service
docs: update deployment guide
refactor: extract AI service interface
chore: update dependencies
test: add unit tests for chat controller
```

## Pull Request Process

1. Update documentation if behavior changes
2. Add tests for new features
3. Ensure all checks pass
4. Request review from a maintainer
5. Squash and merge after approval

## Code Style

- **Java**: Follow Spring Boot conventions, use Lombok annotations
- **TypeScript/React**: Use ESLint config (`npm run lint`)
- **Naming**: descriptive names, no abbreviations
- **Comments**: explain *why*, not *what*

## Development Commands

```bash
# Backend
cd server && ./mvnw spring-boot:run

# Frontend
cd client && npm run dev

# Lint frontend
cd client && npm run lint

# Full stack (Docker)
make up
```
