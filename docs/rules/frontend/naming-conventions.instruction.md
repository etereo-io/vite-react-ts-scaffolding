# Code Naming Conventions

## Variables and Functions

Use **camelCase** for variables, functions, and methods with descriptive names:

```typescript
const shiftedStartDate = startDate
  ? new Date(shiftUTCToTimeZone(startDate, timeZone)).toISOString()
  : undefined;

const isPending =
  querySignals.isLoading || queriesData.some((query) => query.isLoading);

function buildTimeSeriesChartDefinition(signals: ChartSignal[]) {
  // Implementation
}
```

## Constants

Use **SCREAMING_SNAKE_CASE** for module-level constants in `domain.constants.ts` files:

```typescript
// charts.constants.ts
export const DEFAULT_TIMEZONE = "Etc/UTC";
export const CURRENT_TIMEZONE = Intl.DateTimeFormat().resolvedOptions().timeZone;
export const CHART_REFRESH_INTERVAL = 30000;
export const QUERY_KEY_SIGNALS = "signals";

// API endpoints
export const API_ENDPOINTS = {
  BANNERS: "/api/banners",
  BANNER_DETAIL: "/api/banners/:id",
} as const;

// Error messages
export const ERROR_MESSAGES = {
  FETCH_SIGNALS_FAILED: "Failed to fetch signals",
  FETCH_SIGNALS_ERROR: "Error fetching signals",
} as const;
```

## Types and Interfaces

Use **PascalCase** for types, interfaces, and enums:

```typescript
// Data models
interface ChartSignalDatum {
  date: string;
  value: number | string;
}

// Configuration types
type ChartSignalSampling = "1min" | "5min" | "1hour";

// Component props
interface TimeLineChartProps {
  readonly chartDef: TimeSeriesChartDefModel;
  readonly width: number;
  readonly height?: number;
}

// Enums for constrained values
export enum ChartType {
  LINE = "line",
  BAR = "bar",
  PIE = "pie",
}

export enum BannerStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  DRAFT = "draft",
}
```

## Magic Strings Rule

**No magic strings**: Always use constants or enums from constants or types files.

### ❌ Avoid Magic Strings
```typescript
const response = await fetch("/api/banners");
const chartType = "line";
const status = "active";
const queryKey = "signals";
```

### ✅ Use Constants or Enums
```typescript
// banner.constants.ts
export const API_ENDPOINTS = {
  BANNERS: "/api/banners",
  BANNER_DETAIL: "/api/banners/:id",
} as const;

export const QUERY_KEYS = {
  BANNERS: "banners",
  SIGNALS: "signals",
} as const;

// chart.types.ts
export enum ChartType {
  LINE = "line",
  BAR = "bar",
  PIE = "pie",
}

// Usage
const response = await fetch(API_ENDPOINTS.BANNERS);
const chartType = ChartType.LINE;
const status = BannerStatus.ACTIVE;
const queryKey = QUERY_KEYS.SIGNALS;
```

## Function and Hook Naming

### Service Functions
Use descriptive action verbs:
```typescript
export const nodeService = {
  getSignals: async (nodeId: string) => { /* */ },
  updateSignal: async (signal: ChartSignal) => { /* */ },
  deleteSignal: async (signalId: string) => { /* */ },
};
```

### Hook Naming Patterns
- **Service hooks**: `use[Entity][Action]` - `useNodeSignals`, `useSignalsData`
- **Controller hooks**: `use[Feature]Controller` - `useTimeLineChartController`
- **Utility hooks**: `use[Purpose]` - `useLocalStorage`, `useDebounce`

```typescript
// Service hooks
export function useNodeSignals(nodeId?: string) { /* */ }
export function useSignalsData(params: SignalsParams) { /* */ }

// Controller hooks
export function useTimeLineChartController(params: ControllerParams) { /* */ }
export function useBoardEditorController(boardId: string) { /* */ }

// Utility hooks
export function useLocalStorage<T>(key: string, defaultValue: T) { /* */ }
export function useDebounce<T>(value: T, delay: number) { /* */ }
```

## Component Naming

### Component Files
Use **PascalCase** matching the component name:
- `TimeLineChart.tsx` exports `TimeLineChart`
- `NodePageSkeleton.tsx` exports `NodePageSkeleton`

### Component Variants
Use descriptive suffixes for component variations:
```typescript
// Base component
export function Button(props: ButtonProps) { /* */ }

// Variants
export function ButtonPrimary(props: ButtonProps) { /* */ }
export function ButtonSecondary(props: ButtonProps) { /* */ }
export function ButtonIcon(props: ButtonIconProps) { /* */ }
```

## Event Handler Naming

Use consistent `handle` prefix for event handlers:

```typescript
export function TimeLineChart() {
  const handleZoomReset = useCallback(() => {
    // Reset zoom logic
  }, []);

  const handleDataPointClick = useCallback((dataPoint: ChartDataPoint) => {
    // Handle click logic
  }, []);

  const handleChartResize = useCallback((dimensions: ChartDimensions) => {
    // Handle resize logic
  }, []);

  return (
    <Chart
      onZoomReset={handleZoomReset}
      onDataPointClick={handleDataPointClick}
      onResize={handleChartResize}
    />
  );
}
```

## Boolean Variables

Use descriptive prefixes for boolean variables:

```typescript
// State booleans
const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);
const [canEdit, setCanEdit] = useState(true);

// Computed booleans
const isPending = querySignals.isLoading || queriesData.some(q => q.isLoading);
const hasValidData = data && data.length > 0;
const shouldShowSkeleton = isPending && !hasValidData;
```
      onDataPointClick={handleDataPointClick}
      onResize={handleChartResize}
    />
  );
}
```

## Boolean Variables

Use descriptive prefixes for boolean variables:

```typescript
// State booleans
const [isLoading, setIsLoading] = useState(false);
const [hasError, setHasError] = useState(false);
const [canEdit, setCanEdit] = useState(true);

// Computed booleans
const isPending = querySignals.isLoading || queriesData.some(q => q.isLoading);
const hasValidData = data && data.length > 0;
const shouldShowSkeleton = isPending && !hasValidData;
```
