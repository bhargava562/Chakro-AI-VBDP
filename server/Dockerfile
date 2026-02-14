# =================================
# Server Dockerfile (Spring Boot)
# Multi-stage build
# =================================

# ---------- Stage 1: Build ----------
FROM eclipse-temurin:25-jdk AS build

WORKDIR /app

# Copy Maven wrapper and POM first (layer caching)
COPY .mvn/ .mvn/
COPY mvnw pom.xml ./

# Download dependencies (cached unless pom.xml changes)
RUN chmod +x mvnw && ./mvnw dependency:resolve -B

# Copy source code
COPY src/ src/

# Build the fat JAR
RUN ./mvnw package -DskipTests -B

# ---------- Stage 2: Runtime ----------
FROM eclipse-temurin:25-jre AS runtime

WORKDIR /app

# Create non-root user for security
RUN groupadd -r chakro && useradd -r -g chakro -s /bin/false chakro

# Copy the built JAR
COPY --from=build /app/target/*.jar app.jar

# Set ownership
RUN chown -R chakro:chakro /app

USER chakro

EXPOSE 8080

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080/actuator/health || exit 1

ENTRYPOINT ["java", \
    "-XX:+UseZGC", \
    "-XX:MaxRAMPercentage=75.0", \
    "-Djava.security.egd=file:/dev/./urandom", \
    "-jar", "app.jar"]
