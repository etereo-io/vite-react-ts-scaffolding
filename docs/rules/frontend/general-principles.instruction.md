# General Principles & Architectural Decisions

## Core Architectural Principles

### 1. Composition Over Configuration

Build complex components from simple, reusable parts rather than configuring monolithic components:

```typescript
// ✅ Composition - flexible and testable
export function ChartContainer({ nodeId }: Props) {
  const controller = useTimeLineChartController({ nodeId });

  return (
    <ChartErrorBoundary>
      <ChartHeader 
        title={controller.title}
        onRefresh={controller.refresh}
      />
      
      {controller.isPending ? (
        <ChartSkeleton />
      ) : controller.hasError ? (
        <ChartError 
          error={controller.error}
          onRetry={controller.retry}
        />
      ) : (
        <ChartCanvas 
          data={controller.data}
          onZoomReset={controller.handleZoomReset}
        />
      )}
      
      <ChartControls 
        signals={controller.signals}
        onSignalToggle={controller.handleSignalToggle}
      />
    </ChartErrorBoundary>
  );
}

// ❌ Configuration - monolithic and hard to test
export function MegaChart({
  nodeId,
  showHeader = true,
  showControls = true,
  errorComponent,
  loadingComponent,
  headerConfig,
  controlsConfig,
  // ... many more props
}: MegaChartProps) {
  // Complex internal logic handling all cases
}
```

### 2. Explicit Over Implicit

Prefer explicit props and clear naming over clever abstractions:

```typescript
// ✅ Explicit - clear what's happening
export function TimeLineChart({
  signals,
  timeRange,
  sampling,
  width,
  height,
  onZoomReset,
  onDataPointClick,
}: TimeLineChartProps) {
  // Implementation
}

// ❌ Implicit - unclear what config does
export function TimeLineChart({
  config,
  callbacks,
}: TimeLineChartProps) {
  // What's in config? What callbacks are available?
}
```

### 3. Testability First

Structure code to be easily testable in isolation:

> **See also**: [testing.instruction.md](./testing.instruction.md) for comprehensive testing strategies

```typescript
// ✅ Testable architecture
// Business logic separated into testable hook
export function useChartController(params: ControllerParams) {
  // Testable business logic
  return { data, actions, state };
}

// Pure view component - easy to test
export function ChartView({ data, onAction }: ViewProps) {
  // Pure presentation logic
  return <div>{/* JSX */}</div>;
}

// Integration component
export function Chart(props: ChartProps) {
  const controller = useChartController(props);
  return <ChartView {...controller} />;
}
```

### 4. Performance Conscious

Use React optimization tools judiciously - measure before optimizing:

```typescript
// ✅ Strategic memoization
export function ExpensiveChart({ data, config }: Props) {
  // Memoize expensive calculations
  const processedData = useMemo(
    () => processLargeDataset(data),
    [data]
  );

  // Memoize stable callbacks
  const handleDataPointClick = useCallback((point: DataPoint) => {
    onDataPointClick?.(point);
  }, [onDataPointClick]);

  // Memoize expensive renders
  return useMemo(
    () => <D3Chart data={processedData} onPointClick={handleDataPointClick} />,
    [processedData, handleDataPointClick]
  );
}

// ❌ Over-optimization - unnecessary complexity
export const MemoizedEverything = memo(
  function Component({ text }: { text: string }) {
    const memoizedText = useMemo(() => text, [text]); // Unnecessary
    const handleClick = useCallback(() => {}, []); // No dependencies
    
    return <div onClick={handleClick}>{memoizedText}</div>;
  }
);
```

### 5. Type Safety

Leverage TypeScript's type system for better developer experience:

> **See also**: [naming-conventions.instruction.md](./naming-conventions.instruction.md) for type naming patterns

```typescript
// ✅ Strong typing with branded types
export type NodeId = string & { readonly brand: unique symbol };
export type SignalId = string & { readonly brand: unique symbol };

export interface ChartSignal {
  readonly id: SignalId;
  readonly nodeId: NodeId;
  readonly name: string;
  readonly unit: string;
  readonly isActive: boolean;
}

// ✅ Discriminated unions for state
export type ChartState = 
  | { status: 'loading' }
  | { status: 'error'; error: Error }
  | { status: 'success'; data: ChartData };

// ✅ Readonly by default
export interface ComponentProps {
  readonly title: string;
  readonly data: readonly ChartSignal[];
  readonly onAction?: (action: ChartAction) => void;
}
```

### 6. Accessibility

Follow ARIA guidelines and semantic HTML patterns:

```typescript
// ✅ Accessible chart component
export function AccessibleChart({ data, title }: Props) {
  return (
    <figure role="img" aria-labelledby="chart-title">
      <h2 id="chart-title">{title}</h2>
      
      <div 
        role="application"
        aria-label="Interactive chart"
        aria-describedby="chart-description"
      >
        <ChartCanvas data={data} />
      </div>
      
      <figcaption id="chart-description">
        Chart showing {data.length} data points from {data[0]?.timestamp} to {data[data.length - 1]?.timestamp}
      </figcaption>
      
      {/* Keyboard navigation */}
      <div role="toolbar" aria-label="Chart controls">
        <button aria-label="Reset zoom level">Reset</button>
        <button aria-label="Download chart data">Download</button>
      </div>
    </figure>
  );
}
```

### 7. Consistency

Follow established patterns within the codebase:

```typescript
// ✅ Consistent patterns across features
// Every feature follows the same structure:

// 1. Types definition
export interface BoardTool {
  readonly id: ToolId;
  readonly type: ToolType;
  readonly name: string;
  readonly isActive: boolean;
}

// 2. Service layer
export const boardService = {
  getTools: async (): Promise<BoardTool[]> => { /* */ },
  updateTool: async (tool: BoardTool): Promise<BoardTool> => { /* */ },
};

// 3. Service hook
export function useBoardTools() {
  return useQuery({
    queryKey: [QUERY_KEYS.BOARD_TOOLS],
    queryFn: boardService.getTools,
  });
}

// 4. Controller hook
export function useBoardController() {
  const tools = useBoardTools();
  // Business logic
  return { tools, actions };
}

// 5. View component
export function BoardView(props: BoardViewProps) {
  // Pure presentation
}

// 6. Integration component
export function Board(props: BoardProps) {
  const controller = useBoardController();
  return <BoardView {...controller} />;
}
```

## Key Architectural Decisions

### No Default Exports
> **See also**: [imports-exports.instruction.md](./imports-exports.instruction.md)

**Rationale**: Better refactoring support, clearer dependencies, improved IDE performance.

```typescript
// ✅ Named exports
export function TimeLineChart() { /* */ }
export { chartService };
export type { ChartSignal };

// ❌ Default exports
export default function TimeLineChart() { /* */ }
export default chartService;
```

### Function Declarations Over Arrow Functions

**Rationale**: Better hoisting, clearer stack traces, consistent with React conventions.

```typescript
// ✅ Function declarations
export function TimeLineChart(props: Props) {
  return <div>{/* JSX */}</div>;
}

// ❌ Arrow functions for components
export const TimeLineChart = (props: Props) => {
  return <div>{/* JSX */}</div>;
};
```

### Readonly Props by Default
**Rationale**: Immutability by default, prevents accidental mutations, clearer intent.

```typescript
// ✅ Readonly props
interface Props {
  readonly data: readonly ChartSignal[];
  readonly onAction?: (action: ChartAction) => void;
}

// ❌ Mutable props
interface Props {
  data: ChartSignal[];
  onAction?: (action: ChartAction) => void;
}
```

### Controller Hooks for Business Logic
> **See also**: [state-and-data.instruction.md](./state-and-data.instruction.md)

**Rationale**: Separation of concerns, testability, reusability.

```typescript
// ✅ Controller pattern
export function useTimeLineChartController(params: ControllerParams) {
  // Business logic, data fetching, state management
  return { data, actions, state };
}

export function TimeLineChart(props: Props) {
  const controller = useTimeLineChartController(props);
  return <ChartView {...controller} />;
}
```

### Service Hooks with React Query
> **See also**: [state-and-data.instruction.md](./state-and-data.instruction.md)

**Rationale**: Standardized data fetching, caching, error handling, and synchronization.

```typescript
// ✅ Service hooks
export function useNodeSignals(nodeId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.SIGNALS, nodeId],
    queryFn: () => signalService.getSignals(nodeId!),
    enabled: !!nodeId,
  });
}
```

### Feature-Based Module Organization
> **See also**: [project-structure.instruction.md](./project-structure.instruction.md)

**Rationale**: Clear domain boundaries, easier maintenance, better scalability.

```
src/
├── features/
│   ├── charts/          # All chart-related code
│   ├── board/           # All board-related code
│   └── slides/          # All slide-related code
├── shared/              # Shared UI components/hooks/constants/types project specific
└── lib/                 # Core utilities agnostic to the project/technology/framework
```

### Flexbox-First Layout
> **See also**: [ui-and-styling.instruction.md](./ui-and-styling.instruction.md)

**Rationale**: Simpler mental model, better browser support, easier responsive design.

```typescript
// ✅ Flexbox for most layouts
<div className="flex gap-4 items-center">
  <Icon />
  <span>Content</span>
</div>

// CSS Grid only when specifically needed
<div className="grid grid-cols-3 gap-4">
  {items.map(item => <Card key={item.id} />)}
</div>
```

### No Magic Strings
> **See also**: [naming-conventions.instruction.md](./naming-conventions.instruction.md)

**Rationale**: Better maintainability, type safety, easier refactoring.

```typescript
// ✅ Constants and enums
export const API_ENDPOINTS = {
  SIGNALS: '/api/signals',
} as const;

export enum ChartType {
  LINE = 'line',
  BAR = 'bar',
}

// Usage
fetch(API_ENDPOINTS.SIGNALS);
const type = ChartType.LINE;
```

## Performance Guidelines

### When to Optimize

1. **Measure First**: Use React DevTools Profiler to identify actual bottlenecks
2. **User-Perceived Performance**: Focus on what users notice (first paint, interaction responsiveness)
3. **Bundle Size**: Monitor bundle size and use code splitting for large features

### Optimization Strategies

```typescript
// ✅ Code splitting for large features
const HeavyChartFeature = lazy(() => import('./features/HeavyChart'));

// ✅ Virtualization for large lists
import { FixedSizeList as List } from 'react-window';

export function LargeSignalsList({ signals }: Props) {
  return (
    <List
      height={400}
      itemCount={signals.length}
      itemSize={50}
      itemData={signals}
    >
      {SignalListItem}
    </List>
  );
}

// ✅ Debouncing user input
export function SearchInput({ onSearch }: Props) {
  const debouncedSearch = useMemo(
    () => debounce(onSearch, 300),
    [onSearch]
  );

  return <input onChange={debouncedSearch} />;
}
```

## Error Handling Philosophy

> **See also**: [development-patterns.instruction.md](./development-patterns.instruction.md) for error handling patterns

### Graceful Degradation

```typescript
// ✅ Graceful degradation
export function ChartWithFallback({ data }: Props) {
  try {
    return <InteractiveChart data={data} />;
  } catch (error) {
    console.error('Interactive chart failed, falling back to simple chart:', error);
    return <SimpleChart data={data} />;
  }
}
```

### User-Friendly Error Messages

```typescript
// ✅ User-friendly error handling
export function ChartContainer() {
  const { data, error, retry } = useChartData();

  if (error) {
    return (
      <ErrorDisplay
        title="Unable to load chart"
        message="We're having trouble loading your chart data. Please try again."
        action={
          <Button onClick={retry}>
            Try Again
          </Button>
        }
      />
    );
  }

  return <Chart data={data} />;
}
```

## Development Workflow

### Code Review Checklist

1. **Architecture**: Does this follow established patterns?
2. **Types**: Are types properly defined and used?
3. **Testing**: Are there appropriate tests for the functionality?
4. **Performance**: Are there any obvious performance issues?
5. **Consistency**: Does this match the existing codebase style?
