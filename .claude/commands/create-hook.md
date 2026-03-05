Create a new hook and its test file following the project's conventions.

## Arguments

Parse `$ARGUMENTS` as `type:feature:hookName` where:
- **type**: `query` | `mutation` | `controller` | `permission`
- **feature**: the feature directory name (e.g., "tasks", "products")
- **hookName**: the hook function name (e.g., "useProductsByCategory")

## Instructions

Read the reference implementation for the specified type from `src/features/tasks/hooks/` before generating.

---

### If type = `query`

**Reference**: Read `src/features/tasks/hooks/useTasks.ts` and `src/features/tasks/hooks/useTasks.test.ts`

Generate hook at `src/features/{feature}/hooks/{hookName}.ts`:
- Use `useQuery` from `@tanstack/react-query`
- Use the feature's query key factory from `{feature}.constants.ts`
- Use the feature's service function from `{feature}.services.ts`
- Add `meta: { errorMessage: "{feature}.fetch.error" }` for error handling
- Add `enabled` flag if the query depends on optional parameters

Generate test at `src/features/{feature}/hooks/{hookName}.test.ts`:
- Use MSW `server.use(http.get(...))` for API mocking
- Use `renderHookWithProviders` from `#/tests.helpers`
- Test: successful data fetch, filter forwarding (assert params inside MSW handler), enabled flag, error state
- Use Object Mother from `__mocks__/` for response data

---

### If type = `mutation`

**Reference**: Read `src/features/tasks/hooks/useDeleteTask.ts` and `src/features/tasks/hooks/useDeleteTask.test.ts`

Generate hook at `src/features/{feature}/hooks/{hookName}.ts`:
- Use `useMutation` from `@tanstack/react-query`
- Call `metrics.event(EVENT_*)` in mutationFn
- Invalidate queries in `onSuccess` using `queryClient.invalidateQueries({ queryKey: featureKeys.lists() })`
- Add `meta: { errorMessage, successMessage }` using `t()` from `useTranslation`

Generate test at `src/features/{feature}/hooks/{hookName}.test.ts`:
- Standard mutation mock setup:
  ```
  vi.mock("@tanstack/react-query") -- mock useQueryClient -> invalidateQueries
  vi.mock("@/lib/metrics/useMetrics") -- mock useMetrics -> event
  vi.mock("@/lib/notifications/notifications") -- mock notifications.error/success
  ```
- Use MSW for endpoint mocking
- Test: success path (endpoint called, analytics event, cache invalidation), error path (error notification)

---

### If type = `controller`

**Reference**: Read `src/features/tasks/hooks/useTasksListController.ts` and `src/features/tasks/hooks/useTasksListController.test.ts`

Generate hook at `src/features/{feature}/hooks/{hookName}.ts`:
- Compose: permission hook + mutation hooks + query hooks + useMemo (derived state) + useCallback (handlers)
- Accept options interface with `readonly` props
- Return complete interface: data, loading/error states, permissions, handlers

Generate test at `src/features/{feature}/hooks/{hookName}.test.ts`:
- Use `renderHookWithProviders` with MSW
- Test: derived state computation, filter/sort/pagination mapping, handler delegation via `act()`, empty/error states, permission flags
- Call handlers directly: `act(() => { result.current.handleDelete("id")(); })`
- NEVER use userEvent -- call handlers via act()

---

### If type = `permission`

**Reference**: Read `src/features/tasks/hooks/useTasksPermissions.ts`

Generate hook at `src/features/{feature}/hooks/{hookName}.ts`:
- Import `useUserAuth` from `@/app/features/auth/hooks/useUserAuth`
- Import PERMISSION_* constants from feature constants
- Compose `isAllowed()` calls into boolean flags: `canRead`, `canWrite`, `canAdmin`, `canCreate`, `canUpdate`, `canDelete`
- Return all flags + `isPending`

No test file needed for permission hooks (they're tested via controller tests).

---

## Enforcement Rules
- Named exports ONLY
- Function declarations (not arrow functions)
- `readonly` on all interface/options props
- One hook per file
- No magic strings -- use constants
- No error handling in services (only in hooks via React Query)
