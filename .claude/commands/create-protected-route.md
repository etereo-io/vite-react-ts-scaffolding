Add route protection to the "$ARGUMENTS" feature module following the project's auth patterns.

## Arguments

Parse `$ARGUMENTS` as the feature directory name (e.g., "tasks", "products", "orders").

## Instructions

1. Read `src/app/features/auth/components/ProtectedRoute.tsx` for the ProtectedRoute component API.
2. Read `src/app/features/auth/auth.types.ts` for the `AuthorizationRule` interface.
3. Read `src/shared/layouts/ProtectedAdminLayout.tsx` for the convenience wrapper.
4. Read `src/features/tasks/index.tsx` as the reference for protected route integration.
5. Read `docs/guides/auth-protected-routes.md` for the full auth guide.

## Step 1: Replace AdminLayout with ProtectedAdminLayout

In `src/features/{feature}/index.tsx`:

Replace:
```typescript
import { AdminLayout } from "@/shared/layouts/AdminLayout";
```
with:
```typescript
import { ProtectedAdminLayout } from "@/shared/layouts/ProtectedAdminLayout";
```

Replace `element: <AdminLayout />` with `element: <ProtectedAdminLayout />`.

## Step 2: Add route-specific authorization (if needed)

For routes that need fine-grained permissions beyond the base admin/staff role check, wrap individual lazy page loaders:

```typescript
import { ProtectedRoute } from "@/app/features/auth/components/ProtectedRoute";

const FeatureFormPage = async () => {
  const { FeatureFormPage } = await import("./pages/FeatureFormPage");
  return {
    Component: function ProtectedFeatureFormPage() {
      return (
        <ProtectedRoute
          authorization={{
            requiredPermissions: [PERMISSION_FEATURE_WRITE_ALL, PERMISSION_FEATURE_ADMIN_ALL]
          }}
        >
          <FeatureFormPage />
        </ProtectedRoute>
      );
    }
  };
};
```

## Step 3: Verify

- Run `pnpm types:check` to ensure no TypeScript errors
- Run `pnpm test:run` to ensure existing tests pass

## Enforcement Rules

- Named exports ONLY
- Use constants for permission strings (no magic strings)
- Use `ProtectedAdminLayout` for base admin auth
- Use inline `ProtectedRoute` only when route-specific permissions differ from the admin base
- Follow `AuthorizationRule` patterns documented in `docs/guides/auth-protected-routes.md`
