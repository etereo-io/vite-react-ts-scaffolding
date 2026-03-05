Create a view component (and optionally its controller hook) following the project's 3-layer component architecture.

## Arguments

Parse `$ARGUMENTS` as `feature:ComponentName` where:
- **feature**: the feature directory name (e.g., "tasks", "products")
- **ComponentName**: PascalCase component name (e.g., "ProductCard", "ProductsList")

## Instructions

1. Read `docs/rules/frontend/component-architecture.instruction.md` for the 3-layer pattern.
2. Read `src/features/tasks/components/TasksList.tsx` as the canonical view component reference.
3. Read `src/features/tasks/hooks/useTasksListController.ts` as the canonical controller reference.
4. Read `src/features/tasks/components/TasksList.test.tsx` as the canonical component test reference.

## Generate View Component

Create `src/features/{feature}/components/{ComponentName}.tsx`:

```
Structure:
1. Imports (external > @/shared > feature types/constants)
2. Props interface (readonly, all data + handlers as props)
3. Function declaration (NOT arrow function)
4. Early returns (loading, error, empty states)
5. Pure JSX rendering (NO business logic, NO handler creation)
```

Rules:
- Use function declaration: `export function ComponentName({ ... }: ComponentNameProps)`
- Props interface with `readonly` on every property
- Named export ONLY
- Use shadcn/ui primitives from `@/shared/components/ui/`
- Use `useTranslation()` for ALL user-facing text
- Use `AllowedAuth` for permission-gated UI elements
- Use feature route constants for navigation links
- NO `useState`, `useCallback`, `useMemo`, `useEffect` inside the component
- NO handler creation inside the component -- all handlers come from props

## Generate Controller Hook (if applicable)

If this is a list, form, or complex component, also create `src/features/{feature}/hooks/use{ComponentName}Controller.ts`:

```
Structure:
1. Permissions hook
2. Mutation hooks
3. Query hooks
4. Derived state (useMemo)
5. Handlers (useCallback)
6. Return complete interface
```

Rules:
- ALL business logic lives here, not in the component
- Compose permission hook + service hooks + local state
- Use `useMemo` for expensive computations
- Use `useCallback` for ALL handlers
- Return everything the component needs

## Generate Test File

Create `src/features/{feature}/components/{ComponentName}.test.tsx`:

- Mock the controller hook with `vi.mock("../hooks/use{ComponentName}Controller")`
- Provide complete mock return value matching the controller interface
- Use Object Mother from `__mocks__/` for test data (NEVER inline literals)
- Use `renderWithTestProviders()` from `#/tests.helpers`
- Mock `useLoggedUser` to test permission-based rendering
- Test: empty state rendering, data rendering, conditional elements, snapshot
- NEVER trigger user interactions (no `userEvent.click()`)

## Enforcement Rules
- Named exports ONLY
- Function declarations
- `readonly` on ALL props
- Components are PURE prop assignment
- No business logic in components
- All user-facing text via `t()` from useTranslation
