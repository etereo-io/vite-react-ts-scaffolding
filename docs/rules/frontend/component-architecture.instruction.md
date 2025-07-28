# Component Architecture & Patterns

## Component Declaration Pattern

Use **function declarations** with readonly props by default:

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

## Component Architecture Layers

### 1. View Components
Pure presentation logic with minimal state:

```typescript
export function TimeLineChartD3({ 
  chartDef, 
  width, 
  height, 
  onZoomReset 
}: TimeLineChartD3Props) {
  return (
    <div className="relative">
      <svg width={width} height={height}>
        {/* Chart rendering */}
      </svg>
      {onZoomReset && (
        <Button onClick={onZoomReset}>Reset Zoom</Button>
      )}
    </div>
  );
}
```

### 2. Controller Components
**Pure prop assignment** - delegate all logic to controller hooks:

```typescript
export function TimeLineChart(props: TimeLineChartProps) {
  const controller = useTimeLineChartController(props);

  if (controller.isPending) {
    return <TimeLineChartSkeleton width={props.width} height={props.height} />;
  }

  if (controller.hasError) {
    return <ErrorDisplay error={controller.error} onRetry={controller.retry} />;
  }

  // Pure prop assignment - no business logic in component
  return (
    <TimeLineChartD3 
      chartDef={controller.chartDef}
      width={props.width}
      height={props.height}
      onZoomReset={controller.handleZoomReset}
      onDataPointClick={controller.handleDataPointClick}
    />
  );
}
```

### 3. Controller Hooks
**All business logic, state management, side effects, and event handlers:**

```typescript
export function useTimeLineChartController({
  clientId,
  nodeId,
  signalIds,
}: ControllerParams) {
  const querySignals = useNodeSignals(nodeId);
  const queriesData = useSignalsData({
    clientId,
    nodeId,
    signalIds: signalIds || querySignals.data?.map(s => s.id) || [],
  });

  // Business logic - data processing
  const chartDef = useMemo(
    () => buildTimeSeriesChartDefinition(
      querySignals.data || [],
      queriesData.map(q => q.data).filter(Boolean)
    ),
    [querySignals.data, queriesData]
  );

  // State management - loading and error states
  const isPending = 
    querySignals.isLoading || 
    queriesData.some((query) => query.isLoading);

  const hasError = 
    querySignals.isError || 
    queriesData.some((query) => query.isError);

  // Event handlers - ALL handlers live in the controller
  const handleZoomReset = useCallback(() => {
    chartDef.resetZoom();
  }, [chartDef]);

  const handleDataPointClick = useCallback((point: DataPoint) => {
    chartDef.selectDataPoint(point);
  }, [chartDef]);

  const retry = useCallback(() => {
    querySignals.refetch();
    queriesData.forEach(query => query.refetch());
  }, [querySignals, queriesData]);

  return { 
    isPending, 
    hasError, 
    chartDef,
    error: querySignals.error || queriesData.find(q => q.error)?.error,
    handleZoomReset,
    handleDataPointClick,
    retry 
  };
}
```

## Component Structure Template

```typescript
// 1. Imports
import { Button } from '@/shared/components/Button';
import { ErrorDisplay } from '@/shared/components/ErrorDisplay';
import { useTimeLineChartController } from '../hooks/useTimeLineChartController';
import type { TimeSeriesChartDefModel } from '../types/charts.types';

// 2. Types
interface Props {
  readonly clientId: string;
  readonly nodeId: string;
  readonly width: number;
  readonly height?: number;
}

// 3. Component - MINIMAL with pure prop assignment
export function TimeLineChart(props: Props) {
  // 4. Controller - ALL logic lives here
  const controller = useTimeLineChartController(props);

  // 5. Early Returns (Loading, Error, Empty States)
  if (controller.isPending) {
    return <ChartSkeleton width={props.width} height={props.height} />;
  }

  if (controller.hasError) {
    return <ErrorDisplay error={controller.error} onRetry={controller.retry} />;
  }

  // 6. Pure Prop Assignment - NO business logic or handlers
  return (
    <div className="chart-container">
      <ChartHeader title={controller.title} />
      <ChartD3 
        data={controller.chartDef}
        width={props.width}
        height={props.height}
        onZoomReset={controller.handleZoomReset}
        onDataPointClick={controller.handleDataPointClick}
      />
    </div>
  );
}
```

## Key Principles

1. **Components are pure prop assignments** - no business logic, no event handler creation
2. **All handlers live in controller hooks** - easier to test and mock
3. **Controllers return complete handler interface** - components just pass props through
4. **Minimal component surface area** - reduces testing complexity

## Error Boundaries

Implement error boundaries for robust error handling:

```typescript
export class ChartErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Chart Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay 
          error={this.state.error} 
          onRetry={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}
```

## Performance Optimizations

### Controller-Based Memoization
```typescript
export function useTimeLineChartController(params: ControllerParams) {
  // Memoize expensive computations in controller
  const chartData = useMemo(
    () => buildTimeSeriesData(params.signals, params.timeRange),
    [params.signals, params.timeRange]
  );

  // Memoize all handlers to prevent unnecessary re-renders
  const handleDataPointClick = useCallback((point: DataPoint) => {
    chartData.selectPoint(point);
  }, [chartData]);

  return {
    chartData,
    handleDataPointClick,
  };
}
```

### Component Memoization
```typescript
// Components only need React.memo - no internal memoization
export const TimeLineChart = memo(function TimeLineChart(props: Props) {
  const controller = useTimeLineChartController(props);
  
  if (controller.isPending) {
    return <ChartSkeleton width={props.width} height={props.height} />;
  }

  // Pure prop assignment - no memoization needed
  return (
    <ChartD3 
      chartDef={controller.chartDef}
      width={props.width}
      height={props.height}
      onDataPointClick={controller.handleDataPointClick}
    />
  );
});
```

## Anti-Patterns to Avoid

### ❌ Don't Create Handlers in Components
```typescript
// BAD - Handler creation in component
export function TimeLineChart(props: Props) {
  const controller = useTimeLineChartController(props);
  
  // ❌ Don't do this - creates new function on every render
  const handleClick = useCallback((point: DataPoint) => {
    controller.selectDataPoint(point);
  }, [controller]);
  
  return <ChartD3 onDataPointClick={handleClick} />;
}
```

```typescript
// GOOD - Handlers from controller
export function TimeLineChart(props: Props) {
  const controller = useTimeLineChartController(props);
  
  // ✅ Pure prop assignment
  return <ChartD3 onDataPointClick={controller.handleDataPointClick} />;
}
```

### ❌ Don't Mix Business Logic in Components
```typescript
// BAD - Business logic in component
export function TimeLineChart(props: Props) {
  const [selectedPoint, setSelectedPoint] = useState<DataPoint>();
  
  // ❌ Business logic doesn't belong here
  const processedData = useMemo(() => {
    return props.rawData.filter(d => d.timestamp > startTime);
  }, [props.rawData, startTime]);
  
  return <ChartD3 data={processedData} />;
}
```

```typescript
// GOOD - All logic in controller
export function TimeLineChart(props: Props) {
  const controller = useTimeLineChartController(props);
  
  // ✅ Component is just prop assignment
  return <ChartD3 chartDef={controller.chartDef} />;
}
```
  return (
    <div className="chart-container">
      <ChartHeader title={controller.title} />
      <ChartD3 
        data={controller.chartDef}
        width={props.width}
        height={props.height}
        onZoomReset={controller.handleZoomReset}
        onDataPointClick={controller.handleDataPointClick}
        onFilterChange={controller.handleFilterChange}
      />
    </div>
  );
}
```

## Key Principles

1. **Components are pure prop assignments** - no business logic, no event handler creation
2. **All handlers live in controller hooks** - easier to test and mock
3. **Controllers return complete handler interface** - components just pass props through
4. **Minimal component surface area** - reduces testing complexity

## Testability Benefits

This architecture **maximizes testability and mocking simplicity** by:

### Complete Separation of Concerns
- **All business logic and handlers in hooks** - test independently with `renderHook`
- **Components are pure prop assignment** - minimal surface area for testing
- **No event handler creation in components** - eliminates callback testing complexity

### Testing Strategy
> **See also**: [testing.instruction.md](./testing.instruction.md) for comprehensive testing patterns

- **Focus on controller hooks** - where all business logic resides
- **Component snapshot testing** - verify UI rendering with different states
- **Mock entire controllers** - easier than mocking individual functions
- **Prefer controller invocations** - faster than DOM event simulation

## Error Boundaries

Implement error boundaries for robust error handling:

```typescript
interface ErrorBoundaryState {
  readonly hasError: boolean;
  readonly error?: Error;
}

export class ChartErrorBoundary extends Component<
  PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: PropsWithChildren<{}>) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Chart Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorDisplay 
          error={this.state.error} 
          onRetry={() => this.setState({ hasError: false })}
        />
      );
    }

    return this.props.children;
  }
}
```

## Performance Optimizations

### Controller-Based Memoization
```typescript
export function useTimeLineChartController(params: ControllerParams) {
  // Memoize expensive computations in controller
  const chartData = useMemo(
    () => buildTimeSeriesData(params.signals, params.timeRange),
    [params.signals, params.timeRange]
  );

  // Memoize all handlers to prevent unnecessary re-renders
  const handleDataPointClick = useCallback((point: DataPoint) => {
    chartData.selectPoint(point);
  }, [chartData]);

  const handleZoomReset = useCallback(() => {
    chartData.resetZoom();
  }, [chartData]);

  const handleFilterChange = useCallback((filter: FilterConfig) => {
    chartData.applyFilter(filter);
  }, [chartData]);

  // Return stable handler references
  return {
    chartData,
    handleDataPointClick,
    handleZoomReset,
    handleFilterChange,
  };
}
```

### Component Memoization
```typescript
// Components only need React.memo - no internal memoization
export const TimeLineChart = memo(function TimeLineChart(props: Props) {
  const controller = useTimeLineChartController(props);
  
  if (controller.isPending) {
    return <ChartSkeleton width={props.width} height={props.height} />;
  }

  // Pure prop assignment - no memoization needed
  return (
    <ChartD3 
      chartDef={controller.chartDef}
      width={props.width}
      height={props.height}
      onDataPointClick={controller.handleDataPointClick}
      onZoomReset={controller.handleZoomReset}
    />
  );
});
```

## Anti-Patterns to Avoid

### ❌ Don't Create Handlers in Components
```typescript
// BAD - Handler creation in component
export function TimeLineChart(props: Props) {
  const controller = useTimeLineChartController(props);
  
  // ❌ Don't do this - creates new function on every render
  const handleClick = useCallback((point: DataPoint) => {
    controller.selectDataPoint(point);
  }, [controller]);
  
  return <ChartD3 onDataPointClick={handleClick} />;
}
```

```typescript
// GOOD - Handlers from controller
export function TimeLineChart(props: Props) {
  const controller = useTimeLineChartController(props);
  
  // ✅ Pure prop assignment
  return <ChartD3 onDataPointClick={controller.handleDataPointClick} />;
}
```

### ❌ Don't Mix Business Logic in Components
```typescript
// BAD - Business logic in component
export function TimeLineChart(props: Props) {
  const [selectedPoint, setSelectedPoint] = useState<DataPoint>();
  const [zoomLevel, setZoomLevel] = useState(1);
  
  // ❌ Business logic doesn't belong here
  const processedData = useMemo(() => {
    return props.rawData.filter(d => d.timestamp > startTime);
  }, [props.rawData, startTime]);
  
  return <ChartD3 data={processedData} />;
}
```

```typescript
// GOOD - All logic in controller
export function TimeLineChart(props: Props) {
  const controller = useTimeLineChartController(props);
  
  // ✅ Component is just prop assignment
  return <ChartD3 chartDef={controller.chartDef} />;
}
```

### ❌ Don't Partially Mock Controllers
```typescript
// BAD - Partial mocking is fragile
test('chart handles click', () => {
  const mockController = {
    ...useTimeLineChartController(mockProps),
    handleDataPointClick: jest.fn(), // ❌ Partial mock
  };
  
  // This breaks when controller structure changes
});
```

```typescript
// GOOD - Complete controller mock
test('chart handles click', () => {
  const mockController = {
    isPending: false,
    hasError: false,
    chartDef: mockData,
    handleDataPointClick: jest.fn(),
    handleZoomReset: jest.fn(),
    handleFilterChange: jest.fn(),
    retry: jest.fn(),
  };
  
  (useTimeLineChartController as jest.Mock).mockReturnValue(mockController);
  // ✅ Complete, stable mock
});
```
