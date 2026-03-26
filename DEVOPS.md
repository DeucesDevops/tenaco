# Tenaco — DevOps Explained for Beginners

This document walks through every layer of the DevOps setup for Tenaco — a Property Management SaaS built with Spring Boot and Next.js — from writing code to running it live on the internet.

---

## The Big Picture

```
You write code
     ↓
GitHub Actions builds and tests it      (CI — Continuous Integration)
     ↓
Docker images pushed to GHCR            (the warehouse)
     ↓
Trivy checks for security issues        (customs inspection)
     ↓
ArgoCD sees new image tags in Git       (the delivery driver)
     ↓
Kubernetes runs it on AWS EKS           (the destination building)
     ↓
Prometheus + Grafana watch it live      (the security cameras)
```

---

## Layer 1 — Infrastructure: Terraform

**What it is:** Terraform creates AWS cloud resources by reading `.tf` config files.
You describe what you want — Terraform builds it.

**What it creates:**

| Resource | What it is |
|---|---|
| VPC | A private network — your isolated space in AWS |
| EKS | Kubernetes cluster — the platform that runs your containers |
| Secrets Manager | Vault for database URLs, JWT secrets, mail passwords |

**Note on the database:** Tenaco uses **Neon** — a cloud-managed PostgreSQL service.
This means no RDS is needed in Terraform. Neon handles the database server for you,
just like how Gmail handles email servers. You only manage the app infrastructure.

**File map:**
```
terraform/
├── backend.tf              ← where Terraform saves state (S3 + DynamoDB)
├── variables.tf            ← tunable settings
├── main.tf                 ← wires VPC + EKS + Secrets Manager together
├── outputs.tf              ← prints cluster name after apply
└── modules/
    ├── vpc/                ← VPC, subnets, NAT gateways
    └── eks/                ← EKS cluster + worker nodes + IAM roles
```

**How to use it:**
```bash
cd terraform
terraform init
terraform plan
terraform apply   # takes ~15 min
terraform destroy # tear down when done
```

---

## Layer 2 — Containers: Docker

**What it is:** Docker packages each service — with its runtime, dependencies, and code —
into a portable image that runs the same way everywhere.

**This project has two services to containerize:**

| Image | Tech | Port |
|---|---|---|
| `tenaco-backend` | Spring Boot (Java 17) | 8080 |
| `tenaco-client` | Next.js 15 (Node.js) | 3000 |

**Backend Dockerfile — multi-stage Maven build:**
```
Stage 1 (builder) — Maven 3.9 + JDK 17: downloads dependencies, compiles Java → JAR
Stage 2 (runner)  — JRE 17 Alpine only: copies the JAR, tiny final image
```
The final image is ~80% smaller because the JDK, Maven, and source code aren't included.

**Client Dockerfile — Next.js standalone:**
```
Stage 1 (deps)    — install npm packages
Stage 2 (builder) — next build (produces .next/standalone/)
Stage 3 (runner)  — Node.js Alpine only: runs server.js, no node_modules needed
```
The `output: "standalone"` setting in `next.config.ts` makes Next.js bundle everything
into a self-contained `server.js` — no `node_modules/` required at runtime.

**BACKEND_URL — how the frontend finds the backend:**
In production the Next.js app proxies `/api/*` to the Spring Boot backend.
The destination URL is set at **build time** via the `BACKEND_URL` build arg.
In K8s this is `http://backend:8080` (the K8s service name). In local docker-compose
it's also `http://backend:8080` (the service name in docker-compose).

**Local development:**
```bash
docker-compose up   # starts PostgreSQL + Spring Boot + Next.js
```
Local PostgreSQL is used instead of Neon so developers don't need cloud access.

---

## Layer 3 — CI/CD: GitHub Actions

**Two workflow files:**

### `pr-checks.yml` — Runs on every Pull Request
```
backend job:  mvn verify (compile + unit tests)
frontend job: npm ci → eslint → next build (type-check + build)
```

### `ci-cd.yml` — Runs on push to `main`
```
build-and-push (matrix: backend, client)
  ├── Build backend image → GHCR
  └── Build client image  → GHCR (with BACKEND_URL=http://backend:8080)
          ↓
trivy-scan (matrix: backend, client) — gates GitOps update
  ├── Scan backend for CRITICAL/HIGH CVEs
  └── Scan client for CRITICAL/HIGH CVEs
          ↓
gitops-update
  ├── kustomize edit set image (updates k8s/kustomization.yaml)
  ├── Commit + push to Git
  └── Wait for ArgoCD rollout to complete
```

**Key decisions:**

| Decision | Why |
|---|---|
| GHCR (GitHub Container Registry) | Free with GitHub — no extra registry setup |
| Maven build inside Docker | No Java installed on CI runner — reproducible builds |
| `mvn verify` in PR checks | Compiles + runs tests in one command |
| `next build` in PR checks | TypeScript compiler runs as part of the build |

**Secrets needed:**

| Secret | Value |
|---|---|
| `AWS_DEPLOY_ROLE_ARN` | IAM role for GitHub OIDC (no stored passwords) |

**Variables needed:**

| Variable | Value |
|---|---|
| `AWS_REGION` | e.g. `us-east-1` |
| `EKS_CLUSTER_NAME` | from `terraform output eks_cluster_name` |

---

## Layer 4 — GitOps: ArgoCD

**What it is:** ArgoCD watches Git. When `k8s/kustomization.yaml` gets a new image tag,
ArgoCD automatically syncs the cluster to match.

**File:** `argocd/application.yaml`

**The flow:**
```
ci-cd.yml pushes new SHA tag to kustomization.yaml
             ↓
ArgoCD detects the Git change (polls every 3 min)
             ↓
ArgoCD applies the updated manifests to K8s
             ↓
K8s starts new pods, health probes pass, traffic shifts
             ↓
Old pods terminate
```

**selfHeal = true:** If anyone manually changes something in the cluster (scales down a deployment,
edits a config), ArgoCD will revert it within 3 minutes. Git is the single source of truth.

**One-time setup:**
```bash
kubectl apply -f argocd/application.yaml
```

---

## Layer 5 — Kubernetes: Running the App

**File map:**
```
k8s/
├── namespace.yaml           ← isolated "tenaco" namespace
├── external-secrets.yaml    ← pulls secrets from AWS Secrets Manager
├── backend-deployment.yaml  ← Spring Boot (Deployment + Service + HPA)
├── client-deployment.yaml   ← Next.js (Deployment + Service + HPA)
├── ingress.yaml             ← AWS ALB routes traffic by path
├── monitoring.yaml          ← Prometheus + Alertmanager + Grafana
└── kustomization.yaml       ← image tag registry for ArgoCD
```

**How traffic flows:**
```
User → AWS ALB (ingress)
          ├── /api/*  → backend Service → Spring Boot pod (port 8080)
          └── /*      → client Service  → Next.js pod (port 3000)
                                          └── /api/* rewrites to http://backend:8080
```

**Spring Boot health probes:**
K8s checks `/actuator/health` every 10 seconds. If the JVM crashes or gets stuck,
K8s restarts the pod. Traffic only goes to pods that pass the health check.

**HPA — Horizontal Pod Autoscaler:**
When CPU on the backend exceeds 70%, K8s adds more pods — up to 6.
When traffic drops, it scales back to 2. You pay for what you use.

**External Secrets (no passwords in Git):**
```
AWS Secrets Manager: { DATABASE_URL, JWT_SECRET, MAIL_PASSWORD, ... }
      ↓ External Secrets Operator pulls every 1 hour
K8s Secret: tenaco-secrets
      ↓ injected as environment variables
Spring Boot reads DATABASE_URL, JWT_SECRET, etc.
```

---

## Layer 6 — Observability: Prometheus + Grafana + Alertmanager

**How metrics work in Spring Boot (different from Node.js!):**

Spring Boot has a built-in library called **Spring Boot Actuator**.
Add two dependencies to `pom.xml`:
- `spring-boot-starter-actuator` — exposes `/actuator/health` and `/actuator/prometheus`
- `micrometer-registry-prometheus` — formats metrics in Prometheus format

**No custom code needed.** Actuator automatically tracks:
- HTTP request rate, latency, error rate (by URL, method, status code)
- JVM heap memory, GC pause times, thread counts
- Database connection pool usage
- Application uptime

This is one of the biggest advantages of Spring Boot over Node.js for observability —
batteries included.

**Alert rules configured:**

| Alert | Trigger |
|---|---|
| BackendDown | Backend unreachable for 2 minutes |
| HighRestartRate | Pods restarting more than once per 15 min |
| HighHttpErrorRate | More than 5% of requests returning 5xx |
| HighP95Latency | p95 response time above 2 seconds |
| HighJvmHeapUsage | JVM heap above 85% |
| HighGcPause | Average GC pause above 500ms |

**Pre-built Grafana dashboards:**

| Dashboard | Panels |
|---|---|
| HTTP Overview | Request rate, error rate, p50/p95/p99 latency, backend up/down |
| JVM Runtime | Heap used, heap %, GC pause rate, active threads |

**To access locally:**
```bash
kubectl port-forward svc/grafana      -n tenaco 3001:3000
kubectl port-forward svc/prometheus   -n tenaco 9090:9090
kubectl port-forward svc/alertmanager -n tenaco 9093:9093
```

---

## Key Differences vs Other Projects in This Portfolio

| Feature | Tenaco | grocery-tracker | E-commerce |
|---|---|---|---|
| Backend language | Java (Spring Boot) | Node.js (Express) | Java (Spring Boot microservices) |
| Build tool | Maven | npm | Maven |
| Metrics | Spring Actuator (built-in) | prom-client (manual) | Spring Actuator (built-in) |
| Database | Neon (cloud PostgreSQL) | RDS PostgreSQL | RDS PostgreSQL |
| Registry | GHCR | GHCR | GHCR |
| K8s structure | Flat (single env) | Flat (single env) | Flat (single env) |

**Why no Maven wrapper (mvnw)?**
Other Spring Boot projects typically include `mvnw` for reproducible local builds.
This project uses the Maven Docker image (`maven:3.9-eclipse-temurin-17-alpine`) in the
Dockerfile instead — the Docker build is the canonical build process for CI/CD.

---

## Security Improvements Made

The original `application.yml` had hardcoded credentials:
```yaml
# BEFORE (insecure — credentials in Git)
spring:
  datasource:
    url: jdbc:postgresql://host.neon.tech/tenaco?sslmode=require
    username: neondb_owner
    password: npg_secret123
```

These are now environment variables resolved at runtime:
```yaml
# AFTER (secure — values come from AWS Secrets Manager via External Secrets)
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
```

The actual values live only in AWS Secrets Manager — never in Git.

---

## Glossary

| Term | Plain English |
|---|---|
| **Spring Boot Actuator** | Built-in endpoints for health checks and metrics in Spring Boot apps |
| **Micrometer** | Spring's metrics library — formats data for Prometheus |
| **Maven** | Java build tool — like npm but for Java (uses pom.xml) |
| **JAR** | Java application package — like a zip file containing compiled Java code |
| **JVM** | Java Virtual Machine — the runtime that executes Java code |
| **GC** | Garbage Collector — Java's automatic memory manager |
| **Neon** | Cloud-hosted PostgreSQL — you get a database URL, no server to manage |
| **GHCR** | GitHub Container Registry — free Docker image storage |
| **ArgoCD** | Keeps the cluster in sync with Git automatically |
| **Kustomize** | Patches K8s YAML for image tag updates without duplicating files |
| **Terraform** | Creates AWS resources from code |
| **HPA** | Horizontal Pod Autoscaler — automatically adds/removes pods based on load |
| **External Secrets** | Pulls secrets from AWS Secrets Manager into K8s |
| **OIDC** | GitHub authenticates to AWS without storing passwords as secrets |
