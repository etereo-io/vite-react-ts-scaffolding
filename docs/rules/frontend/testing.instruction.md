# Testing Conventions

## Testing Philosophy

- **Controller-Focused Testing**: Business logic lives in controller hooks — test them intensively via `renderHook`
- **MSW-Level Mocking**: Mock at the network boundary (`server.use(http.get(...))`), never mock service functions directly
- **Object Mother Factories**: All mock data comes from domain-specific `[feature].mother.ts` factories
- **No User Interactions**: Avoid `userEvent.click()`, `userEvent.type()` — they are slow. Call controller handlers directly via `act()`
- **View = Snapshot + DOM Assertions**: Component tests mock the controller to pin specific states, then assert with snapshots or direct DOM queries

## Testing Layers

```
┌─────────────────────────────────────────────────────┐
│ Layer          │ Strategy          │ Speed           │
├────────────────┼───────────────────┼─────────────────┤
│ Helpers        │ Pure unit tests   │ < 1ms per test  │
│ Query hooks    │ MSW + renderHook  │ ~50ms per test  │
│ Mutation hooks │ MSW + renderHook  │ ~50ms per test  │
│ Controllers    │ MSW + renderHook  │ ~50ms per test  │
│ Components     │ Snapshot + DOM    │ ~30ms per test  │
│ Pages          │ Snapshot (rare)   │ ~30ms per test  │
└─────────────────────────────────────────────────────┘
```

## 1. Query Hook Testing

Test data fetching, filter forwarding, and error notifications.

**Reference:** `src/features/tasks/hooks/useTasks.test.ts`

```typescript
import { renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { TestProviders } from "#/tests.helpers";
import { API_MOCK_PREFIX } from "@/app/features/api/api.constants";
import { server } from "@/app/features/mock-server/node";
import { taskMother } from "../__mocks__/task.mother";
import { useTasks } from "./useTasks";

describe("useTasks", () => {
  const page = taskMother.getRandomPage();

  beforeEach(() => {
    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, () => HttpResponse.json(page))
    );
  });

  it("should return paginated task data", async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: TestProviders
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data?.data).toStrictEqual(page.data);
    expect(result.current.data?.total).toBe(page.total);
  });

  it("should pass filters as query params", async () => {
    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("search")).toBe("deploy");
        return HttpResponse.json(taskMother.getRandomPage(10, 5));
      })
    );

    const { result } = renderHook(
      () => useTasks({ offset: 10, limit: 5, search: "deploy" }),
      { wrapper: TestProviders }
    );

    await waitFor(() => expect(result.current.isPending).toBe(false));
  });

  it("should notify on error", async () => {
    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, () => HttpResponse.error())
    );

    const { result } = renderHook(() => useTasks(), {
      wrapper: TestProviders
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
  });
});
```

**What to verify in query hooks:**
- Data shape matches expected response type
- Filters are forwarded as query params (assert inside the MSW handler)
- `enabled` flag prevents fetch when preconditions are missing (e.g., empty id)
- Error state triggers notification side effects

## 2. Mutation Hook Testing

Test the full mutation lifecycle: event emission, cache invalidation, and notifications.

**Reference:** `src/features/tasks/hooks/useDeleteTask.test.ts`, `src/features/orders/hooks/useOrderDelete.test.ts`

```typescript
import { act, renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { TestProviders } from "#/tests.helpers";
import { API_MOCK_PREFIX, ERROR_INTERNAL } from "@/app/features/api/api.constants";
import { server } from "@/app/features/mock-server/node";
import { EVENT_TASK_DELETED } from "../tasks.constants";
import { useDeleteTask } from "./useDeleteTask";

// Mock queryClient to verify invalidation
const mockInvalidateQueries = vi.fn();
vi.mock("@tanstack/react-query", async () => ({
  ...(await vi.importActual("@tanstack/react-query")),
  useQueryClient: () => ({
    invalidateQueries: () => mockInvalidateQueries()
  })
}));

// Mock metrics to verify event emission
const mockEvent = vi.fn();
vi.mock("@/lib/metrics/useMetrics", () => ({
  useMetrics: () => ({ event: mockEvent })
}));

// Mock notifications to verify success/error messages
const mockNotificationError = vi.fn();
const mockNotificationSuccess = vi.fn();
vi.mock("@/lib/notifications/notifications", () => ({
  notifications: {
    error: (...args: unknown[]) => mockNotificationError(...args),
    success: (...args: unknown[]) => mockNotificationSuccess(...args)
  }
}));

describe("useDeleteTask", () => {
  it("should delete, emit event, invalidate and notify", async () => {
    server.use(
      http.delete(`${API_MOCK_PREFIX}/api/v1/tasks/task-1`, () =>
        new HttpResponse(null, { status: 204 })
      )
    );

    const { result } = renderHook(() => useDeleteTask(), {
      wrapper: TestProviders
    });

    act(() => { result.current.mutate("task-1"); });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockEvent).toHaveBeenCalledWith(EVENT_TASK_DELETED);
    await waitFor(() => expect(mockInvalidateQueries).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockNotificationSuccess).toHaveBeenCalledTimes(1));
  });

  it("should notify on error", async () => {
    server.use(
      http.delete(`${API_MOCK_PREFIX}/api/v1/tasks/task-1`, () =>
        HttpResponse.json({ code: ERROR_INTERNAL }, { status: 500 })
      )
    );

    const { result } = renderHook(() => useDeleteTask(), {
      wrapper: TestProviders
    });

    act(() => { result.current.mutate("task-1"); });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    await waitFor(() => expect(mockNotificationError).toHaveBeenCalledTimes(1));
  });
});
```

**Standard mutation mock setup** (reusable pattern for all mutation tests):

```typescript
// 1. queryClient.invalidateQueries — verify cache invalidation
const mockInvalidateQueries = vi.fn();
vi.mock("@tanstack/react-query", async () => ({
  ...(await vi.importActual("@tanstack/react-query")),
  useQueryClient: () => ({ invalidateQueries: () => mockInvalidateQueries() })
}));

// 2. metrics.event — verify analytics events
const mockEvent = vi.fn();
vi.mock("@/lib/metrics/useMetrics", () => ({
  useMetrics: () => ({ event: mockEvent })
}));

// 3. notifications — verify success/error toasts
const mockNotificationError = vi.fn();
const mockNotificationSuccess = vi.fn();
vi.mock("@/lib/notifications/notifications", () => ({
  notifications: {
    error: (...args: unknown[]) => mockNotificationError(...args),
    success: (...args: unknown[]) => mockNotificationSuccess(...args)
  }
}));
```

**What to verify in mutation hooks:**
- Correct MSW endpoint is called (method + path)
- Analytics event is emitted with the right constant
- Query cache is invalidated on success
- Success notification fires
- Error notification fires on server error

## 3. Controller Hook Testing (Primary Focus)

Controllers compose query hooks, mutation hooks, permissions, and local state. Test them intensively — they are the single place where business logic lives.

**Reference:** `src/features/tasks/hooks/useTasksListController.test.ts`, `src/features/orders/hooks/useOrdersController.test.ts`

```typescript
import { act, renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { TestProviders } from "#/tests.helpers";
import { API_MOCK_PREFIX } from "@/app/features/api/api.constants";
import { server } from "@/app/features/mock-server/node";
import { taskMother } from "../__mocks__/task.mother";
import { useTasksListController } from "./useTasksListController";

describe("useTasksListController", () => {
  const page = taskMother.getRandomPage();

  beforeEach(() => {
    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, () => HttpResponse.json(page))
    );
  });

  test("should return tasks and compute totalPages", async () => {
    const { result } = renderHook(() => useTasksListController(), {
      wrapper: TestProviders
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.tasks).toStrictEqual(page.data);
    expect(result.current.total).toBe(page.total);
    expect(result.current.totalPages).toBeGreaterThan(0);
  });

  test("should apply pagination offset from pageIndex", async () => {
    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("offset")).toBe("20"); // pageIndex=2 * pageSize=10
        return HttpResponse.json(page);
      })
    );

    const { result } = renderHook(
      () => useTasksListController({ pagination: { pageIndex: 2, pageSize: 10 } }),
      { wrapper: TestProviders }
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
  });

  test("should handle delete via handleDeleteTask", async () => {
    server.use(
      http.delete(`${API_MOCK_PREFIX}/api/v1/tasks/task-1`, () =>
        new HttpResponse(null, { status: 204 })
      )
    );

    const { result } = renderHook(() => useTasksListController(), {
      wrapper: TestProviders
    });

    // Call handler directly — no DOM interaction
    act(() => { result.current.handleDeleteTask("task-1")(); });

    await waitFor(() => expect(result.current.isDeleting).toBe(false));
  });

  test("should expose permission flags", () => {
    const { result } = renderHook(() => useTasksListController(), {
      wrapper: TestProviders
    });

    expect(result.current.canRead).toBeDefined();
    expect(result.current.canWrite).toBeDefined();
    expect(result.current.canDelete).toBeDefined();
  });
});
```

**What to test in controllers:**
- Derived state (computed values like `totalPages`, `isEmpty`, `page`)
- Filter/sort/pagination mapping — assert inside MSW handlers that params are correct
- Handler delegation — call `handleDelete()`, `handleSubmit()` directly, verify mutations fire
- Empty/error states — override MSW to return empty arrays or errors
- Permission flags — verify they are exposed and defined

**Why call handlers directly instead of via DOM:**

```typescript
// ✅ Fast: Call controller handler directly (~50ms)
act(() => { result.current.handleDeleteTask("task-1")(); });

// ❌ Slow: Find DOM button and click (~200ms+)
await user.click(screen.getByRole("button", { name: /delete/i }));
```

## 4. Form Controller Testing

Form controllers manage defaults, submission routing (create vs update), and mutation state.

**Reference:** `src/features/tasks/hooks/useTaskFormController.test.ts`

```typescript
describe("useTaskFormController", () => {
  describe("create mode", () => {
    test("should return defaults for create", () => {
      const { result } = renderHook(
        () => useTaskFormController({ mode: "create" }),
        { wrapper: TestProviders }
      );

      expect(result.current.isCreateMode).toBe(true);
      expect(result.current.defaultValues.title).toBe("");
      expect(result.current.defaultValues.status).toBe(TaskStatus.PENDING);
    });

    test("should call create mutation and trigger onSuccess", async () => {
      const onSuccess = vi.fn();
      const { result } = renderHook(
        () => useTaskFormController({ mode: "create", onSuccess }),
        { wrapper: TestProviders }
      );

      act(() => {
        result.current.handleSubmit({
          title: "New task",
          status: TaskStatus.PENDING,
          priority: TaskPriority.MEDIUM
        });
      });

      await waitFor(() => expect(onSuccess).toHaveBeenCalledTimes(1));
    });
  });

  describe("edit mode", () => {
    const existingTask = taskMother.getRandomTask({
      id: "task-1",
      title: "Existing",
      status: TaskStatus.IN_PROGRESS
    });

    test("should populate defaults from existing task", () => {
      const { result } = renderHook(
        () => useTaskFormController({ mode: "edit", task: existingTask }),
        { wrapper: TestProviders }
      );

      expect(result.current.isEditMode).toBe(true);
      expect(result.current.defaultValues.title).toBe("Existing");
      expect(result.current.defaultValues.status).toBe(TaskStatus.IN_PROGRESS);
    });
  });
});
```

## 5. Component View Testing

Components are presentational. Test them by:
1. Mocking auth hooks to control permission state
2. Passing mock data from Object Mothers as props
3. Asserting rendered content and conditional elements
4. Using snapshots for regression detection

**Reference:** `src/features/tasks/components/TasksList.test.tsx`, `src/features/orders/components/Orders.test.tsx`

```typescript
import { screen } from "@testing-library/react";
import type { Mock } from "vitest";
import { renderWithTestProviders } from "#/tests.helpers";
import { userMother } from "@/app/features/auth/__mocks__/user.mother";
import { useLoggedUser } from "@/app/features/auth/hooks/useLoggedUser";
import { taskMother } from "../__mocks__/task.mother";
import { TasksList } from "./TasksList";

vi.mock("@/app/features/auth/hooks/useLoggedUser");

describe("TasksList", () => {
  const tasks = taskMother.getRandomList(3);

  beforeEach(() => {
    (useLoggedUser as Mock).mockReturnValue({
      user: userMother.getMockUser()
    });
  });

  it("should render task titles from object mother data", () => {
    renderWithTestProviders(
      <TasksList tasks={tasks} canDelete={false} onDelete={vi.fn()} />
    );

    expect(screen.getByText(tasks[0].title)).toBeInTheDocument();
    expect(screen.getByText(tasks[1].title)).toBeInTheDocument();
  });

  it("should render delete buttons when canDelete is true", () => {
    renderWithTestProviders(
      <TasksList tasks={tasks} canDelete={true} onDelete={vi.fn()} />
    );

    // Use regex for aria-label matching — works with both raw i18n keys and translated values
    const deleteButtons = screen.getAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(tasks.length);
  });

  it("should not render delete buttons when canDelete is false", () => {
    renderWithTestProviders(
      <TasksList tasks={tasks} canDelete={false} onDelete={vi.fn()} />
    );

    const deleteButtons = screen.queryAllByRole("button", { name: /delete/i });
    expect(deleteButtons).toHaveLength(0);
  });

  it("should match snapshot with tasks", () => {
    const { container } = renderWithTestProviders(
      <TasksList tasks={tasks} canDelete={true} onDelete={vi.fn()} />
    );
    expect(container).toMatchSnapshot();
  });
});
```

**View testing rules:**
- Never trigger user interactions (clicks, typing) — that's the controller's job to test
- Mock `useLoggedUser` to control `AllowedAuth` rendering
- Use `renderWithTestProviders` (full providers) when the component needs the full provider chain (config, auth, QueryClient caches)
- Since modules are not loaded globally, i18n returns raw keys — assert on i18n key strings, not translated text
- Use Object Mother factories for all mock data passed as props

## Object Mother Pattern

Every feature defines a `__mocks__/[feature].mother.ts` file that generates realistic domain data using `faker`. The mother provides:

```typescript
// src/features/tasks/__mocks__/task.mother.ts
import { faker } from "@faker-js/faker";
import { TaskPriority, TaskStatus } from "../tasks.enums";
import type { TaskResponse } from "../tasks.types";

function getRandomTask(overrides?: Partial<TaskResponse>): TaskResponse {
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    description: faker.lorem.paragraph(),
    status: faker.helpers.enumValue(TaskStatus),
    priority: faker.helpers.enumValue(TaskPriority),
    assignee: faker.helpers.maybe(() => faker.person.fullName()) ?? null,
    dueDate: faker.helpers.maybe(() => faker.date.soon().toISOString()) ?? null,
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
    ...overrides  // ← override specific fields for test scenarios
  };
}

function getRandomList(count = 20, overrides?: Partial<TaskResponse>): TaskResponse[] {
  return Array.from({ length: count }, () => getRandomTask(overrides));
}

function getRandomPage(offset = 0, limit = 20) {
  return {
    data: Array.from({ length: Math.min(limit, 50 - offset) }, (_, i) =>
      getRandomTask({ id: `task-${offset + i}` })
    ),
    total: 50,
    offset,
    limit
  };
}

export const taskMother = { getRandomTask, getRandomList, getRandomPage };
```

**Rules:**
- All mock data MUST come from Object Mothers, not inline literals
- Use `overrides` parameter to pin specific fields needed for the test scenario
- `getRandomPage()` for paginated list responses
- `getRandomList()` for flat arrays
- `getRandomTask({ id: "specific-id" })` when you need a deterministic id

```typescript
// ✅ Data from Object Mother
const page = taskMother.getRandomPage();
const task = taskMother.getRandomTask({ status: TaskStatus.COMPLETED });

// ❌ Inline data
const page = { data: [{ id: "1", title: "foo" }], total: 1, offset: 0, limit: 20 };
```

## MSW Mocking Conventions

Tests are **fully self-contained** — feature modules are NOT loaded globally in `vitest.setup.ts`. Each test must set up its own MSW handlers via `server.use()` in `beforeEach`. Never rely on default module handlers or mock service functions directly.

### Endpoint pattern

```typescript
// Use API_MOCK_PREFIX constant for the base URL
server.use(
  http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, () => HttpResponse.json(page))
);
```

### Asserting request params inside handlers

```typescript
server.use(
  http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, ({ request }) => {
    const url = new URL(request.url);
    expect(url.searchParams.get("search")).toBe("deploy");
    expect(url.searchParams.get("offset")).toBe("20");
    return HttpResponse.json(page);
  })
);
```

### Error simulation

```typescript
// Network error
server.use(
  http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, () => HttpResponse.error())
);

// Server error with code
server.use(
  http.delete(`${API_MOCK_PREFIX}/api/v1/tasks/task-1`, () =>
    HttpResponse.json({ code: ERROR_INTERNAL }, { status: 500 })
  )
);
```

### Handler override order

MSW uses last-registered-wins. Override the default handler in specific tests:

```typescript
beforeEach(() => {
  // Default: return data
  server.use(http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, () => HttpResponse.json(page)));
});

it("should handle error", async () => {
  // Override for this test only
  server.use(http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, () => HttpResponse.error()));
  // ...
});
```

## Test Provider Tiering

Choose the lightest provider wrapper that satisfies your test requirements.

### Decision Tree

```
Does your test need the real QueryClient caches (global error/success notifications)?
├── YES → Use TestProviders (full)
└── NO → Does it need React Query or routing?
    ├── YES → Use MinimalTestProviders
    └── NO → No wrapper needed (pure unit test)
```

### MinimalTestProviders

Includes only `QueryClientProvider` + `MemoryRouter`. Use for:
- Controller hook tests that don't need i18n resolution
- Simple hook tests

Approximately **~60% faster** than full `TestProviders`.

### TestProviders (Full)

Includes config, i18n (without translations), auth, and all application-level providers including the default `QueryClient` with global error/success notification caches. Use for:
- Mutation hooks that rely on `meta.errorMessage`/`meta.successMessage` for notifications
- Component tests that use auth/config providers
- Integration tests that need the full provider chain

**Note:** Since modules are not loaded in `vitest.setup.ts`, i18n returns raw keys. Assert on keys, not translated text.

### renderHookWithProviders()

Lightweight hook testing helper that wraps `renderHook` with `MinimalTestProviders`:

```typescript
import { renderHookWithProviders } from "#/tests.helpers";

test("hook returns initial state", () => {
  const { result } = renderHookWithProviders(() => useCustomHook());
  expect(result.current.data).toBeUndefined();
});
```

### Role-Specific Renderers

Pre-configured renderers that mock `useLoggedUser` with specific roles:

```typescript
import { renderWithAdminUser, renderWithRegularUser } from "#/tests.helpers";

test("admin sees admin controls", () => {
  const { getByRole } = renderWithAdminUser(<AdminPanel />);
  expect(getByRole("button", { name: /delete/i })).toBeInTheDocument();
});
```

## What to Mock — Decision Guide

**✅ Always mock at the MSW level:**
- Network calls — `server.use(http.get(...))`

**✅ Mock with `vi.mock` only when necessary:**
- `useLoggedUser` — to control `AllowedAuth` rendering in component tests
- `useMetrics` — to verify analytics events
- `notifications` — to verify toast side effects
- `useQueryClient` — to verify cache invalidation calls
- Complex third-party components with browser dependencies

**❌ Never mock:**
- Service functions (`tasksService.listTasks`) — mock at MSW instead
- Axios or `apiClient` — mock at MSW instead
- Simple utilities and helpers — test them directly
- React hooks (`useState`, `useEffect`, `useMemo`)
- Your own hooks that don't have side effects

## IndexedDB Mock Databases

Feature mock databases (`__mocks__/[feature].mock-db.ts`) use `fake-indexeddb` for MSW handlers. This provides persistent CRUD operations during tests without a real backend.

```typescript
// vitest.setup.ts
import "fake-indexeddb/auto";
```

## Naming Conventions

```typescript
// ✅ Good — descriptive, states the expected behavior
test("should return paginated task data");
test("should apply globalFilter as search param");
test("should delete, emit event, invalidate and notify");
test("should not render delete buttons when canDelete is false");

// ❌ Bad — vague or implementation-focused
test("works");
test("handles click");
test("calls the API");
```

## File Organization

```
features/[feature]/
├── __mocks__/
│   ├── [feature].mother.ts          # Object Mother (faker)
│   └── [feature].mock-db.ts         # IndexedDB mock database
├── hooks/
│   ├── use[Feature]s.test.ts        # Query hook test
│   ├── use[Feature].test.ts         # Single-item query hook test
│   ├── useCreate[Feature].test.ts   # Create mutation test
│   ├── useDelete[Feature].test.ts   # Delete mutation test
│   ├── use[Feature]sListController.test.ts   # List controller test
│   └── use[Feature]FormController.test.ts    # Form controller test
├── components/
│   ├── [Feature]sList.test.tsx       # List view test (snapshot + DOM)
│   └── __snapshots__/               # Auto-generated snapshots
└── [feature].helpers.test.ts        # Pure unit tests (no providers)
```

## Testing Checklist for New Features

When creating tests for a new feature module:

1. **Helpers** — Pure unit tests, no providers needed
2. **Query hooks** — MSW success + error, filter forwarding
3. **Mutation hooks** — MSW success + error, event emission, cache invalidation, notifications
4. **List controller** — Data loading, pagination, filter mapping, delete delegation, permission flags
5. **Form controller** — Create/edit defaults, submit routing, onSuccess callback
6. **List component** — Empty state, data rendering (titles from object mother), conditional elements (delete buttons via canDelete), snapshot
