# Plan: Transfer player-spa Architecture to Scaffolding Archetype

## Context

The repo at `/home/anthanh/code/rna/apps/packages/player-spa` contains a mature, production-grade architecture with modular features, comprehensive testing, runtime config, auth system, and developer tooling. This scaffolding repo (`vite-react-ts-scaffolding`) already has the foundations (module system, React Query, MSW, i18n, Tailwind v4, Vite 7) but lacks many patterns that make the player-spa productive: common utilities, tiered test providers, storage management, auth provider switching, API interceptors, Docker support, and comprehensive documentation.

The goal is to make this scaffolding a complete, minimal archetype that bootstraps new projects with all these patterns out of the box.

---

## Phase 0: Dependencies & shadcn/ui

### 0.1 Update dependencies
- Run `pnpm update` for latest patch/minor versions
- Remove accidental `"install": "^0.13.0"` from devDependencies in [package.json](package.json)
- Add `@tanstack/react-query-devtools` as devDependency (for debug providers)
- Add `date-fns` as dependency (for date utilities)
- Add `sonner` as dependency (real toast notifications)
- Verify all passes: `pnpm types:check && pnpm lint && pnpm test:run && pnpm build`

### 0.2 Add shadcn/ui
- Run `pnpm dlx shadcn@latest init` (New York style, OKLCH colors, components at `src/shared/components/ui/`)
- Add foundational components: `button`, `input`, `card`, `badge`, `dialog`, `dropdown-menu`, `table`, `separator`
- Sonner integration: replace console stubs in [notifications.ts](src/lib/notifications/notifications.ts) with sonner toast calls
- Add `<Toaster />` from sonner to [AppProviders.tsx](src/app/components/AppProviders.tsx)

---

## Phase 1: Core Infrastructure

### 1.1 Typed RuntimeConfig + feature flag helpers
- **Modify** [config.types.ts](src/app/features/config/config.types.ts): Replace `Record<string, any>` with typed `AppConfig` interface (app, endpoints, features, oauth sections)
- **Create** `src/app/features/config/config.helpers.ts`: `isMswEnabled()`, `isDebugMode()`, `isAnalyticsEnabled()`, `isBetaFeaturesEnabled()` — read from globalThis singleton
- **Create** `src/app/features/config/config.helpers.test.ts`

### 1.2 Storage Prefix Manager
- **Create** `src/lib/storage/storage.ts`:
  - `getAppVersion()` — reads `<meta name="app-version">`, fallback `"0.0.0-unknown"`
  - `getStorageKey(key)` — returns `"vite-react-ts-scaffolding:v{version}:{key}"`
  - `cleanOldStorageVersions()` — removes localStorage keys with older version prefixes
  - `storage` object: `getItem/setItem/removeItem` with auto-prefix
- **Create** `src/lib/storage/storage.test.ts`
- **Create** `src/lib/storage/indexed-db.ts` — generic `MockDatabase<T>` class wrapping IndexedDB for mock server persistence. CRUD ops: `getAll`, `getById`, `put`, `delete`, `clear`, `initialize`. Shared `mock-data` database with per-module stores.
- **Create** `src/lib/storage/indexed-db.test.ts`
- Add `fake-indexeddb` as devDependency (IndexedDB polyfill for vitest/jsdom)
- **Create** `src/lib/storage/msw-storage.ts` — re-exports IndexedDB helpers with `openMockStore(moduleName)` convenience

### 1.3 Vite htmlMetaTagsPlugin
- **Create** `src/app/features/vite-plugins/htmlMetaTagsPlugin.ts`: injects `<meta name="app-version">`, `<meta name="build-timestamp">`, `<meta name="environment">` into index.html during build
- **Modify** [vite.config.ts](vite.config.ts): add plugin
- **Modify** [main.tsx](src/main.tsx): call `cleanOldStorageVersions()` on startup

### 1.4 Add environment config files
- **Create** `config/config.dev.yml` (points to dev API, MSW off)
- **Create** `config/config.sta.yml` (staging, MSW off, debugMode on)
- **Create** `config/config.pro.yml` (production endpoints, all debug off)

---

## Phase 2: Common Library Utilities (`src/lib/`)

All pure functions, no React dependency. Each with tests.

### 2.1 String utilities
- **Create** `src/lib/string.ts`: `getInitials`, `getFullName`, `capitalize`, `truncate`
- **Create** `src/lib/string.test.ts`

### 2.2 Date utilities (wraps date-fns)
- **Create** `src/lib/date.ts`: `parseDate`, `formatDateValue`, `formatTimeValue`, `formatDateTimeValue`, `formatDistanceFromNow`, `getMonthName`, `getDayOfWeek`
- **Create** `src/lib/date.test.ts`

### 2.3 File utilities
- **Create** `src/lib/file.ts`: `getFileExtension`, `getFileName`, `getMimeType`, `formatFileSize`
- **Create** `src/lib/file.test.ts`

### 2.4 ID utilities
- **Create** `src/lib/id.ts`: `generateUUID` (native `crypto.randomUUID()`), `generateId`
- **Create** `src/lib/id.test.ts`

### 2.5 Format utilities
- **Create** `src/lib/format.ts`: `formatCurrency`, `formatNumber`, `formatPercentage` (using `Intl.NumberFormat`)
- **Create** `src/lib/format.test.ts`

### 2.6 Parsers
- **Create** `src/lib/parsers.ts`: `safeParseInt`, `safeParseFloat`, `safeParseJSON`, `safeParseBoolean`
- **Create** `src/lib/parsers.test.ts`

### 2.7 Compose refs
- **Create** `src/lib/compose-refs.ts`: `composeRefs` for combining React refs
- **Create** `src/lib/compose-refs.test.ts`

### 2.8 Breakpoints
- **Create** `src/lib/breakpoints.ts`: Tailwind v4 breakpoint constants (`sm`, `md`, `lg`, `xl`, `2xl`)
- **Create** `src/lib/breakpoints.test.ts`

---

## Phase 3: Common Hooks (`src/shared/hooks/`)

### 3.1 Core utility hooks
- `useDebounce.ts` + test — debounce a value
- `useDebouncedCallback.ts` + test — debounce a callback
- `useCallbackRef.ts` — stable callback ref
- `useLockBodyScroll.ts` + test — prevent body scroll (modals)

### 3.2 Viewport/media hooks
- `useMediaQuery.ts` + test — wraps `window.matchMedia`
- `useMobile.ts` + test — uses useMediaQuery with Tailwind `md` breakpoint
- `useRtl.ts` + test — detects RTL via `document.dir`

### 3.3 Scroll/intersection hooks
- `useInView.ts` + test — IntersectionObserver wrapper
- `useInfiniteScroll.ts` + test — triggers callback when element visible
- `useElementScroll.ts` — tracks scroll position
- `useScrollToInput.ts` — scrolls to first invalid form input

### 3.4 Navigation/routing hooks
- `useNavigationBlocker.ts` + test — wraps React Router `useBlocker` for unsaved changes
- `useUrlModal.ts` + test — modal state via URL search params

### 3.5 Data/query hooks
- `usePaginatedQuery.ts` + test — thin wrapper around useQuery with pagination
- `useDataTable.ts` + test — sorting + filtering + pagination state

### 3.6 Misc hooks
- `useImagePreloader.ts` — preloads images with localStorage cache (uses storage manager)
- `useAppVersion.ts` — reads version from meta tag

---

## Phase 4: API Module Enhancements

### 4.1 Fix filename typo + create Axios instance with interceptors
- **Rename** `src/app/features/api/api.contants.ts` → `api.constants.ts`
- Update all imports (4 files reference it)
- **Modify** [api.ts](src/app/features/api/api.ts): create configured Axios instance with:
  - Request interceptor: inject `Authorization: Bearer {token}` header
  - Response interceptor: handle 401 → token refresh → retry original request
  - Prevent multiple simultaneous refresh attempts via promise queue
- **Create** `src/app/features/api/api.interceptors.ts` — separated interceptor logic
- **Create** `src/app/features/api/api.interceptors.test.ts`

### 4.2 Auth token store
- **Create** `src/app/features/auth/auth.token.ts`: in-memory `getAccessToken`, `setAccessToken`, `clearAccessToken`
- **Create** `src/app/features/auth/auth.token.test.ts`

---

## Phase 5: Auth System Enhancements

### 5.1 Auth provider switching (mock vs real)
- **Create** `src/app/features/auth/providers/AuthContext.ts` — global singleton context with `login`, `logout`, `refreshToken`, `user`, `isAuthenticated`, `isPending`
- **Create** `src/app/features/auth/providers/AuthProvider.tsx` — switches between Mock/Simple based on config `oauth.disabled`
- **Create** `src/app/features/auth/providers/MockAuthProvider.tsx` — uses mock DB, simulates login/logout
- **Create** `src/app/features/auth/providers/SimpleAuthProvider.tsx` — real auth flow placeholder (token management, refresh)
- **Modify** [useLoggedUser.ts](src/app/features/auth/hooks/useLoggedUser.ts) — read from AuthContext instead of hardcoded mock
- **Modify** [AppProviders.tsx](src/app/components/AppProviders.tsx) — add `AuthProvider` wrapping children (inside ConfigLoader, before QueryClientProvider)

### 5.2 Enhanced mock auth
- **Create** `src/app/features/auth/__mocks__/auth.mock-db.ts` — in-memory DB with multiple profiles
- **Create** `src/app/features/auth/auth.mock.handlers.ts` — MSW handlers for login/logout/refresh/me endpoints
- **Modify** [user.mother.ts](src/app/features/auth/__mocks__/user.mother.ts): add `getMockAdminUser()`, `getMockStaffUser()`, `getMockRegularUser()`
- **Modify** [SignInPage.tsx](src/app/features/auth/pages/SignInPage.tsx): show mock user selection dropdown in dev mode
- **Modify** `src/app/features/auth/index.tsx`: register `getMockHandlers` in module

---

## Phase 6: Test Infrastructure

### 6.1 Tiered test providers
- **Modify** [tests.helpers.tsx](test/tests.helpers.tsx):
  - Add `MinimalTestProviders` — only QueryClientProvider + MemoryRouter (no config loading, no MSW, no i18n). ~60% faster than full providers
  - Add `MinimalTestApp` — minimal providers + real routing
  - Add role-specific renderers: `renderWithAdminUser()`, `renderWithStaffUser()`, `renderWithRegularUser()`
  - Add `renderHookWithProviders()` — lightweight hook testing
  - Test-optimized QueryClient: `retry: false, gcTime: 0, staleTime: 0, refetchOnWindowFocus: false`

### 6.2 Vitest config enhancements
- **Modify** [vite.config.ts](vite.config.ts) test section:
  - Add pool config: `pool: "forks"`, `poolOptions: { forks: { minForks: 2, maxForks: 4 } }`
  - Expand coverage excludes: `*.types.ts`, `*.constants.ts`, `**/index.tsx`, `**/config/**`, `**/ui/**` (shadcn generated)

---

## Phase 7: Mock Server Improvements

### 7.1 MockProvider resilience
- **Modify** [MockProvider.tsx](src/app/features/mock-server/providers/MockProvider.tsx):
  - Add startup timeout (5 seconds) — render children even if MSW hangs
  - Add StrictMode guard via `cancelled` flag
  - Use config helper `isMswEnabled()` instead of direct config access

---

## Phase 8: Debug Providers

### 8.1 Conditional React Query DevTools
- **Create** `src/app/features/debug/components/DebugProviders.tsx`:
  - Lazy-loads `@tanstack/react-query-devtools` only when `isDebugMode()` is true
  - Uses dynamic `import()` + state to avoid production bundle bloat
- **Modify** [AppProviders.tsx](src/app/components/AppProviders.tsx): add `DebugProviders` inside QueryClientProvider

---

## Phase 9: Docker

### 9.1 Production Dockerfile
- **Create** `Dockerfile`: multi-stage (Node 22 build → nginx:alpine-slim serve)
  - `CONFIG_ENV` build arg selects which YAML config to bake
  - Healthcheck on `/healthz`
  - Entrypoint script for runtime config injection

### 9.2 Dev Dockerfile
- **Create** `Dockerfile.dev`: single-stage Node, runs `pnpm dev --host`
- **Create** `docker/nginx.conf`: SPA routing (try_files), gzip, cache headers
- **Create** `docker/entrypoint.sh`: copies config based on `APP_ENV` env var
- **Create** `docker-compose.yml`: dev service with volume mounts for hot reload
- **Create** `.dockerignore`: exclude node_modules, dist, reports, .git, .claude, .cursor

---

## Phase 10: Tasks Reference Module (NEW — replaces Orders as canonical example)

This is the **primary reference module** that demonstrates ALL conventions from the player-spa widgets module, adapted for a simple "task management" domain. It serves as the template for creating new modules.

### 10.1 Constants (`src/features/tasks/tasks.constants.ts`)

Following widget-level conventions:

```
// Module identification
MODULE_TASKS = "tasks"

// Route IDs (dotted hierarchy)
ROUTE_ID_TASKS = "admin.tasks"
ROUTE_ID_TASKS_LIST = "admin.tasks.list"
ROUTE_ID_TASKS_CREATE = "admin.tasks.create"
ROUTE_ID_TASKS_EDIT = "admin.tasks.edit"

// Menu IDs (dotted hierarchy with "menu." prefix)
MENU_ID_TASKS = "menu.admin.tasks"
MENU_ID_TASKS_LIST = "menu.admin.tasks.list"

// API Endpoints (static + function-based)
API_ENDPOINT_TASKS = "/v1/tasks"
API_ENDPOINT_TASK_BY_ID = (id: string) => `/v1/tasks/${id}`

// Query Key Factory (hierarchical, composable)
taskKeys = {
  all: [QUERY_KEY_TASKS],
  lists: () => [...taskKeys.all, "list"],
  list: (filters: Record<string, unknown>) => [...taskKeys.lists(), filters],
  details: () => [...taskKeys.all, "detail"],
  detail: (id: string) => [...taskKeys.details(), id],
}

// Permissions (module:action:scope format)
PERMISSION_TASKS_READ_ALL = "tasks:read:all"
PERMISSION_TASKS_WRITE_ALL = "tasks:write:all"
PERMISSION_TASKS_ADMIN_ALL = "tasks:admin:all"

// Default filters (offset-based pagination)
DEFAULT_TASKS_LIMIT = 20
DEFAULT_TASKS_OFFSET = 0
DEFAULT_TASKS_FILTERS = { offset: 0, limit: 20 }

// Sorting defaults
DEFAULT_TASKS_SORT = "-createdAt"
TASK_SORTABLE_FIELDS = ["title", "status", "priority", "dueDate", "createdAt", "updatedAt"]

// Error code → i18n key mapping
TASK_ERROR_MESSAGES = { "ERR-TASK-001": "tasks.errors.notFound", ... }

// Analytics events
EVENT_TASK_VIEWED = "task_viewed"
EVENT_TASK_CREATED = "task_created"
EVENT_TASK_UPDATED = "task_updated"
EVENT_TASK_DELETED = "task_deleted"
EVENT_TASK_STATUS_CHANGED = "task_status_changed"
```

### 10.2 Routes (`src/features/tasks/tasks.routes.ts`)

Dual-format routes (PATTERNS for navigation, SEGMENTS for router config):

```
TASKS_ROUTES = {
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
}
```

### 10.3 Enums (`src/features/tasks/tasks.enums.ts`)

```
TaskStatus: PENDING, IN_PROGRESS, COMPLETED, CANCELLED
TaskPriority: LOW, MEDIUM, HIGH, CRITICAL
```

### 10.4 Types (`src/features/tasks/tasks.types.ts`)

```
// Response type (what API returns)
TaskResponse { id, title, description, status, priority, assignee, dueDate, createdAt, updatedAt }

// Request types (what we send)
TaskCreateRequest { title, description?, status?, priority?, assignee?, dueDate? }
TaskUpdateRequest (Partial<TaskCreateRequest>)

// Filter type (dot-notation for API query params)
TaskFilters { "status.eq"?, "status.in"?, "priority.eq"?, "assignee.eq"?, "dueDate.lte"?, "dueDate.gte"?, search?, offset?, limit?, sort? }

// List response (paginated)
TaskListResponse = PaginatedResponse<TaskResponse[]>
```

### 10.5 Schemas (`src/features/tasks/tasks.schemas.ts`)

Zod validation schemas:
- `taskFormSchema` — validates create/edit form data
- `taskFiltersSchema` — validates API filter params
- `TaskFormData` type inferred from schema

### 10.6 Helpers (`src/features/tasks/tasks.helpers.ts`)

Business logic functions:
- `getStatusBadgeVariant(status)` — maps TaskStatus to UI variant
- `getPriorityBadgeVariant(priority)` — maps TaskPriority to UI variant
- `isTaskOverdue(task)` — checks if dueDate < now and not completed
- `buildTaskSortQuery(sorting)` — TanStack Table → API sort format (e.g., `"-createdAt"`)
- `mapColumnFiltersToTaskFilters(columnFilters, globalFilter)` — column filters → API params
- `getTaskStatusLabel(status)` — i18n key for status display

### 10.7 Services (`src/features/tasks/tasks.services.ts`)

Full CRUD API calls using configured Axios instance:
- `listTasks(filters?)` → GET with query params
- `getTaskById(id)` → GET single
- `createTask(data)` → POST
- `updateTask(id, data)` → PUT (full replace)
- `partialUpdateTask(id, data)` → PATCH (partial update)
- `deleteTask(id)` → DELETE

Exported as `tasksService` object (for easy mocking/testing).

### 10.8 Hooks (`src/features/tasks/hooks/`)

**Query hooks** (read operations):
- `useTasks(filters?)` — list with query key factory, `enabled` guard for search length
- `useTask(id)` — single task detail, `enabled: !!id`

**Mutation hooks** (write operations):
- `useCreateTask()` — creates task, invalidates lists, meta with success/error messages
- `useUpdateTask()` — updates task, invalidates detail + lists
- `usePartialUpdateTask()` — PATCH for status changes etc.
- `useDeleteTask()` — deletes, invalidates lists

**Permission hook**:
- `useTasksPermissions()` — returns `{ canRead, canWrite, canAdmin, canCreate, canUpdate, canDelete }`

**Controller hooks** (compose everything):
- `useTasksListController(columnFilters, globalFilter, sorting, pagination)` — maps DataTable state to API filters, returns tasks + metadata + handlers
- `useTaskFormController({ task?, onSuccess? })` — form state, submission, edit/create mode detection

### 10.9 Components (`src/features/tasks/components/`)

- `TasksList.tsx` — table with shadcn `Table`, status badges, priority badges, actions column with delete (permission-wrapped)
- `TaskForm.tsx` — create/edit form using shadcn `Input`, `Select`, date picker, with Zod validation
- `TaskStatusBadge.tsx` — color-coded status badge
- `TaskPriorityBadge.tsx` — color-coded priority badge

### 10.10 Pages (`src/features/tasks/pages/`)

- `TasksListPage.tsx` — page wrapper with controller hook, search, filters, pagination
- `TaskFormPage.tsx` — create/edit page with form controller

### 10.11 Mock files (`src/features/tasks/__mocks__/`)

**Mother object** (`task.mother.ts`):
- `getRandomTask(overrides?)` — single task with faker
- `getRandomList(count, overrides?)` — array of tasks
- `getRandomPage(offset, limit)` — paginated response with total count

**Mock database** (`tasks.mock-db.ts`):
- Uses **IndexedDB** for persistence (survives HMR, page refreshes, and tab closes)
- Thin async wrapper: `getMockDb("tasks")` returns typed store
- Initialized lazily with `taskMother.getRandomList(50)` on first access
- Methods: `getAll()`, `getById(id)`, `create(item)`, `update(id, item)`, `remove(id)`, `reset()`
- All MSW handlers use `await db.getAll()` etc. (MSW handlers support async)

**Shared IndexedDB utility** (`src/lib/storage/indexed-db.ts`) — NEW:
- Generic `MockDatabase<T>` class wrapping IndexedDB
- `openMockStore(storeName)` — opens/creates store in a shared `mock-data` database
- CRUD operations: `getAll()`, `getById(id)`, `put(item)`, `delete(id)`, `clear()`
- `initialize(items)` — seeds data only if store is empty
- Handles versioning for schema migrations
- Works in both browser (MSW browser worker) and test (via `fake-indexeddb` polyfill)
- Add `fake-indexeddb` as devDependency for vitest

**MSW handlers** (`tasks.mock.handlers.ts`):
- Full CRUD: GET list (with filtering, sorting, pagination), GET detail, POST, PUT, PATCH, DELETE
- Proper HTTP status codes (200, 201, 204, 404)
- Realistic delay via `delay()` utility
- Error responses for missing resources

### 10.12 Locales (`src/features/tasks/assets/locales/`)

i18n key convention following `module.entity.aspect.subaspect`:
```
tasks.title, tasks.page.list.title, tasks.page.list.description
tasks.form.newTask, tasks.form.editTask
tasks.form.fields.title, tasks.form.fields.description, tasks.form.fields.status
tasks.form.placeholders.title, tasks.form.descriptions.title
tasks.status.PENDING, tasks.status.IN_PROGRESS, tasks.status.COMPLETED, tasks.status.CANCELLED
tasks.priority.LOW, tasks.priority.MEDIUM, tasks.priority.HIGH, tasks.priority.CRITICAL
tasks.errors.notFound, tasks.errors.createFailed
tasks.success.created, tasks.success.updated, tasks.success.deleted
tasks.table.columns.title, tasks.table.columns.status, tasks.table.columns.priority
tasks.filters.status.label, tasks.filters.priority.label
```

### 10.13 Module registration (`src/features/tasks/index.tsx`)

- Routes with `lazy()` for code splitting
- Menu items with `parentId` hierarchy and `isAllowed` permission checks
- Permission-based `isAllowed` on routes: `(user) => user?.permissions.includes(PERMISSION_TASKS_ADMIN_ALL)`
- Exports: `locales`, `getMockHandlers`, `permissions` array
- Register in `src/app/features/modules/modules.ts` via side-effect import

### 10.14 Tests

- `useTasksListController.test.ts` — controller logic with mocked service hooks
- `useCreateTask.test.ts` — mutation hook test with MSW
- `useTasksPermissions.test.ts` — permission flag tests per role
- `TasksList.test.tsx` — component rendering with different permission levels
- `TasksListPage.test.tsx` — integration test with MinimalTestProviders

---

## Phase 11: Update Orders Module

### 11.1 Align Orders with new conventions
- **Modify** Orders components to use shadcn `Button`, `Badge`, `Card`
- **Modify** [orders.services.ts](src/features/orders/orders.services.ts): use configured Axios instance
- **Modify** Orders to use `formatCurrency()` and `formatDateValue()` from lib
- **Modify** [AdminLayout.tsx](src/shared/layouts/AdminLayout.tsx): use shadcn components where appropriate
- Add `orders.routes.ts` with PATTERNS/SEGMENTS dual format
- Add query key factory to `orders.constants.ts`

---

## Phase 12: Documentation

### 12.1 Architecture document
- **Create** `docs/architecture/ARCHITECTURE.md`: comprehensive doc explaining every architectural decision and WHY:
  - Module system (self-registering, globalThis singleton, side-effect imports)
  - Controller hook pattern (testability, single responsibility)
  - Service hooks + React Query (caching, error meta, global notification)
  - RuntimeConfig with YAML (one build, many environments)
  - Storage prefix manager (version isolation, auto-cleanup)
  - Auth provider switching (mock for dev, real for prod)
  - Permission system (scopes-based, declarative)
  - MSW organization (per-module handlers, mother objects)
  - Provider chain order and WHY
  - Test provider tiering (MinimalTestProviders for speed)
  - Constants conventions (MODULE_, QUERY_KEY_, PERMISSION_, etc.)
  - lib/ vs shared/ separation (framework-agnostic vs React-specific)

### 12.2 Module creation guide
- **Create** `docs/guides/module-creation.md`: step-by-step instructions for creating a new feature module (15 steps from constants to tests)

### 12.3 Patterns cheatsheet
- **Create** `docs/guides/patterns-cheatsheet.md`: quick-reference table of all patterns with file paths and examples

### 12.4 Enhanced agent docs
- **Modify** [CLAUDE.md](CLAUDE.md): add project summary, quick commands, key architectural decisions, reference module pointer, module creation checklist
- **Modify** [.cursor/rules/README.md](.cursor/rules/README.md): mirror enhanced structure
- **Modify** [.github/copilot-instructions.md](.github/copilot-instructions.md): mirror enhanced structure

### 12.5 Update existing rules
- **Modify** [stack.instruction.md](docs/rules/frontend/stack.instruction.md): add shadcn/ui, date-fns, sonner
- **Modify** [project-structure.instruction.md](docs/rules/frontend/project-structure.instruction.md): add `shared/components/ui/`, `shared/hooks/`, `lib/storage/`, `docker/`
- **Modify** [testing.instruction.md](docs/rules/frontend/testing.instruction.md): document MinimalTestProviders vs TestProviders decision tree

---

## Verification

After implementation, verify end-to-end:

1. `pnpm install` — clean install succeeds
2. `pnpm types:check` — no TypeScript errors
3. `pnpm lint` — no linting errors
4. `pnpm test:run` — all tests pass (existing + new)
5. `pnpm build` — production build succeeds
6. `pnpm dev` — dev server starts, MSW works, mock login works
7. `docker build -t scaffolding .` — Docker build succeeds
8. `docker compose up` — dev Docker works with hot reload

---

## Intentional Simplifications for Scaffolding

| Player-SPA Feature | Scaffolding Decision | Reason |
|---|---|---|
| User agent utilities | Skip | Too project-specific |
| Sentry plugin | Skip | Requires per-project DSN |
| Full OAuth/Keycloak flow | Placeholder in SimpleAuthProvider | Projects customize their own auth |
| 50+ shadcn components | Only 8 foundational ones | Projects add more via `pnpm dlx shadcn add` |
| Icon picker with search/virtualization | Skip | Too complex for archetype |
| Basic auth in dev Docker | Skip | Not needed for scaffolding |
| Fuse.js fuzzy search | Skip | Project-specific |
| Service worker for PWA | Skip | Project-specific |

---

## Estimated Scope

| Phase | New Files | Modified Files |
|---|---|---|
| 0: Deps & shadcn | ~10 | 3 |
| 1: Config, Storage, Meta | 8 | 4 |
| 2: Lib utilities | 16 | 0 |
| 3: Shared hooks | ~30 | 0 |
| 4: API enhancements | 4 | 3 |
| 5: Auth enhancements | 6 | 5 |
| 6: Test infrastructure | 0 | 2 |
| 7: Mock server | 0 | 1 |
| 8: Debug providers | 1 | 1 |
| 9: Docker | 5 | 0 |
| 10: Tasks module (reference) | ~30 | 2 |
| 11: Orders update | 2 | 4 |
| 12: Documentation | 5 | 5 |
| **Total** | **~117** | **~30** |
