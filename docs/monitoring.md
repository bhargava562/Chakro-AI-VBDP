# Monitoring Guide

## Overview

Chakro uses **Prometheus** for metrics collection and **Grafana** for visualization, with **Micrometer** instrumentation inside the Spring Boot application.

```
Spring Boot (Actuator) → /actuator/prometheus → Prometheus (scrape) → Grafana (visualize)
```

## Accessing Dashboards

| Service    | URL                   | Default Credentials |
|------------|-----------------------|---------------------|
| Grafana    | http://localhost:3001 | admin / admin       |
| Prometheus | http://localhost:9090 | —                   |

## Pre-Built Dashboard

The **Chakro — Spring Boot Dashboard** is auto-provisioned and includes:

| Panel                  | What It Shows                                    |
|------------------------|--------------------------------------------------|
| HTTP Request Rate      | Requests per second by method, URI, status        |
| HTTP Response Time     | p95 latency by endpoint                           |
| JVM Heap Memory        | Used vs max heap per memory pool                  |
| JVM CPU Usage          | Process CPU utilization gauge                     |
| System CPU Usage       | System-wide CPU utilization gauge                 |
| Active Threads         | Live and daemon thread counts                     |
| DB Connection Pool     | HikariCP active, idle, pending connections        |
| Redis Operations       | Repository invocation rates                       |
| JVM GC Pause Time      | Garbage collection pause durations                |

## Adding Custom Metrics

In your Spring Boot service, inject `MeterRegistry`:

```java
@Service
public class MyService {
    private final Counter myCounter;

    public MyService(MeterRegistry registry) {
        this.myCounter = Counter.builder("my.custom.counter")
            .description("Counts something important")
            .tag("type", "example")
            .register(registry);
    }

    public void doWork() {
        myCounter.increment();
    }
}
```

The metric will automatically appear in Prometheus and can be queried in Grafana.

## Key Prometheus Queries

```promql
# Request rate by endpoint
rate(http_server_requests_seconds_count[5m])

# p99 latency
histogram_quantile(0.99, sum(rate(http_server_requests_seconds_bucket[5m])) by (le))

# JVM memory usage percentage
jvm_memory_used_bytes{area="heap"} / jvm_memory_max_bytes{area="heap"}

# Error rate
sum(rate(http_server_requests_seconds_count{status=~"5.."}[5m]))
```

## Alerting (Future)

To add Prometheus alerting, create `monitoring/prometheus/alerts.yml` and reference it in `prometheus.yml`:

```yaml
rule_files:
  - alerts.yml
```
