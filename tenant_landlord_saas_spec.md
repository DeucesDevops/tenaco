# Tenant–Landlord SaaS – Full Build Specification

## 0. Product Definition

### Target Users
- Small landlords (1–10 properties)
- Tenants renting those properties

### Core Problem
Landlords struggle to:
- Track tenant issues
- Communicate efficiently
- Manage multiple properties

### MVP Goal
Tenants:
- Report issues

Landlords:
- View, manage, resolve issues

### Out of Scope (MVP)
- Payments
- AI features
- Contractor marketplace
- Advanced analytics

---

## 1. Tech Stack

### Frontend
- Next.js
- Tailwind CSS

### Backend
- Spring Boot OR ASP.NET Core

### Database
- PostgreSQL

### Auth
- JWT

### File Storage
- Local (upgrade later)

---

## 2. Core Features

### Auth
- Register
- Login
- Role: landlord / tenant

### Properties
- Add property
- View properties

### Tenant Assignment
- Assign tenant to property

### Issues (Core)
- Tenant:
  - Create issue
  - Upload image
- Landlord:
  - View issues
  - Update status

### Notifications
- Email alerts

---

## 3. Database Design

### users
- id
- name
- email
- password_hash
- role
- created_at

### properties
- id
- landlord_id
- address
- created_at

### tenants
- id
- user_id
- property_id

### issues
- id
- property_id
- tenant_id
- title
- description
- status
- created_at

### issue_images
- id
- issue_id
- image_url

---

## 4. API Specification

### Auth
- POST /api/auth/register
- POST /api/auth/login

### Properties
- GET /api/properties
- POST /api/properties
- GET /api/properties/{id}

### Tenants
- POST /api/tenants/assign

### Issues
- POST /api/issues
- GET /api/issues
- GET /api/issues/{id}
- PATCH /api/issues/{id}/status

### Upload
- POST /api/upload

---

## 5. Backend Steps

1. Project setup
2. Auth (JWT)
3. Role middleware
4. Property module
5. Tenant assignment
6. Issue module
7. Status updates
8. File upload
9. Email notifications

---

## 6. Frontend Pages

- Login / Register
- Dashboard
- Properties
- Issues list
- Issue detail
- Create issue

---

## 7. Mobile-First UI

- Single column
- Large buttons
- Bottom navigation:
  - Home
  - Issues
  - Properties
  - Profile

---

## 8. Frontend Steps

1. Setup Next.js + Tailwind
2. Layout
3. Auth pages
4. Dashboard
5. Properties
5. Issues list
7. Create issue form
8. Image upload
9. Status update UI

---

## 9. Security

- Input validation
- Password hashing
- JWT protection
- Role checks

---

## 10. Testing

### Backend
- Auth
- Issue creation

### Frontend
- Forms
- API calls

---

## 11. Launch Checklist

- Tenant can report issue
- Landlord can view
- Status updates work
- Emails working
- Mobile UI usable

---

## 12. Post-Launch

- Push notifications
- UI improvements
- Analytics
- Contractor features

---

## Goal
Build fast, launch early, get first paying users.

---

# 13. Spring Boot Backend Architecture

## Libraries & Dependencies

### Core
- spring-boot-starter-web
- spring-boot-starter-data-jpa
- spring-boot-starter-security
- spring-boot-starter-validation

### Database
- postgresql driver

### Authentication
- jjwt (JWT)

### Email
- spring-boot-starter-mail

### Optional
- Lombok
- MapStruct

---

## Folder Structure

```
com.yourapp
│
├── config
├── auth
├── user
├── property
├── issue
├── notification
├── common
└── TenantLandlordApplication.java
```

---

## Module Structure

### auth
```
auth/
├── controller/
├── service/
├── dto/
├── security/
└── util/
```

### user
```
user/
├── entity/
├── repository/
├── service/
└── controller/
```

### property
```
property/
├── entity/
├── repository/
├── service/
├── controller/
└── dto/
```

### issue
```
issue/
├── entity/
├── repository/
├── service/
├── controller/
├── dto/
└── enums/
```

### notification
```
notification/
├── service/
├── email/
└── dto/
```

### config
```
config/
├── SecurityConfig.java
├── JwtFilter.java
├── WebConfig.java
```

### common
```
common/
├── exception/
├── response/
├── util/
```

---

## Example Entity

```java
@Entity
public class Issue {

    @Id
    @GeneratedValue
    private Long id;

    private String title;
    private String description;

    @Enumerated(EnumType.STRING)
    private IssueStatus status;

    @ManyToOne
    private Property property;

    @ManyToOne
    private User tenant;

    private LocalDateTime createdAt;
}
```

---

## Security Flow

Login → Generate JWT → Client stores token → Requests include token → Backend validates via filter

---

## Best Practices

- Use DTOs
- Keep controllers thin
- Business logic in services
- Use enums
- Global exception handling

---

## Build Order

1. Auth module
2. User module
3. Property module
4. Issue module
5. Notification module
