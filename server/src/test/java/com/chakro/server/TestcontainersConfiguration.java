package com.chakro.server;

import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.boot.testcontainers.service.connection.ServiceConnection;
import org.springframework.context.annotation.Bean;
import org.testcontainers.containers.GenericContainer;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.utility.DockerImageName;

@TestConfiguration(proxyBeanMethods = false)
class TestcontainersConfiguration {

	@Bean
	@ServiceConnection
	PostgreSQLContainer<?> postgresContainer() {
		return new PostgreSQLContainer<>("postgres:16-alpine");
	}

	@Bean
	@ServiceConnection
	GenericContainer<?> grafanaLgtmContainer() {
		return new GenericContainer<>(DockerImageName.parse("grafana/otel-lgtm:latest"))
			.withExposedPorts(3000);
	}

	@Bean
	@ServiceConnection
	GenericContainer<?> pgvectorContainer() {
		return new GenericContainer<>(DockerImageName.parse("pgvector/pgvector:pg16"))
			.withExposedPorts(5432);
	}

	@Bean
	@ServiceConnection(name = "redis")
	GenericContainer<?> redisContainer() {
		return new GenericContainer<>(DockerImageName.parse("redis:latest")).withExposedPorts(6379);
	}

}
