# Development Patterns & Services

## Entity-Service-Hook-Mock Pattern

Complete data flow from API to component with full testing support.

### 1. Entity Types (Data Structures)

```typescript
// charts.types.ts
export interface ChartSignal {
  readonly id: string;
  readonly name: string;
  readonly unit: string;
  readonly lineColor?: string;
  readonly isActive: boolean;
}

export enum SignalSampling {
  ONE_MINUTE = "1min",
  FIVE_MINUTES = "5min",
  ONE_HOUR = "1hour",
}
```

### 2. Mock Factories (Test Data Generation)

```typescript
// charts.mock.ts
export const createMockChartSignal = (
  overrides?: Partial<ChartSignal>
): ChartSignal => ({
  id: faker.string.uuid(),
  name: faker.lorem.words(2),
  unit: faker.helpers.arrayElement(["°C", "kW", "V", "A", "Hz"]),
  lineColor: faker.color.rgb(),
  isActive: faker.datatype.boolean(),
  ...overrides,
});

// Mother pattern for complex test scenarios
export class ChartSignalMother {
  static active(overrides?: Partial<ChartSignal>): ChartSignal {
    return createMockChartSignal({ isActive: true, ...overrides });
  }

  static temperature(overrides?: Partial<ChartSignal>): ChartSignal {
    return createMockChartSignal({
      name: "Temperature",
      unit: "°C",
      lineColor: "#ff4444",
      ...overrides,
    });
  }

  static createList(count: number, overrides?: Partial<ChartSignal>): ChartSignal[] {
    return Array.from({ length: count }, () => createMockChartSignal(overrides));
  }
}
```

### 3. MSW Handlers (API Mocking)

```typescript
// handlers/charts.ts
export const chartHandlers = [
  http.get("/api/data/:nodeId/signals", ({ params }) => {
    const signals = ChartSignalMother.createList(5);
    return HttpResponse.json(signals);
  }),

  http.get("/api/data/:clientId/:nodeId/:signalId", ({ params, request }) => {
    const url = new URL(request.url);
    const sampling = url.searchParams.get("sampling") || "1min";
    
    const dataPoints = Array.from({ length: 100 }, (_, index) =>
      createMockChartDataPoint({
        signalId: params.signalId as string,
        timestamp: new Date(Date.now() - (100 - index) * 60000).toISOString(),
      })
    );

    return HttpResponse.json(dataPoints);
  }),

  // Error simulation
  http.get("/api/data/error-test/signals", () => {
    return HttpResponse.json(
      { error: "Internal Server Error", code: "SERVER_ERROR" },
      { status: 500 }
    );
  }),
];
```

### 4. Services (Pure API Communication)

**No error handling** - delegated to React Query hooks:

```typescript
// chart.service.ts
export const chartService = {
  async getSignals(nodeId: string): Promise<ChartSignal[]> {
    return fetch(`${getEndpoint(API_ENDPOINTS.SIGNALS)}/${nodeId}/signals`)
      .then(response => response.json());
  },

  async getSignalData({ clientId, nodeId, signalId, timeRange, sampling }: SignalDataParams): Promise<ChartDataPoint[]> {
    const searchParams = new URLSearchParams({
      start: timeRange.start.toISOString(),
      end: timeRange.end.toISOString(),
      sampling,
    });

    const url = `${getEndpoint(API_ENDPOINTS.SIGNAL_DATA)}/${clientId}/${nodeId}/${signalId}?${searchParams}`;
    return fetch(url).then(response => response.json());
  },

  async updateSignal(signal: ChartSignal): Promise<ChartSignal> {
    return fetch(`${getEndpoint(API_ENDPOINTS.SIGNALS)}/${signal.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(signal),
    }).then(response => response.json());
  },
};
```

### 5. Service Hooks (React Query Integration)

**Handle error management, retry logic, and caching**:

```typescript
export function useNodeSignals(nodeId?: string) {
  return useQuery({
    queryKey: [QUERY_KEYS.SIGNALS, nodeId],
    queryFn: () => chartService.getSignals(nodeId!),
    enabled: !!nodeId,
    onError: (error) => {
      console.error(ERROR_MESSAGES.FETCH_SIGNALS_ERROR, { nodeId, error });
    },
  });
}

export function useUpdateSignal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: chartService.updateSignal,
    onSuccess: (updatedSignal) => {
      queryClient.setQueryData(
        [QUERY_KEYS.SIGNALS, updatedSignal.nodeId],
        (oldData: ChartSignal[] | undefined) =>
          oldData?.map(signal =>
            signal.id === updatedSignal.id ? updatedSignal : signal
          )
      );
    },
    onError: (error, variables) => {
      console.error(ERROR_MESSAGES.UPDATE_SIGNAL_ERROR, { signalId: variables.id, error });
    },
  });
}
```

## Benefits

### Clean Separation of Concerns
- **Services**: Pure API communication, easily testable
- **Hooks**: Error handling, retry logic, state management
- **Components**: Pure presentation

### Simplified Testing
- **Service testing**: Testable with MSW
- **Hook testing**: React Query behavior testing
- **Component testing**: Snapshot testing with mocked controllers
- **Controller-focused**: Test business logic in hooks
- **Consistent data**: Use mock factories

### Performance & Reliability
- React Query handles caching and optimization
- Consistent error handling and retry patterns
- Centralized error logging

## Configuration

```typescript
// chart.constants.ts
export const API_ENDPOINTS = {
  SIGNALS: "/api/data",
  SIGNAL_DATA: "/api/data",
} as const;

export const QUERY_KEYS = {
  SIGNALS: "signals",
  SIGNAL_DATA: "signal-data",
} as const;

export const ERROR_MESSAGES = {
  FETCH_SIGNALS_ERROR: "Error fetching signals",
  UPDATE_SIGNAL_ERROR: "Error updating signal",
} as const;
```
