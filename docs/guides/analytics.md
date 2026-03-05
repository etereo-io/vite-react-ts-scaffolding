# Analytics & Metrics Guide

## Overview

The project uses **Google Analytics 4 (GA4)** with two complementary tracking methods:

| Method | Where | When to use |
|--------|-------|-------------|
| **Programmatic** (`useMetrics` hook) | Mutation hooks, controllers | Business logic events (CRUD, auth, state changes) |
| **Declarative** (`data-track` attributes) | Components, templates | UI interaction events (clicks, toggles, navigation) |

## Architecture

```
┌─────────────────────────────────────────────────────┐
│ AppProviders                                        │
│  ConfigLoader                                       │
│    AnalyticsLoader ← reads config, calls initGA     │
│      TrackingListener ← global click listener       │
│        I18nLoader → MockProvider → AuthProvider → …  │
└─────────────────────────────────────────────────────┘

src/lib/analytics/
  ga.ts                 ← GA4 core (initializeGA, gtag, trackPageView)
  AnalyticsLoader.tsx   ← Config-aware initialization
  TrackingListener.tsx  ← Declarative click tracking

src/lib/metrics/
  useMetrics.ts         ← Hook for programmatic tracking
```

## Configuration

Analytics is controlled by two config values in `config/*.yml`:

```yaml
# Feature flag (on/off switch)
features:
  analytics: true

# GA4 measurement ID
analytics:
  measurementId: "G-XXXXXXXXXX"
```

| Environment | `features.analytics` | `analytics.measurementId` |
|-------------|---------------------|--------------------------|
| dev         | `false`             | `""`                     |
| staging     | `false`             | `"G-XXXXXXXXXX"`         |
| production  | `true`              | `"G-XXXXXXXXXX"`         |

Both conditions must be met for tracking to activate. The `isAnalyticsEnabled()` helper in `config.helpers.ts` checks the feature flag.

## Programmatic Tracking (`useMetrics`)

Use in **mutation hooks** and **controller hooks** for business logic events.

### Usage

```typescript
import { useMetrics } from "@/lib/metrics/useMetrics";
import { EVENT_TASK_CREATED } from "../tasks.constants";

export function useCreateTask() {
  const metrics = useMetrics();

  return useMutation({
    mutationFn: (data: TaskCreateRequest) => {
      metrics.event(EVENT_TASK_CREATED);
      return tasksService.createTask(data);
    },
  });
}
```

### With Parameters

```typescript
metrics.event(EVENT_TASK_STATUS_CHANGED, { status: "completed", taskId: "123" });
```

## Declarative Tracking (`data-track` attributes)

Use in **components** for UI interaction tracking without any hook imports.

### Basic Usage

```tsx
<button data-track="cta_clicked">Get Started</button>
```

### With Parameters

```tsx
<button
  data-track="signup_clicked"
  data-track-plan="premium"
  data-track-source="header"
>
  Sign Up
</button>
```

This fires: `gtag("event", "signup_clicked", { plan: "premium", source: "header" })`

### How It Works

The `TrackingListener` component (mounted by `AnalyticsLoader`) registers a global click listener that:

1. Finds the nearest ancestor with `[data-track]` using `closest()`
2. Reads `data-track` as the event name
3. Collects `data-track-*` attributes as params (browser converts kebab-case to camelCase automatically)
4. Fires `gtag("event", name, params)`

### Attribute Naming

| HTML attribute | Param key |
|---------------|-----------|
| `data-track-plan` | `plan` |
| `data-track-item-id` | `itemId` |
| `data-track-session-id` | `sessionId` |

## Event Naming Conventions

- **Format**: `snake_case` (e.g., `task_created`, `order_deleted`)
- **Prefix**: Feature/entity name (e.g., `task_`, `order_`, `auth_`)
- **Constants prefix**: `EVENT_` (e.g., `EVENT_TASK_CREATED`)
- **Success/failure pairs**: `EVENT_TASK_CREATED` + `EVENT_TASK_CREATE_FAILED`
- Define ALL event names as constants in `[feature].constants.ts`

### Standard Events per Module

```typescript
// Analytics events
export const EVENT_TASK_VIEWED = "task_viewed";
export const EVENT_TASK_CREATED = "task_created";
export const EVENT_TASK_UPDATED = "task_updated";
export const EVENT_TASK_DELETED = "task_deleted";
export const EVENT_TASK_STATUS_CHANGED = "task_status_changed";
```

## Testing

### Mock Pattern for Feature Tests

**Never mock `gtag` directly** in feature tests. Mock `useMetrics` instead:

```typescript
const mockEvent = vi.fn();
vi.mock("@/lib/metrics/useMetrics", () => ({
  useMetrics: () => ({ event: mockEvent })
}));

// Assert
expect(mockEvent).toHaveBeenCalledWith(EVENT_TASK_CREATED);
```

### Testing TrackingListener / GA Module

The `src/lib/analytics/` directory has its own test suite that tests:
- GA4 initialization and script injection (`ga.test.ts`)
- Click tracking and parameter extraction (`TrackingListener.test.tsx`)

## Adding Analytics to a New Module

Use the `/add-metrics-to-module` skill or follow these steps:

1. Define `EVENT_*` constants in `[feature].constants.ts`
2. Import `useMetrics` in mutation hooks, call `metrics.event(EVENT_*)` in `mutationFn`
3. Add `data-track` attributes to key UI elements (buttons, links, toggles)
4. Add test assertions: `expect(mockEvent).toHaveBeenCalledWith(EVENT_*)`

## File Reference

| File | Purpose |
|------|---------|
| `src/lib/analytics/ga.ts` | GA4 core (types, initializeGA, gtag, trackPageView) |
| `src/lib/analytics/AnalyticsLoader.tsx` | Config-aware initialization component |
| `src/lib/analytics/TrackingListener.tsx` | Global click listener for `data-track` attributes |
| `src/lib/metrics/useMetrics.ts` | Programmatic tracking hook |
| `src/app/features/config/config.helpers.ts` | `isAnalyticsEnabled()` helper |
| `config/*.yml` | Environment-specific analytics configuration |
