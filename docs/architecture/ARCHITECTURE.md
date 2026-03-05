# Architecture

## 1. Overview

This project is a production-ready React + TypeScript scaffolding built with Vite. It provides a complete set of architectural patterns, conventions, and infrastructure for building modular single-page applications that follow domain-driven design principles.

**Goals:**

- **One build, many environments** -- Runtime YAML configuration means the same Docker image deploys to dev, staging, and production without rebuilding.
- **Self-registering modules** -- Features register themselves via side-effect imports, so adding or removing a module is a single line change.
- **Testability first** -- Every pattern is structured so business logic lives in hook controllers that can be tested in isolation with `renderHook`.
- **No magic strings** -- All identifiers (query keys, permissions, route IDs, API endpoints, analytics events) are exported constants.
- **Fast developer feedback** -- MSW mocks with IndexedDB persistence, hot module replacement, and mock auth make the frontend fully functional without a backend.

**Technology stack:** React, TypeScript, Vite, TailwindCSS, TanStack React Query, MSW, Vitest, Testing Library, react-i18next, Zod, react-hook-form, shadcn/ui, Axios, react-idle-timer.

---

## 2. Module System

**Files:** `src/app/features/modules/modules.helpers.ts`, `src/app/features/modules/modules.ts`, `src/app/features/modules/index.ts`

Modules are the primary organizational unit. Each feature (dashboard, orders, tasks) is a self-contained module that registers its routes, menu items, locales, mock handlers, and permissions with the application.

### How it works

1. **globalThis singleton** -- `modules.helpers.ts` stores the module registry on `globalThis.APP_MODULES` as a plain array. This avoids problems with Vite's module isolation during testing (`vi.resetModules()` would otherwise lose the registry).

2. **`registerModule()`** -- Each feature's `index.tsx` calls `registerModule()` with a `Module` object containing its `name`, `routes`, `menuItems`, `locales`, `getMockHandlers`, and `permissions`.

3. **Side-effect imports in `modules.ts`** -- The file `src/app/features/modules/modules.ts` activates modules by importing their entrypoints as side effects:

   ```typescript
   // src/app/features/modules/modules.ts
   import "@/app/features/auth";
   import "@/features/dashboard";
   import "@/features/orders";
   import "@/features/tasks";
   import "@/shared";
   ```

4. **Aggregation helpers** -- `modules.helpers.ts` exposes functions that aggregate data from all registered modules:
   - `getAllRoutes()` -- Collects all route definitions for React Router.
   - `getAllowedMenuItems(user)` -- Filters menu items by user permissions and sorts by priority.
   - `getAllLocalesResources()` -- Deep-merges locale objects from every module.
   - `getAllMockHandlers()` -- Collects all MSW request handlers.

**Why this pattern:** Adding a new module requires only creating the feature directory, writing its `index.tsx` with a `registerModule()` call, and adding one import line to `modules.ts`. No central routing file, no central menu configuration, no central locale aggregation needs to be edited.

**Module interface** (`src/app/app.types.ts`):

```typescript
export interface Module {
  name: string;
  parent?: string;
  locales?: LocaleResources;
  menuItems?: MenuItem[];
  routes?: RouteObject[];
  getMockHandlers?: () => (RequestHandler | WebSocketHandler)[];
  permissions?: string[];
}
```

---

## 3. Controller Hook Pattern

**Convention:** `use[Feature]Controller()` hooks in `src/features/[feature]/hooks/`

Controller hooks are the single location for all business logic, state coordination, event handlers, and derived state for a given page or component. Components become pure prop assignment -- they call the controller and pass its return values directly to child components.

### Structure

```typescript
// src/features/tasks/hooks/useTasksListController.ts
export function useTasksListController(options) {
  // 1. Compose service hooks (data fetching)
  const permissions = useTasksPermissions();
  const deleteTaskMutation = useDeleteTask();
  const { data, isFetching, isError, error } = useTasks(filters);

  // 2. Derive state
  const totalPages = useMemo(() => /* ... */, [data?.total, pagination.pageSize]);

  // 3. Build handlers
  const handleDeleteTask = useCallback(
    (taskId: string) => () => deleteTaskMutation.mutate(taskId),
    [deleteTaskMutation]
  );

  // 4. Return everything the component needs
  return {
    tasks: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages,
    isFetching, isError, error,
    isDeleting: deleteTaskMutation.isPending,
    ...permissions,
    handleDeleteTask,
  };
}
```

**Why:** Testability. Controllers are tested with `renderHook()` in isolation. Components are tested with snapshots after mocking the entire controller. No DOM interaction is needed to verify business logic.

The project has two controller patterns:
- **List controllers** (e.g., `useTasksListController`) -- Compose query hooks, permissions, filters, pagination, sorting, and deletion.
- **Form controllers** (e.g., `useTaskFormController`) -- Compose create/update mutations, default values, form submission, and success callbacks.

---

## 4. Service Hooks + React Query

**Files:** `src/features/[feature]/hooks/use[Entity].ts`, `src/features/[feature]/hooks/use[Action][Entity].ts`

### Query hooks (read)

One hook per file. Each wraps `useQuery` with the service function, query key factory, and error metadata:

```typescript
// src/features/tasks/hooks/useTasks.ts
export function useTasks(filters: TaskFilters = DEFAULT_TASKS_FILTERS) {
  return useQuery({
    queryKey: taskKeys.list(filters as Record<string, unknown>),
    queryFn: () => tasksService.listTasks(filters),
    meta: { errorMessage: "tasks.fetch.error" },
  });
}
```

### Mutation hooks (write)

Each mutation hook handles cache invalidation, metrics events, and success/error messaging:

```typescript
// src/features/tasks/hooks/useCreateTask.ts
export function useCreateTask() {
  const queryClient = useQueryClient();
  const metrics = useMetrics();
  return useMutation({
    mutationFn: (data: TaskCreateRequest) => {
      metrics.event(EVENT_TASK_CREATED);
      return tasksService.createTask(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    meta: {
      errorMessage: t("tasks.create.error"),
      successMessage: t("tasks.create.success"),
    },
  });
}
```

### Query key factory

**File:** `src/features/tasks/tasks.constants.ts`

Each feature defines a hierarchical key factory for precise cache invalidation:

```typescript
export const taskKeys = {
  all: [QUERY_KEY_TASKS] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) => [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const,
};
```

### Global query/mutation caches

**File:** `src/app/features/queryClient.ts`

The `QueryClient` is configured with global `QueryCache` and `MutationCache` instances that read `meta.errorMessage` and `meta.successMessage` from queries/mutations and display toast notifications via Sonner. This eliminates per-hook error handling boilerplate.

**Why React Query:** Automatic caching, background refetching, stale-while-revalidate, request deduplication, and structured cache invalidation. The query key factory pattern ensures mutations invalidate exactly the right queries.

---

## 5. Runtime Config

**Files:** `src/app/features/config/config.service.ts`, `src/app/features/config/config.types.ts`, `src/app/features/config/config.helpers.ts`, `src/app/features/config/providers/ConfigProvider.tsx`, `src/app/features/config/components/ConfigLoader.tsx`

### How it works

1. **YAML config file** -- A `config.yml` file is served as a static asset from `/config/config.yml` (configurable). It is loaded at runtime, not at build time.

2. **`loadConfig()`** -- The `config.service.ts` module fetches the YAML file, parses it with `js-yaml`, and stores the result on `globalThis.APP_CONFIG` as a singleton. This ensures the config is available synchronously after initial load, even across module boundaries.

3. **`ConfigProvider`** -- A React context provider that manages loading state and exposes the config to the component tree.

4. **`ConfigLoader`** -- A gatekeeper component that shows a loading spinner until the config is ready, or an error screen if loading fails.

5. **Feature flag helpers** (`config.helpers.ts`):
   ```typescript
   export function isMswEnabled(): boolean {
     return config?.features?.msw ?? false;
   }
   export function isDebugMode(): boolean {
     return config?.features?.debugMode ?? false;
   }
   ```

### Config shape

```typescript
export interface AppConfig {
  app?: { environment?: string; version?: string };
  endpoints?: Record<string, string>;
  features?: {
    msw?: boolean;
    debugMode?: boolean;
    analytics?: boolean;
    betaFeatures?: boolean;
  };
  oauth?: {
    disabled?: boolean;
    clientId?: string;
    authority?: string;
    redirectUri?: string;
  };
}
```

**Why runtime config:** The same Docker image (built once in CI) can be deployed to dev, staging, and production by swapping only the `config.yml` file. No rebuild required. Feature flags like MSW and debug mode can be toggled per environment.

---

## 6. Storage Prefix Manager

**File:** `src/lib/storage/storage.ts`

### How it works

All localStorage access goes through the `storage` helper, which prefixes keys with the app name and version:

```
vite-react-ts-scaffolding:v1.2.3-abc123:my-key
```

The version is read from a `<meta name="app-version">` tag injected by the Vite plugin `htmlMetaTagsPlugin` (see `src/app/features/vite-plugins/htmlMetaTagsPlugin.ts`). Each build produces a unique version string (`${version}-${timestamp}`).

### Auto-cleanup

`cleanOldStorageVersions()` iterates all localStorage keys and removes any that match the app prefix but not the current version prefix. This prevents stale data from previous deployments from interfering with the current version.

**Why:** Deployments can change data shapes. Without version-scoped storage, users could end up with deserialized data from an old schema that crashes the new code.

---

## 7. Auth Provider Switching

**Files:** `src/app/features/auth/providers/AuthProvider.tsx`, `src/app/features/auth/providers/MockAuthProvider.tsx`, `src/app/features/auth/providers/SimpleAuthProvider.tsx`, `src/app/features/auth/providers/AuthContext.ts`

### How it works

`AuthProvider` reads the runtime config and selects the appropriate implementation:

```typescript
export function AuthProvider({ children }: Props) {
  const { config } = useConfig();
  const useMockAuth = config?.oauth?.disabled === true || import.meta.env.DEV;

  if (useMockAuth) {
    return <MockAuthProvider>{children}</MockAuthProvider>;
  }
  return <SimpleAuthProvider>{children}</SimpleAuthProvider>;
}
```

- **`MockAuthProvider`** -- Uses an in-memory mock auth database (`auth.mock-db.ts`) with pre-seeded users. Simulates login, logout, and token refresh with artificial delays. Used during development.
- **`SimpleAuthProvider`** -- A production-ready skeleton that stores tokens in `sessionStorage` and calls real API endpoints. Intended to be extended with your actual auth provider (OAuth, OIDC, etc.).

Both providers expose the same `AuthContextValue` interface through a shared `AuthContext` stored on `globalThis` (to survive `vi.resetModules()` in tests).

**Why:** Developers can work entirely offline with realistic mock authentication. The switch is automatic in development mode and configurable via the runtime config for other environments.

---

## 8. Permission System

**Files:** `src/app/features/auth/auth.helpers.ts`, `src/app/features/auth/auth.types.ts`, `src/app/features/auth/hooks/useUserAuth.ts`, `src/app/features/auth/components/AllowedAuth.tsx`

### Scope-based format

Permissions follow the `module:action:scope` convention:

```typescript
export const PERMISSION_TASKS_READ_ALL = "tasks:read:all";
export const PERMISSION_TASKS_WRITE_ALL = "tasks:write:all";
export const PERMISSION_TASKS_ADMIN_ALL = "tasks:admin:all";
```

### Permission checking

The `isUserAllowed()` helper supports three formats:
- **Single string** -- `"tasks:read:all"` -- user must have this permission.
- **Array of strings** -- `["tasks:read:all", "tasks:admin:all"]` -- user must have ANY of these (OR logic).
- **Array of arrays** -- `[["tasks:read:all"], ["tasks:admin:all"]]` -- user must have at least one from EACH group (AND of ORs).

### Declarative usage

Permissions are checked declaratively in two places:

1. **Route/menu registration** -- Each module's `menuItems` has an `isAllowed` callback:
   ```typescript
   const menuItems: MenuItem[] = [{
     title: "tasks.title",
     path: TASKS_ROUTES.PATTERNS.list,
     isAllowed: (user: User) =>
       user.permissions?.includes(PERMISSION_TASKS_READ_ALL) || true,
   }];
   ```

2. **Components** -- The `AllowedAuth` wrapper renders children only if the user has the required permissions:
   ```tsx
   <AllowedAuth permissions={PERMISSION_TASKS_WRITE_ALL}>
     <Button>Create Task</Button>
   </AllowedAuth>
   ```

### Per-feature permission hooks

Each feature defines a `useXxxPermissions()` hook that computes derived permission booleans:

```typescript
// src/features/tasks/hooks/useTasksPermissions.ts
export function useTasksPermissions() {
  const { isAllowed, isPending } = useUserAuth();
  const canRead = isAllowed(PERMISSION_TASKS_READ_ALL);
  const canWrite = isAllowed(PERMISSION_TASKS_WRITE_ALL);
  const canAdmin = isAllowed(PERMISSION_TASKS_ADMIN_ALL);
  const canCreate = canWrite || canAdmin;
  const canUpdate = canWrite || canAdmin;
  const canDelete = canAdmin;
  return { isPending, canRead, canWrite, canAdmin, canCreate, canUpdate, canDelete };
}
```

---

## 9. API Layer

**Files:** `src/app/features/api/api.ts`, `src/app/features/api/api.interceptors.ts`, `src/app/features/api/api.constants.ts`

### Axios instance

A single `apiClient` Axios instance is created and shared across all services. The base URL is resolved lazily via a request interceptor so the runtime config has time to load:

```typescript
export const apiClient = axios.create();

apiClient.interceptors.request.use((requestConfig) => {
  if (!requestConfig.baseURL) {
    requestConfig.baseURL = getEndpoint("default");
  }
  return requestConfig;
});
```

### Interceptors

- **Request interceptor** -- Attaches the `Authorization: Bearer <token>` header from the token store.
- **Response interceptor** -- Handles 401 errors with automatic token refresh. Queues concurrent requests during the refresh and replays them with the new token. Prevents duplicate refresh calls.

### Endpoint resolution

`getEndpoint(service)` reads from `config.endpoints.[service]`. If no config exists, it falls back to the mock prefix (`/mock/api`), enabling seamless MSW interception during development.

---

## 10. MSW Organization

**Files:** `src/features/[feature]/tasks.mock.handlers.ts`, `src/features/[feature]/__mocks__/task.mother.ts`, `src/features/[feature]/__mocks__/tasks.mock-db.ts`, `src/app/features/mock-server/browser.ts`, `src/app/features/mock-server/providers/MockProvider.tsx`

### Per-module handlers

Each module exports a `getMockHandlers()` function that returns its MSW `http.*` handlers. The module system aggregates all handlers via `getAllMockHandlers()` and passes them to `setupWorker()`.

### Handler factory pattern

Handlers are built as named factory functions for readability:

```typescript
export const getMockHandlers = () => [
  buildTasksListHandler(),
  buildTaskDetailHandler(),
  buildTaskCreateHandler(),
  buildTaskUpdateHandler(),
  buildTaskPatchHandler(),
  buildTaskDeleteHandler(),
];
```

### Mother objects

**File:** `src/features/tasks/__mocks__/task.mother.ts`

Mother objects (test data factories) use `@faker-js/faker` to generate realistic mock data:

```typescript
export const taskMother = {
  getRandomTask,    // Single entity with optional overrides
  getRandomList,    // Array of entities
  getRandomPage,    // Paginated response shape
};
```

### IndexedDB-backed mock databases

**File:** `src/features/tasks/__mocks__/tasks.mock-db.ts`

Mock databases use the `MockDatabase<T>` class from `src/lib/storage/indexed-db.ts` to persist data in IndexedDB. This means:
- Data survives page refreshes during development.
- Data survives HMR (Hot Module Replacement).
- CRUD operations in the mock handlers actually persist, making the development experience realistic.

The mock database lazily initializes with seed data from the mother object on first access.

### MockProvider

**File:** `src/app/features/mock-server/providers/MockProvider.tsx`

`MockProvider` checks `isMswEnabled()` from the runtime config. If enabled, it dynamically imports the MSW browser worker, starts it with a timeout guard (5 seconds), and renders children only after the worker is ready. If MSW is disabled, children render immediately.

The mock server only intercepts requests to the `/mock` prefix (`API_MOCK_PREFIX`), letting real API calls pass through.

**Why IndexedDB mocks:** In-memory mocks reset on every HMR update, making development frustrating. IndexedDB persistence means you can create a task, edit code, and the task is still there after the page reloads.

---

## 11. Provider Chain

**File:** `src/app/components/AppProviders.tsx`

```typescript
<ConfigProvider config={config}>          // 1. Config context
  <ConfigLoader>                          // 2. Blocks until config loaded
    <I18nLoader>                          // 3. Initializes i18next
      <MockProvider>                      // 4. Starts MSW (if enabled)
        <AuthProvider>                    // 5. Auth (needs config for provider selection)
          <QueryClientProvider>           // 6. React Query (needs auth for token interceptor)
            <IdleManagerLoader>           // 7. Idle detection (pauses polling when user inactive)
              {children}
              <Toaster />                 // 8. Toast notifications
              <DebugProviders />          // 9. React Query DevTools (if debug mode)
            </IdleManagerLoader>
          </QueryClientProvider>
        </AuthProvider>
      </MockProvider>
    </I18nLoader>
  </ConfigLoader>
</ConfigProvider>
```

**Why this order:**

1. **ConfigProvider** must be outermost because every other provider may read config values.
2. **ConfigLoader** gates the tree until config is available, preventing downstream consumers from reading undefined values.
3. **I18nLoader** initializes i18next with locale resources from all registered modules. Must happen before any component calls `useTranslation()`.
4. **MockProvider** starts the MSW service worker. Must happen before React Query makes API calls, otherwise requests would hit a real (non-existent) backend.
5. **AuthProvider** reads `config.oauth.disabled` to choose between mock and real auth. Must be inside ConfigProvider. Must be outside QueryClientProvider so the auth token is available for API interceptors.
6. **QueryClientProvider** wraps the application tree so all components can use React Query hooks.
7. **IdleManagerLoader** bridges `react-idle-timer` with TanStack Query's `focusManager` to pause refetch intervals when the user is idle (5 minutes of inactivity). Must be inside `QueryClientProvider` to access the focus manager. Queries with `refetchIntervalInBackground: true` are unaffected.
8. **Toaster** and **DebugProviders** are utility components that need React Query context.

---

## 12. Testing Strategy

**Files:** `test/tests.helpers.tsx`, `docs/rules/frontend/testing.instruction.md`

The full testing conventions, patterns, and code examples are maintained in [testing.instruction.md](../../docs/rules/frontend/testing.instruction.md). This section summarizes the key architectural decisions.

### Layered testing approach

| Layer | Strategy | Speed |
|---|---|---|
| Helpers | Pure unit tests, no providers | < 1ms |
| Query hooks | MSW + `renderHook` | ~50ms |
| Mutation hooks | MSW + `renderHook` | ~50ms |
| Controllers | MSW + `renderHook`, call handlers via `act()` | ~50ms |
| Components | Snapshot + DOM assertions, mock controller/auth | ~30ms |

### Core principles

1. **Mock at the MSW boundary** — Never mock service functions or Axios. Use `server.use(http.get(...))` to control API responses.
2. **Test controllers intensively** — Controllers are where business logic lives. Test pagination, filters, handlers, permissions, and derived state.
3. **No user interactions** — Never use `userEvent.click()` or `userEvent.type()`. Call controller handlers directly via `act(() => result.current.handleDelete("id")())`.
4. **Object Mother factories** — All mock data comes from `[feature].mother.ts` files, never inline literals. Use `overrides` to pin specific fields.
5. **Views = Snapshot + DOM** — Component tests mock `useLoggedUser` to control permissions, pass data from Object Mothers as props, and assert with snapshots or `screen.getByText()`.

### Provider tiering

| Scenario | Provider |
|---|---|
| Hook/controller with `useTranslation` or MSW | `TestProviders` |
| Hook that only needs React Query + Router | `MinimalTestProviders` (~60% faster) |
| Component with `AllowedAuth` | `renderWithTestProviders` + mock `useLoggedUser` |
| Permission-gated UI | `renderWithAdminUser` / `renderWithRegularUser` |
| Pure helper function | No wrapper needed |

### Standard mutation mock setup

Every mutation hook test uses the same three `vi.mock` blocks: `useQueryClient` (verify invalidation), `useMetrics` (verify events), `notifications` (verify toasts). See [testing.instruction.md](../../docs/rules/frontend/testing.instruction.md#2-mutation-hook-testing) for the reusable pattern.

---

## 13. Constants Conventions

**File:** `src/features/[feature]/[feature].constants.ts`

Every feature defines its constants in a single `[feature].constants.ts` file using consistent prefixes:

| Prefix | Purpose | Example |
|---|---|---|
| `MODULE_` | Module identification | `MODULE_TASKS = "tasks"` |
| `QUERY_KEY_` | React Query cache keys | `QUERY_KEY_TASKS = "tasks"` |
| `PERMISSION_` | Permission scope strings | `PERMISSION_TASKS_READ_ALL = "tasks:read:all"` |
| `ROUTE_ID_` | Route identification (dotted hierarchy) | `ROUTE_ID_TASKS_LIST = "admin.tasks.list"` |
| `MENU_ID_` | Menu item identification | `MENU_ID_TASKS = "menu.admin.tasks"` |
| `API_ENDPOINT_` | API URL paths/builders | `API_ENDPOINT_TASKS = "/v1/tasks"` |
| `EVENT_` | Analytics/metrics events | `EVENT_TASK_CREATED = "task_created"` |
| `DEFAULT_` | Default values for filters, limits | `DEFAULT_TASKS_LIMIT = 20` |
| `ERROR_` | Error code/message mappings | `ERROR_ORDERID_REQUIRED = "error:required:orderId"` |

Additionally, each feature defines a **query key factory** object (e.g., `taskKeys`, `orderKeys`) that builds hierarchical cache keys for precise invalidation.

---

## 14. Routes Dual Format

**File:** `src/features/[feature]/[feature].routes.ts`

Routes are defined with two formats in a single object:

```typescript
export const TASKS_ROUTES = {
  PATTERNS: {
    root: "/admin/tasks",
    list: "/admin/tasks/list",
    create: "/admin/tasks/create",
    edit: (id: string) => `/admin/tasks/${id}/edit`,
  },
  SEGMENTS: {
    root: "tasks",
    list: "tasks/list",
    create: "tasks/create",
    edit: "tasks/:taskId/edit",
  },
} as const;
```

- **PATTERNS** -- Absolute paths used for programmatic navigation (`<Link to={TASKS_ROUTES.PATTERNS.list}>`, `navigate(TASKS_ROUTES.PATTERNS.create)`). Dynamic segments are functions that accept parameters.
- **SEGMENTS** -- Relative path segments used in the React Router configuration (`path: TASKS_ROUTES.SEGMENTS.list`). Dynamic segments use React Router's `:param` syntax.

**Why two formats:** Navigation needs full absolute paths. Router configuration needs relative segments because routes are nested under a parent `/admin` layout. Having both in one place prevents the paths from drifting apart.

---

## 15. lib/ vs shared/

### `src/lib/` -- Framework-agnostic utilities

Pure TypeScript utility functions with no React dependency. Can be used in any JavaScript/TypeScript context.

| File | Purpose |
|---|---|
| `classnames.ts` | Conditional CSS class joining |
| `string.ts` | String manipulation utilities |
| `date.ts` | Date formatting and manipulation |
| `object.ts` | Object manipulation utilities |
| `format.ts` | Number/currency formatting |
| `parsers.ts` | Type coercion and parsing |
| `id.ts` | ID generation utilities |
| `file.ts` | File handling utilities |
| `compose-refs.ts` | Ref composition for React (border case) |
| `breakpoints.ts` | Breakpoint definitions |
| `storage/storage.ts` | Version-prefixed localStorage wrapper |
| `storage/indexed-db.ts` | IndexedDB wrapper for mock databases |
| `storage/msw-storage.ts` | MSW-specific storage utilities |
| `queryparams/` | URL query parameter helpers and hooks |
| `metrics/useMetrics.ts` | Metrics/analytics event reporting |
| `notifications/` | Toast notification abstraction |

### `src/shared/` -- React-specific, project-wide

React components, hooks, and utilities that are shared across features but contain no business logic.

| Directory | Purpose |
|---|---|
| `components/ui/` | shadcn/ui primitives (button, input, card, table, etc.) |
| `components/` | App-level shared components (Title, AdminMenuItems) |
| `layouts/` | Layout components (AdminLayout) |
| `hooks/` | Shared React hooks (useDebounce, useMobile, useDataTable, etc.) |
| `assets/locales/` | Shared translations |

The `shared` module also registers itself via `registerModule()` in `src/shared/index.ts` to contribute its locale resources to the i18n system.

---

## 16. Docker

### Production build (`Dockerfile`)

Multi-stage build:

1. **Build stage** (`node:22-alpine`) -- Installs pnpm, runs `pnpm install --frozen-lockfile`, copies the appropriate config file based on `CONFIG_ENV` build arg, runs `pnpm build`.
2. **Production stage** (`nginx:1.27-alpine-slim`) -- Copies built assets from the build stage, applies nginx configuration, runs health checks.

```
docker build --build-arg CONFIG_ENV=pro -t app .
```

### Development build (`Dockerfile.dev`)

Single stage with `node:22-alpine`. Runs `pnpm dev --host` with volume mounts for source code hot reload.

### Docker Compose (`docker-compose.yml`)

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "5173:5173"
    volumes:
      - ./src:/app/src
      - ./config:/app/config
      - ./public:/app/public
      - ./index.html:/app/index.html
    environment:
      - VITE_DEFAULT_DELAY=200
```

Volume mounts enable hot reload for source files, config, and public assets. The `VITE_DEFAULT_DELAY` environment variable controls mock API response delay.

---

## 17. Internationalization

**Files:** `src/app/features/i18n/components/I18nLoader.tsx`, `src/app/features/i18n/i18n.types.ts`, `src/features/[feature]/assets/locales/`

### Per-module locales

Each feature module contains its own translation files:

```
src/features/tasks/assets/locales/
  en.json
  es.json
  index.ts
```

The `index.ts` file exports a `LocaleResources` object:

```typescript
import en from "./en.json";
import es from "./es.json";
export const locales = { en, es } as LocaleResources;
```

This object is passed to `registerModule()` and deep-merged with all other module locales by `getAllLocalesResources()`.

### Flat key convention

Translation keys follow the pattern `module.entity.aspect`:

```json
{
  "translation": {
    "tasks.title": "Tasks",
    "tasks.page.list.title": "Tasks",
    "tasks.form.fields.title": "Title",
    "tasks.status.PENDING": "Pending",
    "tasks.errors.notFound": "Task not found",
    "tasks.validation.titleRequired": "Title is required"
  }
}
```

Subcategories include: `page`, `form.fields`, `form.placeholders`, `form.submit`, `status`, `priority`, `actions`, `table.columns`, `errors`, `success`, `validation`.

### I18nLoader

**File:** `src/app/features/i18n/components/I18nLoader.tsx`

Initializes i18next with:
- `LanguageDetector` for automatic locale detection (localStorage, navigator, HTML lang).
- All locale resources collected from registered modules.
- Supported languages defined by the `Locale` enum (`en`, `es`).
- Fallback language: English.

### Supported locales

Defined as an enum in `src/app/features/i18n/i18n.types.ts`:

```typescript
export enum Locale {
  EN = "en",
  ES = "es",
}
```

To add a new locale, add it to the enum and create corresponding JSON files in each feature's `assets/locales/` directory.
