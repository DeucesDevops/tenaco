# Tenaco — User Flow

## Landlord Flow

1. **Register** (`/register`) — Select "Landlord" role, enter name/email/password → auto-login → dashboard
2. **Dashboard** (`/dashboard`) — See stats: total properties, active tenants, open issues, resolved issues + quick actions
3. **Add Property** (`/properties`) — Click "Add Property", fill in name/address/type/units → property appears in list
4. **View Property** (`/properties/[id]`) — See property details and its associated issues
5. **Assign Tenant** — Tenant registers separately, landlord assigns them to a property via `/tenants/assign` API
6. **View Tenants** (`/tenants`) — See all tenants assigned to your properties
7. **Manage Issues** (`/issues`) — See all issues reported by tenants across all properties, filter by status
8. **Update Issue Status** (`/issues/[id]`) — View issue details, change status: Open → In Progress → Resolved → Closed (tenant gets email notification)
9. **Settings** (`/settings`) — Update profile name/email, change password
10. **Logout** — Bottom nav or sidebar → clears session, back to login.

## Tenant Flow

1. **Register** (`/register`) — Select "Tenant" role, enter name/email/password → auto-login → dashboard
2. **Dashboard** (`/dashboard`) — See personal stats and quick actions
3. **Report Issue** (`/issues/new`) — Select property, enter title/description, set priority (Low/Medium/High/Urgent), upload photos (up to 5) → landlord gets email notification
4. **Track Issues** (`/issues`) — See all your reported issues with current status
5. **View Issue** (`/issues/[id]`) — See full issue details, status updates
6. **Settings** (`/settings`) — Update profile, change password
7. **Logout** — Bottom nav or sidebar

## Auth Flow

```
Register/Login → JWT token stored in localStorage
    ↓
Every API request → Bearer token in Authorization header
    ↓
Protected routes → AuthGuard checks token, redirects to /login if missing
    ↓
Logout → Clear token + state → redirect to /login
```

## Notification Flow

```
Tenant creates issue → Email sent to landlord
Landlord updates status → Email sent to tenant
```
