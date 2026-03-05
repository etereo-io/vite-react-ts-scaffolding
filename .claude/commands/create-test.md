Create a test file following the project's testing conventions for the specified layer.

## Arguments

Parse `$ARGUMENTS` as `layer:feature:target` where:
- **layer**: `helper` | `query` | `mutation` | `controller` | `component`
- **feature**: the feature directory name (e.g., "tasks")
- **target**: the file/hook/component to test (e.g., "tasks.helpers", "useTasks", "TasksList")

## Instructions

1. Read `docs/rules/frontend/testing.instruction.md` for complete testing patterns.
2. Read the existing reference test for the specified layer from `src/features/tasks/`.
3. Read `docs/guides/patterns-cheatsheet.md` for provider tiering and render helpers.

---

### If layer = `helper`

**Reference**: Read `src/features/tasks/tasks.helpers.test.ts`
**Output**: `src/features/{feature}/{target}.test.ts`

- NO providers, NO wrappers -- direct function calls
- Import functions directly from the helpers file
- Test pure input/output behavior
- Use descriptive test names: `"should return 'secondary' variant for PENDING status"`

---

### If layer = `query`

**Reference**: Read `src/features/tasks/hooks/useTasks.test.ts`
**Output**: `src/features/{feature}/hooks/{target}.test.ts`

- Use MSW `server.use(http.get(...))` for API mocking
- Use `renderHookWithProviders` from `#/tests.helpers`
- Use Object Mother from `__mocks__/` for response data (NEVER inline)
- Test cases:
  1. **Success**: Verify data shape matches expected response
  2. **Filter forwarding**: Assert request params inside MSW handler using `vi.fn()`
  3. **Enabled flag**: Verify hook doesn't fetch when preconditions are missing
  4. **Error**: Use `HttpResponse.error()` or status 500, verify error state

---

### If layer = `mutation`

**Reference**: Read `src/features/tasks/hooks/useDeleteTask.test.ts`
**Output**: `src/features/{feature}/hooks/{target}.test.ts`

Standard mutation mock setup (add these vi.mock blocks):
```typescript
// 1. Cache invalidation
const mockInvalidateQueries = vi.fn();
vi.mock("@tanstack/react-query", async () => ({
  ...(await vi.importActual("@tanstack/react-query")),
  useQueryClient: () => ({ invalidateQueries: () => mockInvalidateQueries() }),
}));

// 2. Analytics
const mockEvent = vi.fn();
vi.mock("@/lib/metrics/useMetrics", () => ({
  useMetrics: () => ({ event: mockEvent }),
}));

// 3. Notifications
const mockNotificationError = vi.fn();
const mockNotificationSuccess = vi.fn();
vi.mock("@/lib/notifications/notifications", () => ({
  notifications: {
    error: (...args: unknown[]) => mockNotificationError(...args),
    success: (...args: unknown[]) => mockNotificationSuccess(...args),
  },
}));
```

- Use MSW for endpoint mocking
- Use `renderHookWithProviders` from `#/tests.helpers`
- Test cases:
  1. **Success**: Endpoint called correctly, analytics event emitted, cache invalidated
  2. **Error**: Error notification shown

---

### If layer = `controller`

**Reference**: Read `src/features/tasks/hooks/useTasksListController.test.ts`
**Output**: `src/features/{feature}/hooks/{target}.test.ts`

- Use MSW for API mocking (NEVER mock services)
- Use `renderHookWithProviders` from `#/tests.helpers`
- Use Object Mother from `__mocks__/` for API responses
- Test cases:
  1. **Data loading**: Verify derived state (tasks array, total, totalPages)
  2. **Filter mapping**: Assert MSW handler receives correct query params
  3. **Handler delegation**: Call handlers directly via `act()`:
     ```typescript
     act(() => { result.current.handleDeleteTask("task-1")(); });
     ```
  4. **Empty state**: Verify defaults when no data
  5. **Permission flags**: Verify canRead/canWrite/canDelete are returned
- NEVER use `userEvent.click()` -- call handlers directly

---

### If layer = `component`

**Reference**: Read `src/features/tasks/components/TasksList.test.tsx`
**Output**: `src/features/{feature}/components/{target}.test.tsx`

- Mock the controller hook: `vi.mock("../hooks/use{Controller}")`
- Mock `useLoggedUser` for permission testing (admin vs regular user)
- Use Object Mother data as props/controller return values
- Use `renderWithTestProviders()` from `#/tests.helpers`
- Test cases:
  1. **Empty state**: Controller returns empty data
  2. **Data rendering**: Controller returns populated data from Object Mother
  3. **Conditional elements**: Permission-gated buttons present/absent
  4. **Snapshot**: `expect(container).toMatchSnapshot()`
- NEVER trigger user interactions

---

## Enforcement Rules
- MSW-level mocking ONLY (never mock services or axios)
- Object Mother for ALL test data (never inline literals)
- Descriptive test names explaining expected behavior
- Correct provider tiering per layer
- Named exports in test file
