# Auth & Route Protection Guide

## Overview

The project provides two layers of access control:

| Layer | Component | Scope | When denied |
|-------|-----------|-------|-------------|
| **Route-level** | `ProtectedRoute` | Entire page/route | Redirect to login (unauthenticated) or show Error403 (unauthorized) |
| **Component-level** | `AllowedAuth` | Individual UI elements | Hide element or show custom fallback |

## Auth Flow

```
User navigates to /admin/tasks
    ↓
ProtectedRoute checks auth
    ↓
Authenticated?
├─ NO → Store path in sessionStorage → Redirect to /login
│        ↓
│   User logs in → Redirect back to /admin/tasks
│
└─ YES → Authorization rule provided?
         ├─ NO → Render page ✓
         └─ YES → Evaluate rule
                  ├─ PASS → Render page ✓
                  └─ FAIL → Show Error403
```

## ProtectedRoute Component

**Location:** `src/app/features/auth/components/ProtectedRoute.tsx`

### Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | Content to render when authorized |
| `authorization` | `AuthorizationRule` | `undefined` | Authorization rule (omit for auth-only) |
| `loginPath` | `string` | `"/login"` | Custom login redirect path |
| `forbiddenComponent` | `ReactNode` | `<Error403 />` | Custom 403 component |
| `loadingComponent` | `ReactNode` | `null` | Custom loading component |

### Usage

```tsx
// Authentication only (no permission check)
<ProtectedRoute>
  <MyPage />
</ProtectedRoute>

// With role requirement
<ProtectedRoute authorization={{ requiredRoles: [UserRoles.ADMIN] }}>
  <AdminPage />
</ProtectedRoute>

// With permission requirement
<ProtectedRoute authorization={{ requiredPermissions: ["tasks:write:all"] }}>
  <TaskFormPage />
</ProtectedRoute>

// With bypass (admin skips, others need specific permission)
<ProtectedRoute
  authorization={{
    bypassPermissions: ["tasks:admin:all"],
    requiredPermissions: ["tasks:write:all"]
  }}
>
  <TaskFormPage />
</ProtectedRoute>

// With custom check
<ProtectedRoute
  authorization={{
    customCheck: (user) => user.roles.length > 0 && user.permissions.includes("special")
  }}
>
  <SpecialPage />
</ProtectedRoute>
```

## AuthorizationRule Interface

**Location:** `src/app/features/auth/auth.types.ts`

```typescript
interface AuthorizationRule {
  readonly bypassPermissions?: string[];    // ANY → ALLOW immediately
  readonly requiredPermissions?: string[];   // Must have at least one (OR)
  readonly requiredRoles?: UserRoles[];      // Must have at least one (OR)
  readonly customCheck?: (user: User) => boolean;  // Escape hatch
}
```

### Evaluation Order

1. **bypassPermissions** — if user has ANY → ALLOW (no further checks)
2. **requiredRoles** — if specified and user has NONE → DENY
3. **requiredPermissions** — if specified and user has NONE → DENY
4. **customCheck** — if provided, use its return value
5. **Default** → ALLOW (empty rule = authentication-only)

Roles and permissions compose as AND: user must pass both role check AND permission check.

## ProtectedAdminLayout

**Location:** `src/shared/layouts/ProtectedAdminLayout.tsx`

Convenience wrapper that combines `ProtectedRoute` + `AdminLayout` with a default admin/staff role check.

```tsx
// In feature module index.tsx:
import { ProtectedAdminLayout } from "@/shared/layouts/ProtectedAdminLayout";

const routes: RouteObject[] = [
  {
    path: "/admin",
    element: <ProtectedAdminLayout />,
    children: [
      { path: "feature/list", lazy: FeatureListPage }
    ]
  }
];
```

To override the default authorization:
```tsx
<ProtectedAdminLayout authorization={{ requiredRoles: [UserRoles.ADMIN] }} />
```

## Redirect After Login

When `ProtectedRoute` redirects to login, it stores the original path in sessionStorage. After successful login, `SignInPage` reads and clears this value to redirect back.

**Helpers:** `src/app/features/auth/auth.helpers.ts`
- `setRedirectAfterLogin(path)` — stores path
- `getAndClearRedirectAfterLogin()` — reads + clears atomically

## Error Pages

**Location:** `src/shared/components/`

| Component | File | Purpose |
|-----------|------|---------|
| `ErrorPage` | `ErrorPage.tsx` | Base component with icon, title, description, footer |
| `Error403` | `Error403.tsx` | Access denied (used by ProtectedRoute) |
| `Error404` | `Error404.tsx` | Page not found (catch-all route) |
| `Error500` | `Error500.tsx` | Server error (ErrorBoundary default) |
| `ErrorBoundary` | `ErrorBoundary.tsx` | React error boundary wrapper |
| `RouterErrorBoundary` | `RouterErrorBoundary.tsx` | Router-level error handler |

### ErrorBoundary Usage

```tsx
// Default (shows Error500 on crash)
<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>

// Custom fallback
<ErrorBoundary fallback={<Error404 />}>
  <YourComponent />
</ErrorBoundary>

// Force fallback when query error exists
<ErrorBoundary error={queryError}>
  <YourComponent />
</ErrorBoundary>
```

## ProtectedRoute vs AllowedAuth

| | ProtectedRoute | AllowedAuth |
|---|---|---|
| **Level** | Route (wraps entire page) | Component (wraps UI element) |
| **Auth check** | Yes (redirects to login) | No (assumes user is loaded) |
| **Denied** | Redirect or Error403 page | Hide element or show inline fallback |
| **Use for** | Page access control | Button/section visibility |

## i18n Keys

```
shared.error.403.title
shared.error.403.message
shared.error.404.title
shared.error.404.message
shared.error.500.title
shared.error.500.message
shared.error.router.title
shared.error.router.message
shared.error.button.goBack
```

## Permission Format

`module:action:scope` — e.g., `tasks:read:all`, `tasks:write:all`, `tasks:admin:all`

## Mock Users (Dev Mode)

| User | Roles | Permissions |
|------|-------|-------------|
| admin/admin | ADMIN, STAFF | All module permissions |
| staff/staff | STAFF | All except `:admin:` |
| user/user | (none) | Only `:read:` permissions |
