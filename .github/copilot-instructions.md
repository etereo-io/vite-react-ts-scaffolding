# FrontEnd Code Conventions & Guidelines

## Project Overview

This is a React TypeScript project using Vite, TailwindCSS, React Query, MSW for mocking, and i18next for internationalization.

## Module Structure Conventions

### Feature-Based Architecture

```bash
src/
├── app/                # Root application components
│   ├── components/     # App-specific components
│   └── features/       # App wide feature modules
├── features/           # Feature modules
│   ├── [feature]/
│   │   ├── __mocks__/  # Mocks for testing
│   │   ├── components/ # UI components for this feature
│   │   ├── hooks/      # Custom hooks and controllers
│   │   ├── services/   # API services and business logic
│   │   ├── types/      # TypeScript types/interfaces
│   │   └── utils/      # Feature-specific utilities
├── shared/            # Shared across features, React-specific, usually without business logic
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Shared hooks
│   ├── services/      # Shared services
│   ├── types/         # Shared types
│   └── utils/         # Shared utilities
├── lib/               # Core utilities and configurations, not React-specific
├── assets/            # Static assets
└── locales/           # Internationalization files
```

### Feature Module Structure

```bash
src/features/[feature]/
├── __mocks__/                  # Mocks and object mothers for testing
├── assets/
│   └── locales/                # Feature-specific internationalization
│       ├── [locale-code].json  # i18n files
│       └── index.ts            # i18n module, must export `locale` object
├── components/                 # UI components for this feature
├-- pages/                      # Feature-specific pages
├── hooks/                      # Custom hooks, controllers and service layer with bussiness logic
├── services/                   # API services and business logic
├── [feature].types.ts          # TypeScript types/interfaces
├── [feature].constants.ts      # Feature-specific constants
├── [feature].helpers.ts        # Feature-specific utilities
├-- [feature].services.ts       # Feature-specific service layer
├── [feature].mock.handlers.ts  # Mocks for testing
└-- index.ts                    # Feature module entry point and routes
```

## Module Declaration with Distributed Routes

### Feature-Level Route Configuration

Each feature module defines its own routes and exports them for composition at the app level.

```typescript
// filepath: src/features/orders/index.tsx
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const OrdersListPage = lazy(() => import("./pages/OrdersListPage").then(m => ({ default: m.OrdersListPage })));
const OrderDetailPage = lazy(() => import("./pages/OrderDetailPage").then(m => ({ default: m.OrderDetailPage })));
const CreateOrderPage = lazy(() => import("./pages/CreateOrderPage").then(m => ({ default: m.CreateOrderPage })));

export const ordersRoutes: RouteObject[] = [
  {
    path: "/orders",
    children: [
      {
        index: true,
        element: <OrdersListPage />
      },
      {
        path: "new",
        element: <CreateOrderPage />
      },
      {
        path: ":orderId",
        element: <OrderDetailPage />
      },
      {
        path: ":orderId/edit",
        element: <EditOrderPage />
      }
    ]
  }
];

registerModule({
  name: MODULE_ORDERS,
  routes,
});

```

## File Naming Conventions

- **Components**: PascalCase - `NodePageSkeleton.tsx`, `TimeLineChart.tsx`
- **Hooks**: camelCase with `use` prefix - `useTimeLineChartController.ts`, `useNodeSignals.ts`
- **Services**: domain.service.ts - `node.service.ts`, `chart.service.ts`
- **Types**: camelCase with types suffix - `charts.types.ts`, `node.types.ts`
- **Constants**: domain.constants.ts - `charts.constants.ts`, `node.constants.ts`
- **Utils/Helpers**: camelCase with descriptor - `charts.helpers.ts`, `date.utils.ts`
- **Test files**: Same as source with `.test.ts` suffix - `date.test.ts`
- **Mock files**: Same as source with `.mock.ts` suffix - `charts.mock.ts`

## Code Naming Conventions

### Variables and Functions

- **camelCase** for variables, functions, and methods
- **Descriptive names** that explain purpose

```typescript
const shiftedStartDate = startDate
  ? new Date(shiftUTCToTimeZone(startDate, timeZone)).toISOString()
  : undefined;
const isPending =
  querySignals.isLoading || queriesData.some((query) => query.isLoading);
```

### Constants

- **SCREAMING_SNAKE_CASE** for module-level constants
- Declare in `domain.constants.ts` files

```typescript
// charts.constants.ts
export const DEFAULT_TIMEZONE = "Etc/UTC";
export const CURRENT_TIMEZONE =
  Intl.DateTimeFormat().resolvedOptions().timeZone;
export const CHART_REFRESH_INTERVAL = 30000;
export const QUERY_KEY_SIGNALS = "signals";
export const METRIC_SIGNALS_UPDATE = "update_signals";
```

### Types and Interfaces

- **PascalCase** for types, interfaces, and enums
- Use descriptive suffixes: `Model`, `Type`, `Props`, `Config`

```typescript
interface ChartSignalDatum {
  date: string;
  value: number | string;
}

type ChartSignalSampling = "1min" | "5min" | "1hour";
```

### Magic Strings Rule

- **No magic strings**: Always use constants or enums from constants or types files
- Reference from appropriate domain constants or types files

```typescript
// ❌ Avoid magic strings
const response = await fetch("/api/banners");
const chartType = "line";
const status = "active";

// ✅ Use constants or enums
// banner.constants.ts
export const API_ENDPOINTS = {
  BANNERS: "/api/banners",
  BANNER_DETAIL: "/api/banners/:id",
} as const;

// chart.types.ts
export enum ChartType {
  LINE = "line",
  BAR = "bar",
  PIE = "pie",
}

// banner.types.ts
export enum BannerStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
}

// Usage
const response = await fetch(API_ENDPOINTS.BANNERS);
const chartType = ChartType.LINE;
const status = BannerStatus.ACTIVE;
```

## State Management and Data Fetching

- Use Zustand for state management.
- Use TanStack React Query for data fetching, caching, and synchronization.
- Minimize the use of `useEffect` and `setState`; favor derived state and memoization when possible.

## Component Architecture

### Component Declaration Pattern

- Use **function declarations** (not arrow functions)
- Components are **readonly** by default
- Props interface defined inline or as separate type

```typescript
interface Props {
  readonly chartDef: TimeSeriesChartDefModel;
  readonly width: number;
  readonly height?: number;
}

export function TimeLineChartD3({ chartDef, width, height = 325 }: Props) {
  // component logic
}
```

### Component Structure

1. **View Components**: Pure presentation logic, minimal state
2. **Controller Hooks**: Business logic, state management, side effects
3. **Service Hooks**: Data fetching, caching, error handling

```typescript
// Controller Hook Pattern
export function useTimeLineChartController({
  clientId,
  nodeId,
}: // ... other params
ControllerParams) {
  const querySignals = useNodeSignals(nodeId);
  const queriesData = useSignalsData({
    /* ... */
  });

  // Business logic
  const data = useMemo(
    () => buildTimeSeriesChartDefinition(/* ... */),
    [
      /* deps */
    ]
  );

  return { isPending, data, refresh };
}

// Component using controller
export function TimeLineChart(props: Props) {
  const controller = useTimeLineChartController(props);

  if (controller.isPending) return <Skeleton />;

  return <TimeLineChartD3 {...controller.data} />;
}
```

### Testability Benefits

This architecture improves testability by:

- **Separation of concerns**: Business logic in hooks can be tested independently
- **Pure components**: View components are easier to test with predictable props
- **Mocking simplicity**: Controller hooks can be mocked for component tests

## Hook Architecture

### Service Hooks with React Query

- Use React Query for server state management
- Follow naming pattern: `use[Entity][Action]` - `useNodeSignals`, `useSignalsData`
- Handle loading, error, success states and custom business logic

```typescript
export function useNodeSignals(nodeId?: string) {
  return useQuery({
    queryKey: [QUERY_KEY_SIGNALS, nodeId],
    queryFn: () => nodeService.getSignals(nodeId!),
    enabled: !!nodeId,
  });
}
```

### Controller Hooks

- Coordinate multiple service hooks
- Handle business logic and state derivation
- Return object with clear, descriptive properties

```typescript
export function useTimeLineChartController(params: ControllerParams) {
  const querySignals = useNodeSignals(params.nodeId);
  const queriesData = useSignalsData({
    /* ... */
  });

  const isPending =
    querySignals.isLoading || queriesData.some((q) => q.isLoading);
  const hasError = querySignals.isError || queriesData.some((q) => q.isError);

  return { isPending, hasError, data, refresh };
}
```

## Entity-Service-Hook-Mock Relationship

### 1. Entity Types

Define data structures and domain models

```typescript
// charts.types.ts
export interface ChartSignal {
  id: string;
  name: string;
  unit: string;
  lineColor?: string;
}
```

### 2. Services

Handle API communication

```typescript
// chart.service.ts
import { getEndpoint } from "@/app/api";
import { API_ENDPOINT_DATA } from "./chart.constants";

async function getSignals(nodeId: string): Promise<ChartSignal[]> {
  const response = await fetch(
    `${getEndpoint(API_ENDPOINT_DATA)}/${nodeId}/signals`
  );
  return response.json();
}

export const signalsService = {
  getSignals,
}
```

### 3. Service Hooks

Integrate services with React Query

```typescript
// useNodeSignals.ts
export function useNodeSignals(nodeId?: string) {
  return useQuery({
    queryKey: [QUERY_KEY_SIGNALS, nodeId],
    queryFn: () => chartService.getSignals(nodeId!),
    enabled: !!nodeId,
  });
}
```

### 4. Mock Factories

Generate test data for development and testing

```typescript
// charts.mock.ts
const createChartSignal = (
  overrides?: Partial<ChartSignal>
): ChartSignal => ({
  id: faker.string.uuid(),
  name: faker.lorem.words(2),
  unit: faker.helpers.arrayElement(["°C", "kW", "V"]),
  lineColor: faker.color.rgb(),
  ...overrides,
});

export const chartMother = {
  createChartSignal,
}
```

### 5. MSW Handlers

Mock API responses during development/testing

```typescript
// handlers/charts.ts
export const chartHandlers = [
  http.get('api/data', ({ params }) => {
    const signals = Array.from({ length: 5 }, () => createMockChartSignal());
    return HttpResponse.json(signals);
  }),
];
```

## Error Management

### Hook Level

```typescript
export function useNodeSignals(nodeId?: string) {
  return useQuery({
    queryKey: ["node-signals", nodeId],
    queryFn: () => nodeService.getSignals(nodeId!),
    enabled: !!nodeId,
    meta: {
      successMessage: "node-signals.fetch.success", // Optional for fetching, recommended for mutations
      errorMessage: "node-signals.fetch.error"
    }
  });
}
```

## Internationalization (i18n) Conventions

### Key Structure

Use hierarchical dot notation with feature prefixes:

```typescript
// locales/en.json
{
  "banner.title": "Announcements",
  "banner.loading": "Loading banners...",
  "banner.error": "Failed to load banners",
  "banner.empty": "No banners available",
  "banner.detail.title": "Banner Details",
  "banner.detail.loading": "Loading banner details...",
  "banner.detail.error": "Failed to load banner details",
  "charts.title": "Charts",
  "charts.zoom.reset": "Reset Zoom",
  "charts.loading": "Loading chart data...",
  "charts.error": "Failed to load chart",
  "nodes.details": "Node Details",
  "nodes.signals": "Signals",
  "nodes.loading": "Loading node data...",
  "nodes.error": "Failed to load node"
}
```

### Usage in Components

```typescript
import { Trans, useTranslation } from "react-i18next";

export function ChartComponent() {
  const { t } = useTranslation();

  return (
    <div>
      <h1>{t("charts.title")}</h1>
      <Button>
        <Trans i18nKey="charts.zoom.reset" />
      </Button>
    </div>
  );
}
```

## Assets Conventions

### Organization

```
src/assets/
├── icons/          # SVG icons
├── images/         # Images (PNG, JPG)
└── fonts/          # Custom fonts
```

### Import Pattern

```typescript
import iconPath from "@/assets/icons/solar-panel.svg";
import { Icon } from "@/shared/components/Icon";

// Usage
<Icon icon="solar-panel" />;
```

## Export Conventions

### No Default Exports

Always use named exports for better refactoring and IDE support:

```typescript
// ❌ Avoid
export default function MyComponent() {}

// ✅ Preferred
export function MyComponent() {}

// ❌ Avoid
export default { apiMethod };

// ✅ Preferred
export const apiService = { apiMethod };
```

### Avoid Barrel Exports

Import directly from source files instead of using index.ts barrel exports:

```typescript
// ❌ Avoid barrel exports
// features/charts/index.ts
export { TimeLineChart } from "./components/TimeLineChart";
export { useTimeLineChartController } from "./hooks/useTimeLineChartController";
export * from "./types/charts.types";

// ❌ Avoid importing from barrels
import { TimeLineChart, useTimeLineChartController } from "@/features/charts";

// ✅ Preferred - Direct imports
import { TimeLineChart } from "@/features/charts/components/TimeLineChart";
import { useTimeLineChartController } from "@/features/charts/hooks/useTimeLineChartController";
import type { ChartSignal } from "@/features/charts/types/charts.types";
```

### Benefits of Direct Imports

- **Better tree shaking**: Only imports what's actually used
- **Clearer dependencies**: Explicit about which files are being used
- **IDE performance**: Faster auto-completion and navigation
- **Build performance**: Reduces bundle size and compilation time

## Layout Conventions

### Flexbox First

Use Flexbox for layouts unless Grid is specifically needed:

```typescript
// ✅ Preferred - Flexbox
<div className="flex gap-4 items-center">
  <Avatar />
  <div className="flex flex-col gap-2">
    <h1>Title</h1>
    <p>Subtitle</p>
  </div>
</div>

// ✅ When Grid is needed
<div className="grid grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### Responsive Design

Use container queries and responsive utilities:

```typescript
<div className="@container">
  <div className="flex gap-4 @max-[1000px]:flex-col">
    {/* Content adapts to container size */}
  </div>
</div>
```

## Testing Conventions

### Component Testing

Focus on behavior, not implementation:

```typescript
// ✅ Test behavior
expect(screen.getByRole("button", { name: /reset zoom/i })).toBeInTheDocument();

// ❌ Avoid testing implementation details
expect(component.state.isZoomed).toBe(false);
```

### Hook Testing

Test hooks in isolation using `@testing-library/react-hooks`:

```typescript
import { renderHook } from "@testing-library/react-hooks";

test("useTimeLineChartController returns correct data", () => {
  const { result } = renderHook(() => useTimeLineChartController(mockProps));

  expect(result.current.isPending).toBe(false);
  expect(result.current.data).toBeDefined();
});
```

## General Principles

1. **Composition over Configuration**: Build complex components from simple, reusable parts
2. **Explicit over Implicit**: Prefer explicit props and clear naming over clever abstractions
3. **Testability First**: Structure code to be easily testable in isolation
4. **Performance Conscious**: Use `useMemo`, `useCallback`, and React.memo judiciously
5. **Type Safety**: Leverage TypeScript's type system for better developer experience
6. **Accessibility**: Follow ARIA guidelines and semantic HTML patterns
7. **Consistency**: Follow established patterns within the codebase

## Key Architectural Decisions

- **No default exports** for better refactoring support
- **Function declarations** over arrow functions for components
- **Readonly props** by default for immutability
- **Controller hooks** for business logic separation
- **Service hooks** with React Query for data management
- **Mock factories** for consistent test data
- **Feature-based** module organization
- **Flexbox-first** layout approach
- **No magic strings** - use constants or enums from domain files
