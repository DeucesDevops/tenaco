# Tenaco — Property Management Made Simple

A full-stack SaaS platform for small landlords and tenants. Landlords manage properties, assign tenants, and track maintenance issues. Tenants report issues with photo uploads and receive status updates via email.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React 19, Tailwind CSS 4, Zustand |
| Backend | Spring Boot 3.4, Spring Security, Spring Data JPA |
| Database | PostgreSQL 17 (Neon) |
| Auth | JWT (jjwt) |
| Email | Spring Mail (SMTP) |

## Project Structure

```
tenaco/
├── backend/          # Spring Boot API
│   └── src/main/java/com/tenaco/
│       ├── auth/         # JWT authentication & security
│       ├── user/         # User profile & password management
│       ├── property/     # Properties & tenant assignment
│       ├── issue/        # Issues, uploads, dashboard stats
│       ├── notification/ # Email notifications
│       └── config/       # Security, CORS, async config
├── client/           # Next.js frontend
│   └── src/
│       ├── app/          # Pages (dashboard, properties, issues, etc.)
│       ├── components/   # UI components & auth guard
│       └── lib/          # API client, store, types
└── tenant_landlord_saas_spec.md
```

## Getting Started

### Prerequisites

- Java 17+
- Node.js 18+
- Maven
- PostgreSQL (or a Neon account)

### Backend

```bash
cd backend

# Configure your database in src/main/resources/application.yml
# Update spring.datasource.url, username, and password

# (Optional) Configure email
export MAIL_HOST=smtp.gmail.com
export MAIL_PORT=587
export MAIL_USERNAME=your-email@gmail.com
export MAIL_PASSWORD=your-app-password

# Run
mvn spring-boot:run
```

The backend starts on `http://localhost:8080`. On first run, Hibernate auto-creates all tables and `schema.sql` adds indexes.

### Frontend

```bash
cd client
npm install
npm run dev
```

The frontend starts on `http://localhost:3000` and proxies API requests to the backend.

### Demo Credentials

After starting both servers, register users or use:

| Role | Email | Password |
|------|-------|----------|
| Landlord | landlord@tenaco.com | password123 |
| Tenant | tenant@tenaco.com | password123 |

## API Endpoints

### Auth
- `POST /api/auth/register` — Register (name, email, password, role)
- `POST /api/auth/login` — Login (email, password)

### Users
- `GET /api/users/me` — Current user profile
- `PATCH /api/users/me` — Update profile
- `POST /api/users/me/password` — Change password

### Properties
- `GET /api/properties` — List properties
- `GET /api/properties/{id}` — Property detail
- `POST /api/properties` — Create property (landlord only)

### Tenants
- `GET /api/tenants` — List tenants
- `POST /api/tenants/assign` — Assign tenant to property

### Issues
- `GET /api/issues` — List issues (filtered by role)
- `GET /api/issues/{id}` — Issue detail
- `POST /api/issues` — Create issue (tenant)
- `PATCH /api/issues/{id}/status` — Update status (landlord)

### Other
- `POST /api/upload` — Upload file (image)
- `GET /api/dashboard/stats` — Dashboard statistics

## Features

- **Role-based access** — Landlords and tenants see different views
- **Issue tracking** — Create, update status (Open → In Progress → Resolved → Closed)
- **Image uploads** — Attach photos to issues
- **Email notifications** — Landlords notified on new issues, tenants on status changes
- **Auth guard** — Protected routes redirect to login
- **Mobile-first UI** — Responsive with bottom navigation on mobile

## Database Schema

Five tables: `users`, `properties`, `tenants`, `issues`, `issue_images`. See `backend/src/main/resources/schema.sql` for the full schema.

## License

Private — All rights reserved.
