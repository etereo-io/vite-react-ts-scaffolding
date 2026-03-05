# Project Quick Reference

Vite + React 19 + TypeScript scaffolding with modular architecture, runtime config, auth, MSW mocking, i18n (react-i18next), shadcn/ui, TailwindCSS 4, React Query, Zod, Axios, and Vitest.

Read through all instructions before anything else to understand the coding standards, architectural patterns, and best practices to follow while contributing to the project.

## Quick Commands

- `pnpm dev` -- Start dev server
- `pnpm build` -- Production build
- `pnpm test:run` -- Run all tests
- `pnpm types:check` -- TypeScript check
- `pnpm lint` -- Biome lint check
- `pnpm lint:fix` -- Auto-fix lint issues

## Key Directories

- `src/app/` -- App shell (providers, config, auth, modules, i18n, mock-server)
- `src/features/` -- Feature modules (self-contained domain modules)
- `src/shared/` -- React-specific shared code (hooks, components, layouts)
- `src/lib/` -- Framework-agnostic utilities (string, date, file, format, storage)
- `test/` -- Test helpers and providers
- `config/` -- Environment YAML configs (dev, sta, pro)

## CRITICAL RULES

### Exports & Imports

- Named exports ONLY. NEVER use `export default`
- No barrel exports (no `export *` or re-export index.ts files). Use direct imports to specific files
- Use `import type` for TypeScript type-only imports
- Path aliases: `@/` = `src/`, `#/` = `test/`
- **Import order**: External libs > `@/lib/` > `@/shared/` > Current feature (types > constants > helpers > services > hooks > components) > Cross-feature (same layer or lower only)
- **Import hierarchy** (NEVER import upward):
  ```
  Pages > Components > Controller Hooks > Service Hooks > Services > Helpers > Constants > Types
  ```

### Architecture

- **Components** = PURE prop assignment. NO business logic, NO handler creation, NO useState/useCallback inside components
- **ALL business logic** goes in controller hooks (`use[Feature]Controller`). Controllers compose: permissions + mutations + queries + derived state + handlers
- **Services** = pure API calls via `apiClient`. NO error handling (delegated to React Query hooks)
- **One hook per file** for query and mutation hooks
- Pages wire controllers to components. They may hold minimal UI-only state (search input, page index)
- Use `AllowedAuth` component for permission-gated UI elements
- Use `ProtectedRoute` / `ProtectedAdminLayout` for route-level auth guards
- Use `ErrorBoundary` to catch React errors; `Error403`/`Error404`/`Error500` for error pages

### TypeScript

- `readonly` on ALL interface props
- Function declarations for components and hooks (not arrow functions)
- No magic strings -- use constants/enums from `[feature].constants.ts`
- Boolean variable prefixes: `is*`, `has*`, `can*`, `should*`
- Event handler prefix: `handle*` (e.g., `handleDeleteTask`)

### Naming Conventions

- **Components**: `PascalCase.tsx` (e.g., `TasksList.tsx`)
- **Hooks**: `camelCase` with `use` prefix (e.g., `useTasksListController.ts`)
- **Domain files**: `[domain].services.ts`, `[domain].types.ts`, `[domain].constants.ts`, `[domain].enums.ts`, `[domain].schemas.ts`, `[domain].helpers.ts`, `[domain].routes.ts`, `[domain].mock.handlers.ts`
- **Mocks**: `__mocks__/[entity].mother.ts`, `__mocks__/[domain].mock-db.ts`
- **Pages**: `PascalCase` + `Page.tsx` suffix (e.g., `TasksListPage.tsx`)
- **Constants prefixes**: `MODULE_`, `QUERY_KEY_`, `PERMISSION_`, `ROUTE_ID_`, `MENU_ID_`, `API_ENDPOINT_`, `EVENT_`, `DEFAULT_`, `ERROR_`

### Testing

- **MSW-level mocking ONLY**. NEVER mock service functions or axios directly
- **Object Mother factories** for ALL test data. NEVER use inline literals in tests
- Call handlers directly via `act()`. NEVER use `userEvent.click()` for controller tests
- Views = snapshot + DOM assertions. Mock `useLoggedUser` for permission testing
- **Provider tiering**: None (helpers) | `MinimalTestProviders` (hooks) | `TestProviders` (full i18n/auth/config)
- Use `renderHookWithProviders()` for hook tests, `renderWithTestProviders()` for components
- Standard mutation mock setup: vi.mock `useQueryClient`, `useMetrics`, `notifications`
- Test names must be descriptive: `"should return paginated task data"` not `"works"`

### i18n

- Key pattern: `module.entity.aspect` (e.g., `tasks.form.fields.title`, `tasks.table.empty`)
- Feature-colocated in `assets/locales/{en,es}.json` + `index.ts`
- No dynamic key construction (no template literals for i18n keys)
- Define i18n keys as constants when referenced in multiple places

## Reference Module

Use `src/features/tasks/` as the canonical reference for creating new feature modules. It demonstrates every pattern in this project.

## Module Creation Checklist

Constants > Routes > Enums > Types > Schemas > Helpers (+tests) > Services > Query Hooks > Mutation Hooks > Permission Hook > Controller Hooks > Components > Pages > Mother Object > Mock DB > MSW Handlers > Locales > `index.tsx` (registerModule) > Activate in `modules.ts`

## Query Key Factory Pattern

```typescript
export const QUERY_KEY_TASKS = "tasks";
export const taskKeys = {
  all:     [QUERY_KEY_TASKS] as const,
  lists:   () => [...taskKeys.all, "list"] as const,
  list:    (filters: Record<string, unknown>) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail:  (id: string) => [...taskKeys.details(), id] as const,
};
```

## Constants Prefixes

| Prefix | Purpose | Example |
|--------|---------|---------|
| `MODULE_` | Module identifier | `MODULE_TASKS = "tasks"` |
| `QUERY_KEY_` | React Query base key | `QUERY_KEY_TASKS = "tasks"` |
| `PERMISSION_` | Permission scope | `PERMISSION_TASKS_READ_ALL = "tasks:read:all"` |
| `ROUTE_ID_` | Route identifier | `ROUTE_ID_TASKS_LIST = "admin.tasks.list"` |
| `MENU_ID_` | Menu item identifier | `MENU_ID_TASKS = "menu.admin.tasks"` |
| `API_ENDPOINT_` | API URL path | `API_ENDPOINT_TASKS = "/v1/tasks"` |
| `EVENT_` | Analytics event | `EVENT_TASK_CREATED = "task_created"` |
| `DEFAULT_` | Default values | `DEFAULT_TASKS_LIMIT = 20` |

## Feature Module File Template

```
src/features/[feature]/
  __mocks__/[entity].mother.ts, [feature].mock-db.ts
  assets/locales/en.json, es.json, index.ts
  components/[Feature]sList.tsx, [Feature]Form.tsx
  hooks/use[Feature]s.ts, use[Feature].ts, useCreate[Feature].ts,
        useUpdate[Feature].ts, useDelete[Feature].ts,
        use[Feature]sPermissions.ts, use[Feature]sListController.ts,
        use[Feature]FormController.ts
  pages/[Feature]sListPage.tsx, [Feature]FormPage.tsx
  [feature].constants.ts, [feature].routes.ts, [feature].enums.ts,
  [feature].types.ts, [feature].schemas.ts, [feature].helpers.ts,
  [feature].helpers.test.ts, [feature].services.ts, [feature].mock.handlers.ts
  index.tsx
```

## Route Dual Format

```typescript
export const FEATURE_ROUTES = {
  PATTERNS: {                                    // Absolute -- for <Link to> and navigate()
    list: "/admin/feature/list",
    edit: (id: string) => `/admin/feature/${id}/edit`,
  },
  SEGMENTS: {                                    // Relative -- for RouteObject.path
    list: "feature/list",
    edit: "feature/:featureId/edit",
  },
} as const;
```

## Permission Format

`module:action:scope` -- e.g., `tasks:read:all`, `tasks:write:all`, `tasks:admin:all`

## Auth & Route Protection

- **`ProtectedRoute`** -- Route-level auth guard. Checks authentication (redirects to login) then authorization (shows Error403). Location: `src/app/features/auth/components/ProtectedRoute.tsx`
- **`ProtectedAdminLayout`** -- Wraps `AdminLayout` with `ProtectedRoute` + default admin/staff role check. Use in feature module `index.tsx` instead of `AdminLayout`. Location: `src/shared/layouts/ProtectedAdminLayout.tsx`
- **`AllowedAuth`** -- Component-level permission gating (shows/hides UI). Location: `src/app/features/auth/components/AllowedAuth.tsx`
- **`AuthorizationRule`** -- Declarative config: `bypassPermissions`, `requiredPermissions`, `requiredRoles`, `customCheck`. Location: `src/app/features/auth/auth.types.ts`
- **`evaluateAuthorizationRule`** -- Pure function that evaluates a rule. Location: `src/app/features/auth/auth.helpers.ts`
- **Error pages**: `Error403`, `Error404`, `Error500`, `ErrorBoundary`, `RouterErrorBoundary` in `src/shared/components/`
- **Redirect-after-login**: stored in sessionStorage, consumed in SignInPage after login
- Full guide: [Auth & Protected Routes](docs/guides/auth-protected-routes.md)

## Architecture & Full Documentation

- [Analytics & Metrics](docs/guides/analytics.md) -- GA4 integration, useMetrics, data-track attributes
- [Auth & Protected Routes](docs/guides/auth-protected-routes.md) -- Route protection, AuthorizationRule, error pages
- [Frontend Coding Rules](docs/rules/frontend/README.md) -- All 14 instruction files
- [Module Creation Guide](docs/guides/module-creation.md) -- 17-step walkthrough
- [Patterns Cheatsheet](docs/guides/patterns-cheatsheet.md) -- Quick reference
- [Architecture Overview](docs/architecture/ARCHITECTURE.md) -- System design
- [AI Observability](docs/rules/ai-observability.instruction.md) -- ADR guidelines
- [Git Workflow](docs/rules/git.instruction.md) -- Conventional commits
