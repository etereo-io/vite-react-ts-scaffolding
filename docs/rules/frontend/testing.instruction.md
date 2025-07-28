# Testing Conventions

## Testing Philosophy

- **Controller-Focused Testing**: Test hook controllers where business logic resides
- **Component Snapshot Testing**: Test component views with snapshots
- **Minimal Mocking**: Mock only network calls (MSW), complex third-parties, and browser APIs
- **Fast Feedback**: Prefer controller invocations over DOM interactions

## Core Testing Strategy

### 1. Controller Testing (Primary Focus)

Test all business logic in hook controllers:

```typescript
import { renderHook, act } from '@testing-library/react';
import { TestProviders } from '#/tests.helpers';
import { useChartController } from '../useChartController';
import { ChartSignalMother } from '../__mocks__/ChartMother';

test('controller handles user interactions', () => {
  const { result } = renderHook(
    () => useChartController({ nodeId: 'test' }),
    { wrapper: TestProviders }
  );

  // Test zoom operations
  act(() => result.current.handleZoomIn({ start: 0, end: 100 }));
  expect(result.current.chartDef.zoomLevel).toBeGreaterThan(1);

  act(() => result.current.handleZoomReset());
  expect(result.current.chartDef.zoomLevel).toBe(1);

  // Test selection
  const mockPoint = ChartSignalMother.dataPoint();
  act(() => result.current.handleDataPointClick(mockPoint));
  expect(result.current.chartDef.selectedPoint).toBe(mockPoint);
});
```

### 2. Component Testing (Snapshots + Mocking)

Mock controllers and test component rendering:

```typescript
import { renderWithTestProviders } from '#/tests.helpers';
import { ChartComponent } from '../ChartComponent';

vi.mock('../hooks/useChartController');

const mockController = {
  isPending: false,
  chartDef: ChartSignalMother.chartDefinition(),
  handleZoomReset: vi.fn(),
  handleDataPointClick: vi.fn(),
};

beforeEach(() => {
  vi.mocked(useChartController).mockReturnValue(mockController);
});

test('renders chart correctly', () => {
  const { container } = renderWithTestProviders(<ChartComponent nodeId="test" />);
  expect(container).toMatchSnapshot();
});

test('renders loading state', () => {
  vi.mocked(useChartController).mockReturnValue({
    ...mockController,
    isPending: true,
    chartDef: null
  });

  const { container } = renderWithTestProviders(<ChartComponent nodeId="test" />);
  expect(container).toMatchSnapshot();
});
```

### 3. Service Testing

Use MSW for API testing with mock factories:

```typescript
import { server } from '#/mocks/server';
import { rest } from 'msw';
import { chartService } from '../chart.service';

test('chartService handles API responses', async () => {
  const result = await chartService.getSignals('test-node');
  expect(Array.isArray(result)).toBe(true);
});

test('chartService handles errors', async () => {
  server.use(
    rest.get('/api/data/:nodeId/signals', (req, res, ctx) => {
      return res(ctx.status(500), ctx.json({ error: 'Server error' }));
    })
  );

  await expect(chartService.getSignals('test-node')).rejects.toThrow();
});
```

## Mock Strategies

### Mock Factories
Always use mock factories for consistent test data:

```typescript
import { ChartSignalMother } from '../__mocks__/ChartMother';

test('processes multiple signal types', () => {
  const signals = [
    ChartSignalMother.temperature({ name: 'Temp Sensor 1' }),
    ChartSignalMother.power({ name: 'Power Monitor' }),
    ChartSignalMother.pressure({ name: 'Pressure Gauge' }),
  ];

  const { result } = renderHook(
    () => useSignalProcessor(signals),
    { wrapper: TestProviders }
  );

  expect(result.current.processedSignals).toHaveLength(3);
  expect(result.current.groupedByType.temperature).toHaveLength(1);
});
```

### What to Mock

**✅ Always Mock:**
- Network calls (MSW handles this)
- Complex third-party components (Chart libraries)
- Browser APIs (`localStorage`, `window`)
- Third-party hooks with browser dependencies

**❌ Avoid Mocking:**
- Simple utilities and helpers
- React hooks (`useState`, `useEffect`)
- Your own simple custom hooks

```typescript
// Mock complex third-party components
vi.mock('react-chartjs-2', () => ({
  Chart: vi.fn(() => <div data-testid="mock-chart" />),
  Line: vi.fn(() => <div data-testid="mock-line-chart" />),
}));

// Mock browser APIs
Object.defineProperty(window, 'localStorage', {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
  writable: true,
});
```

## Setup and Testing Best Practices

### Global Setup
```typescript
// vitest.setup.ts
import '@testing-library/jest-dom';
import { server } from './src/__mocks__/server';

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => {
  server.resetHandlers();
  vi.restoreAllMocks();
  vi.clearAllTimers();
  vi.useRealTimers();
});
afterAll(() => server.close());
```

### Best Practices

1. **Descriptive Test Names**
```typescript
// ✅ Good
test('handleDataPointClick updates selectedPoint when valid point provided');
test('handleZoomReset clears zoom state and resets view to default');

// ❌ Vague
test('handles click');
test('zoom works');
```

2. **Use Mock Factories**
```typescript
// ✅ Use factories
const signals = ChartSignalMother.temperatureSignals();

// ❌ Inline data
const signals = [{ id: '1', type: 'temp', name: 'Temperature' }];
```

3. **Test Controllers, Not DOM**
```typescript
// ✅ Fast: Test controller directly
test('zoom reset clears selection', () => {
  const { result } = renderHook(() => useChartController());
  
  act(() => {
    result.current.handleDataPointClick(mockPoint);
    result.current.handleZoomReset();
  });

  expect(result.current.selectedPoint).toBeNull();
});

// ❌ Slow: Test through DOM
test('zoom reset clears selection', async () => {
  const user = userEvent.setup();
  render(<ChartComponent />);
  await user.click(screen.getByTestId('data-point'));
  await user.click(screen.getByRole('button', { name: /reset/i }));
  // ... more DOM interaction
});
```

## Benefits

- **100% business logic coverage** through controller testing
- **Minimal component testing** - snapshots verify rendering
- **Easy mocking** - mock entire controllers, not individual functions
- **Fast execution** - controller invocations vs DOM interactions
- **Consistent data** - mock factories ensure reliable test data
