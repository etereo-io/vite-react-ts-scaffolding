# Patterns Cheatsheet

Quick-reference for all architectural patterns, naming conventions, and file locations.

---

## Hook Patterns

| Pattern | Naming | Location | Purpose |
|---|---|---|---|
| **Controller hook** | `use[Feature]Controller()` | `src/features/[feature]/hooks/` | Composes service hooks + permissions + local state + handlers. All business logic lives here. |
| **Query hook** | `use[Entity]()` or `use[Entities]()` | `src/features/[feature]/hooks/` | Wraps `useQuery` with service fn, query key factory, and error meta. One hook per file. |
| **Mutation hook** | `use[Action][Entity]()` | `src/features/[feature]/hooks/` | Wraps `useMutation` with cache invalidation, metrics, success/error messages. One hook per file. |
| **Permission hook** | `use[Feature]Permissions()` | `src/features/[feature]/hooks/` | Composes `useUserAuth().isAllowed()` into derived booleans (`canRead`, `canWrite`, `canDelete`). |

### Controller hook anatomy

```typescript
export function useTasksListController(options) {
  const permissions = useTasksPermissions();       // 1. Permissions
  const deleteTask = useDeleteTask();               // 2. Mutations
  const { data } = useTasks(filters);               // 3. Queries
  const totalPages = useMemo(() => ..., []);        // 4. Derived state
  const handleDelete = useCallback(() => ..., []);  // 5. Handlers
  return { ...permissions, tasks, handleDelete };   // 6. Return everything
}
```

---

## Service Patterns

| Pattern | Naming | Location | Purpose |
|---|---|---|---|
| **Service object** | `[feature]Service` | `src/features/[feature]/[feature].services.ts` | Pure API calls via `apiClient`. No error handling (delegated to hooks). |
| **Service function** | `listTasks`, `getTaskById`, `createTask` | Inside service file | Action-verb naming. Returns `apiClient.get(...).then(res => res.data)`. |

### Service anatomy

```typescript
import { apiClient } from "@/app/features/api/api";
import { API_ENDPOINT_TASKS } from "./tasks.constants";

function listTasks(filters?: TaskFilters) {
  return apiClient.get<TaskListResponse>(API_ENDPOINT_TASKS, { params: filters })
    .then((res) => res.data);
}

export const tasksService = { listTasks, getTaskById, createTask, updateTask, deleteTask };
```

---

## Constants Naming

| Prefix | Pattern | Example | File |
|---|---|---|---|
| `MODULE_` | Module identifier | `MODULE_TASKS = "tasks"` | `[feature].constants.ts` |
| `QUERY_KEY_` | React Query base key | `QUERY_KEY_TASKS = "tasks"` | `[feature].constants.ts` |
| `PERMISSION_` | Permission scope (`module:action:scope`) | `PERMISSION_TASKS_READ_ALL = "tasks:read:all"` | `[feature].constants.ts` |
| `ROUTE_ID_` | Route identifier (dotted) | `ROUTE_ID_TASKS_LIST = "admin.tasks.list"` | `[feature].constants.ts` |
| `MENU_ID_` | Menu item identifier | `MENU_ID_TASKS = "menu.admin.tasks"` | `[feature].constants.ts` |
| `API_ENDPOINT_` | API URL path | `API_ENDPOINT_TASKS = "/v1/tasks"` | `[feature].constants.ts` |
| `EVENT_` | Analytics event name | `EVENT_TASK_CREATED = "task_created"` | `[feature].constants.ts` |
| `DEFAULT_` | Default values | `DEFAULT_TASKS_LIMIT = 20` | `[feature].constants.ts` |
| `ERROR_` | Error identifiers | `ERROR_ORDERID_REQUIRED = "error:required:orderId"` | `[feature].constants.ts` |

### Query key factory

```typescript
export const taskKeys = {
  all:      [QUERY_KEY_TASKS] as const,
  lists:    () => [...taskKeys.all, "list"] as const,
  list:     (filters) => [...taskKeys.lists(), filters] as const,
  details:  () => [...taskKeys.all, "detail"] as const,
  detail:   (id) => [...taskKeys.details(), id] as const,
};
```

---

## Testing Patterns

### Provider tiering

| Provider | What it includes | Speed | Use when |
|---|---|---|---|
| `MinimalTestProviders` | QueryClient + MemoryRouter | Fast | Testing hooks/components that only need React Query and routing |
| `TestProviders` | Full AppProviders + MemoryRouter | Slower | Testing components that need i18n, config, MSW, auth |
| `TestApp` | Full AppProviders + createMemoryRouter | Slower | Integration tests with real route matching |
| None | No wrapper | Fastest | Pure helper/utility function tests |

### Render helpers

| Helper | Purpose | File |
|---|---|---|
| `renderWithTestProviders(ui)` | Renders with full providers | `test/tests.helpers.tsx` |
| `renderHookWithProviders(hook)` | Renders hook with minimal providers | `test/tests.helpers.tsx` |
| `renderWithAdminUser(ui)` | Mocks `useLoggedUser` with admin role | `test/tests.helpers.tsx` |
| `renderWithStaffUser(ui)` | Mocks `useLoggedUser` with staff role | `test/tests.helpers.tsx` |
| `renderWithRegularUser(ui)` | Mocks `useLoggedUser` with no permissions | `test/tests.helpers.tsx` |

### Testing strategy per layer

| Layer | Test approach | Wrapper |
|---|---|---|
| **Helpers** | Direct function calls, no providers | None |
| **Services** | Call service function, MSW intercepts | MSW server |
| **Query hooks** | `renderHook`, verify data/loading/error | `MinimalTestProviders` |
| **Controller hooks** | `renderHook`, test handlers and derived state | `MinimalTestProviders` |
| **Components** | Mock controller, snapshot render | `MinimalTestProviders` |
| **Pages** | Integration with real or mocked controllers | `TestProviders` or `TestApp` |

### Controller test example

```typescript
import { renderHookWithProviders } from "#/tests.helpers";
import { useTasksListController } from "../useTasksListController";

test("returns empty tasks array when no data", async () => {
  const { result } = renderHookWithProviders(() => useTasksListController());
  expect(result.current.tasks).toEqual([]);
});
```

### Component test example (mocked controller)

```typescript
vi.mock("../hooks/useTasksListController");

const mockController = {
  tasks: [], total: 0, totalPages: 0,
  isFetching: false, isError: false, canDelete: false,
  handleDeleteTask: vi.fn(),
};

beforeEach(() => {
  vi.mocked(useTasksListController).mockReturnValue(mockController);
});

test("renders empty state", () => {
  const { container } = renderWithTestProviders(<TasksListPage />);
  expect(container).toMatchSnapshot();
});
```

---

## Mock Patterns

### Mother objects

| Pattern | Naming | Location | Purpose |
|---|---|---|---|
| **Mother object** | `[entity]Mother` | `src/features/[feature]/__mocks__/[entity].mother.ts` | Faker-based test data factories |
| **`getRandomTask()`** | Single entity | Mother file | Returns one entity with optional overrides |
| **`getRandomList(count)`** | Entity array | Mother file | Returns array of random entities |
| **`getRandomPage(offset, limit)`** | Paginated response | Mother file | Returns `{ data, total, offset, limit }` |

### Mock database

| Pattern | Naming | Location | Purpose |
|---|---|---|---|
| **Mock DB** | `[feature]MockDb` | `src/features/[feature]/__mocks__/[feature].mock-db.ts` | IndexedDB-backed CRUD store for MSW handlers |
| **`openMockStore<T>(name)`** | Store factory | `src/lib/storage/indexed-db.ts` | Creates a `MockDatabase<T>` instance |

### MSW handler factory

| Pattern | Naming | Location | Purpose |
|---|---|---|---|
| **Handler factory** | `build[Entity][Action]Handler()` | `src/features/[feature]/[feature].mock.handlers.ts` | Returns individual `http.get/post/put/delete` handler |
| **Handler aggregator** | `getMockHandlers()` | Same file | Returns array of all handlers for the module |

```typescript
export const getMockHandlers = () => [
  buildTasksListHandler(),
  buildTaskDetailHandler(),
  buildTaskCreateHandler(),
  // ...
];
```

**Key rules:**
- Use `API_MOCK_PREFIX` (`/mock`) in handler URLs.
- Use `delay(DEFAULT_DELAY)` for realistic response timing.
- Use the mock-db for CRUD persistence (survives HMR).

---

## Route Patterns

| Format | Purpose | Example | Usage |
|---|---|---|---|
| **PATTERNS** (absolute) | Programmatic navigation | `"/admin/tasks/list"` | `<Link to={TASKS_ROUTES.PATTERNS.list}>` |
| **PATTERNS** (dynamic) | Navigation with params | `(id) => \`/admin/tasks/${id}/edit\`` | `navigate(TASKS_ROUTES.PATTERNS.edit(taskId))` |
| **SEGMENTS** (relative) | Router config | `"tasks/list"` | `{ path: TASKS_ROUTES.SEGMENTS.list, lazy: TasksListPage }` |
| **SEGMENTS** (dynamic) | Router config with params | `"tasks/:taskId/edit"` | `{ path: TASKS_ROUTES.SEGMENTS.edit, lazy: TaskFormPage }` |

### Route file

```typescript
// src/features/tasks/tasks.routes.ts
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

---

## Permission Patterns

### Permission format

```
module:action:scope
```

Examples: `tasks:read:all`, `tasks:write:all`, `tasks:admin:all`, `orders:delete`

### Permission checking methods

| Method | Where | Example |
|---|---|---|
| **`isAllowed(permission)`** | Hook / JS logic | `const canRead = isAllowed(PERMISSION_TASKS_READ_ALL)` |
| **`<AllowedAuth permissions={...}>`** | JSX / declarative | `<AllowedAuth permissions={PERMISSION_TASKS_WRITE_ALL}><Button>Create</Button></AllowedAuth>` |
| **`isAllowed` on MenuItem** | Module registration | `isAllowed: (user) => user.permissions?.includes(PERMISSION_TASKS_READ_ALL)` |

### Permission composition in permission hook

```typescript
export function useTasksPermissions() {
  const { isAllowed } = useUserAuth();
  const canRead = isAllowed(PERMISSION_TASKS_READ_ALL);
  const canWrite = isAllowed(PERMISSION_TASKS_WRITE_ALL);
  const canAdmin = isAllowed(PERMISSION_TASKS_ADMIN_ALL);
  const canCreate = canWrite || canAdmin;
  const canDelete = canAdmin;
  return { canRead, canWrite, canAdmin, canCreate, canDelete };
}
```

---

## i18n Key Conventions

### Key structure

```
module.entity.aspect
```

### Key categories

| Category | Pattern | Example |
|---|---|---|
| **Module title** | `module.title` | `tasks.title` |
| **Page titles** | `module.page.[page].title` | `tasks.page.list.title` |
| **Page descriptions** | `module.page.[page].description` | `tasks.page.list.description` |
| **Form field labels** | `module.form.fields.[field]` | `tasks.form.fields.title` |
| **Form placeholders** | `module.form.placeholders.[field]` | `tasks.form.placeholders.title` |
| **Form submit buttons** | `module.form.submit.[action]` | `tasks.form.submit.create` |
| **Enum labels** | `module.[enum].[VALUE]` | `tasks.status.PENDING` |
| **Action buttons** | `module.actions.[action]` | `tasks.actions.create` |
| **Table columns** | `module.table.columns.[column]` | `tasks.table.columns.title` |
| **Empty states** | `module.table.empty` | `tasks.table.empty` |
| **Error messages** | `module.errors.[error]` | `tasks.errors.notFound` |
| **Success messages** | `module.success.[action]` | `tasks.success.created` |
| **Validation messages** | `module.validation.[rule]` | `tasks.validation.titleRequired` |

### Locale file structure

```
src/features/[feature]/assets/locales/
  en.json     # English translations
  es.json     # Spanish translations
  index.ts    # Exports { en, es } as LocaleResources
```

---

## File Naming Quick Reference

| Type | Convention | Example |
|---|---|---|
| Component | PascalCase `.tsx` | `TasksList.tsx` |
| Hook | camelCase with `use` prefix `.ts` | `useTasksListController.ts` |
| Service | `[domain].services.ts` | `tasks.services.ts` |
| Types | `[domain].types.ts` | `tasks.types.ts` |
| Constants | `[domain].constants.ts` | `tasks.constants.ts` |
| Enums | `[domain].enums.ts` | `tasks.enums.ts` |
| Schemas | `[domain].schemas.ts` | `tasks.schemas.ts` |
| Helpers | `[domain].helpers.ts` | `tasks.helpers.ts` |
| Routes | `[domain].routes.ts` | `tasks.routes.ts` |
| Mock handlers | `[domain].mock.handlers.ts` | `tasks.mock.handlers.ts` |
| Mother object | `[entity].mother.ts` | `task.mother.ts` |
| Mock database | `[domain].mock-db.ts` | `tasks.mock-db.ts` |
| Test file | same name + `.test.ts(x)` | `tasks.helpers.test.ts` |
| Page | PascalCase + `Page.tsx` | `TasksListPage.tsx` |

---

## Import Architecture

```
Pages               (top)
  |
Components
  |
Controller Hooks
  |
Service Hooks
  |
Services
  |
Helpers / Utils
  |
Constants
  |
Types               (bottom)
```

**Rule:** Only import from the same layer or lower. Never import upward.

### Import order within a file

1. External libraries (`react`, `@tanstack/react-query`, `msw`)
2. Internal shared utilities (`@/lib/`, `@/shared/`)
3. Current feature -- bottom to top (types, constants, helpers, services, hooks, components)
4. Cross-feature imports (same layer or lower only)

---

## Module Registration

```typescript
// src/features/tasks/index.tsx
registerModule({
  name: MODULE_TASKS,          // Unique module identifier
  routes,                       // RouteObject[] for React Router
  menuItems,                    // MenuItem[] for sidebar navigation
  locales,                      // { en, es } locale resources
  getMockHandlers,              // () => MSW RequestHandler[]
  permissions: [                // string[] of all module permissions
    PERMISSION_TASKS_READ_ALL,
    PERMISSION_TASKS_WRITE_ALL,
    PERMISSION_TASKS_ADMIN_ALL
  ]
});
```

Activate in `src/app/features/modules/modules.ts`:

```typescript
import "@/features/tasks";
```

---

## Provider Chain Order

```
ConfigProvider          // 1. Runtime config (must be outermost)
  ConfigLoader          // 2. Blocks until config loaded
    I18nLoader          // 3. Initializes translations
      MockProvider      // 4. Starts MSW if enabled
        AuthProvider    // 5. Auth (needs config for provider selection)
          QueryClient   // 6. React Query (needs auth for interceptors)
            {children}  // 7. Application content
```

---

## Config Feature Flags

| Helper | Flag | Default | File |
|---|---|---|---|
| `isMswEnabled()` | `features.msw` | `false` | `src/app/features/config/config.helpers.ts` |
| `isDebugMode()` | `features.debugMode` | `false` | Same |
| `isAnalyticsEnabled()` | `features.analytics` | `false` | Same |
| `isBetaFeaturesEnabled()` | `features.betaFeatures` | `false` | Same |
