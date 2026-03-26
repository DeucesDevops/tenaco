# ── Builder: compile with Maven ───────────────────────────────────────────────
FROM maven:3.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Cache dependency downloads — re-run only when pom.xml changes
COPY pom.xml .
RUN mvn dependency:go-offline -q

# Compile and package (skip tests — tests run in CI before this step)
COPY src ./src
RUN mvn package -DskipTests -q


# ── Runner: minimal JRE image ─────────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine AS runner
RUN addgroup -S app && adduser -S app -G app

WORKDIR /app

COPY --from=builder --chown=app:app /app/target/*.jar app.jar

USER app

EXPOSE 8080

HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
  CMD wget -qO- http://localhost:8080/actuator/health || exit 1

CMD ["java", "-jar", "app.jar"]
