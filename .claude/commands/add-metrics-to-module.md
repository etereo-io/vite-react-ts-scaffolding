Add analytics event tracking to the "$ARGUMENTS" feature module.

## Instructions

1. Read the target module at `src/features/$ARGUMENTS/` to understand its current structure.
2. Read `docs/guides/analytics.md` for the analytics patterns reference.
3. Read `src/features/tasks/tasks.constants.ts` for the `EVENT_` constant naming pattern.
4. Read `src/features/tasks/hooks/useCreateTask.ts` for the hook integration pattern.
5. Read `src/features/tasks/hooks/useCreateTask.test.ts` for the test pattern.

## Steps

### Step 1: Define Event Constants

Open `src/features/$ARGUMENTS/$ARGUMENTS.constants.ts` and add event constants:

```typescript
// Analytics events
export const EVENT_[ENTITY]_VIEWED = "[entity]_viewed";
export const EVENT_[ENTITY]_CREATED = "[entity]_created";
export const EVENT_[ENTITY]_UPDATED = "[entity]_updated";
export const EVENT_[ENTITY]_DELETED = "[entity]_deleted";
```

Add domain-specific events as needed (e.g., `EVENT_[ENTITY]_STATUS_CHANGED`).

### Step 2: Add useMetrics to Mutation Hooks

For each mutation hook in `src/features/$ARGUMENTS/hooks/`:

1. Import `useMetrics` and the corresponding `EVENT_*` constant
2. Call `metrics.event(EVENT_*)` inside `mutationFn`

```typescript
import { useMetrics } from "@/lib/metrics/useMetrics";
import { EVENT_[ENTITY]_CREATED } from "../$ARGUMENTS.constants";

export function useCreate[Entity]() {
  const metrics = useMetrics();

  return useMutation({
    mutationFn: (data) => {
      metrics.event(EVENT_[ENTITY]_CREATED);
      return service.create(data);
    },
  });
}
```

### Step 3: Add Declarative Tracking to Components

For key UI interactions not covered by mutation hooks, add `data-track` attributes:

```tsx
<button data-track="[entity]_details_open">View Details</button>

<button
  data-track="[entity]_filter_change"
  data-track-filter={filterValue}
>
  Apply
</button>
```

### Step 4: Update Tests

For each modified mutation hook test:

1. Add the standard `useMetrics` mock at the top of the test file:

```typescript
const mockEvent = vi.fn();
vi.mock("@/lib/metrics/useMetrics", () => ({
  useMetrics: () => ({ event: mockEvent })
}));
```

2. Add assertion in the mutation test:

```typescript
expect(mockEvent).toHaveBeenCalledWith(EVENT_[ENTITY]_CREATED);
```

## Enforcement Rules

- Named exports ONLY
- Use `EVENT_` prefix for all event constants
- Event values use `snake_case` (e.g., `"task_created"`)
- One `metrics.event()` call per mutation hook (in `mutationFn`)
- Never mock `gtag` directly in feature tests -- always mock `useMetrics`
- No dynamic event name construction (no template literals)

## After Generation

Run `pnpm types:check` and `pnpm test:run` to verify everything compiles and tests pass.
