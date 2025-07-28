# State Management & Data Fetching

## State Management Philosophy

- **Zustand** for global state management
- **TanStack React Query** for server state, caching, and synchronization
- **Minimize `useEffect` and `setState`** - favor derived state and memoization
- **Local state** for component-specific UI state only

## React Query Patterns

### Service Hooks with React Query

Use React Query for all server state management with consistent naming patterns:

```typescript
// Service hooks: use[Entity][Action]
export function useNodeSignals(nodeId?: string) {
  return useQuery({
    queryKey: [QUERY_KEY_SIGNALS, nodeId],
    queryFn: () => nodeService.getSignals(nodeId!),
    enabled: !!nodeId,
  });
}

export function useSignalsData({
  clientId,
  nodeId,
  signalIds,
  timeRange,
  sampling,
}: SignalsDataParams) {
  return useQueries({
    queries: signalIds.map(signalId => ({
      queryKey: [QUERY_KEY_SIGNAL_DATA, clientId, nodeId, signalId, timeRange, sampling],
      queryFn: () => signalService.getData({ clientId, nodeId, signalId, timeRange, sampling }),
      enabled: !!clientId && !!nodeId && !!signalId,
    })),
  });
}
```

### Mutation Hooks

Handle data mutations with optimistic updates:

```typescript
export function useUpdateSignal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (signal: ChartSignal) => signalService.updateSignal(signal),
    onMutate: async (newSignal) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: [QUERY_KEY_SIGNALS] });

      // Snapshot the previous value
      const previousSignals = queryClient.getQueryData([QUERY_KEY_SIGNALS]);

      // Optimistically update
      queryClient.setQueryData([QUERY_KEY_SIGNALS], (old: ChartSignal[]) =>
        old?.map(signal => signal.id === newSignal.id ? newSignal : signal) || []
      );

      return { previousSignals };
    },
    onError: (err, newSignal, context) => {
      // Rollback on error
      queryClient.setQueryData([QUERY_KEY_SIGNALS], context?.previousSignals);
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY_SIGNALS] });
    },
  });
}
```

## Controller Hook Patterns

Controller hooks coordinate multiple service hooks and handle business logic:

```typescript
export function useTimeLineChartController({
  clientId,
  nodeId,
  signalIds,
  timeRange,
  sampling,
}: ControllerParams) {
  // Service hooks
  const querySignals = useNodeSignals(nodeId);
  const queriesData = useSignalsData({
    clientId,
    nodeId,
    signalIds: signalIds || querySignals.data?.map(s => s.id) || [],
    timeRange,
    sampling,
  });

  // Derived state
  const isPending = 
    querySignals.isLoading || 
    queriesData.some((query) => query.isLoading);

  const hasError = 
    querySignals.isError || 
    queriesData.some((query) => query.isError);

  const error = 
    querySignals.error || 
    queriesData.find(query => query.error)?.error;

  // Business logic
  const data = useMemo(
    () => buildTimeSeriesChartDefinition(
      querySignals.data || [],
      queriesData.map(q => q.data).filter(Boolean),
      { timeRange, sampling }
    ),
    [querySignals.data, queriesData, timeRange, sampling]
  );

  // Actions
  const refresh = useCallback(() => {
    querySignals.refetch();
    queriesData.forEach(query => query.refetch());
  }, [querySignals, queriesData]);

  const retry = useCallback(() => {
    if (querySignals.isError) querySignals.refetch();
    queriesData.forEach(query => {
      if (query.isError) query.refetch();
    });
  }, [querySignals, queriesData]);

  return {
    isPending,
    hasError,
    error,
    data,
    signals: querySignals.data,
    refresh,
    retry,
  };
}
```

## Zustand Store Patterns

Use Zustand for global application state:

```typescript
// stores/boardStore.ts
interface BoardState {
  readonly currentBoardId?: string;
  readonly isEditing: boolean;
  readonly selectedObjects: fabric.Object[];
  readonly tool: ToolType;
}

interface BoardActions {
  setCurrentBoard: (boardId: string) => void;
  setEditing: (isEditing: boolean) => void;
  setSelectedObjects: (objects: fabric.Object[]) => void;
  setTool: (tool: ToolType) => void;
}

export const useBoardStore = create<BoardState & BoardActions>((set) => ({
  // State
  currentBoardId: undefined,
  isEditing: false,
  selectedObjects: [],
  tool: ToolType.SELECT,

  // Actions
  setCurrentBoard: (boardId) => set({ currentBoardId: boardId }),
  setEditing: (isEditing) => set({ isEditing }),
  setSelectedObjects: (selectedObjects) => set({ selectedObjects }),
  setTool: (tool) => set({ tool }),
}));

// Usage in components
export function BoardEditor() {
  const { tool, setTool, isEditing, setEditing } = useBoardStore();
  
  // Component logic
}
```

## Derived State Patterns

Prefer derived state over storing computed values:

```typescript
export function useChartController(params: ControllerParams) {
  const querySignals = useNodeSignals(params.nodeId);
  const queryData = useSignalsData(params);

  // ✅ Derived state - computed from source data
  const chartData = useMemo(() => {
    if (!querySignals.data || !queryData.every(q => q.data)) {
      return null;
    }

    return buildChartData(querySignals.data, queryData.map(q => q.data));
  }, [querySignals.data, queryData]);

  const isEmpty = chartData?.datasets.length === 0;
  const hasValidData = chartData && !isEmpty;

  // ✅ Return derived state, not stored state
  return {
    chartData,
    isEmpty,
    hasValidData,
    isLoading: querySignals.isLoading || queryData.some(q => q.isLoading),
  };
}
```

## Error Handling in Hooks

```typescript
export function useNodeSignals(nodeId?: string) {
  return useQuery({
    queryKey: [QUERY_KEY_SIGNALS, nodeId],
    queryFn: () => nodeService.getSignals(nodeId!),
    enabled: !!nodeId,
    onError: (error) => {
      console.error('Failed to fetch node signals:', error);
      // Could integrate with error reporting service
    },
  });
}
```

## Local State Guidelines

Use local state sparingly - only for component-specific UI state:

```typescript
export function ChartControls() {
  // ✅ UI-specific state
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // ✅ Derived state from props/context
  const { signals, isLoading } = useNodeSignals(nodeId);
  
  // ✅ Filtered data based on local search
  const filteredSignals = useMemo(
    () => signals?.filter(signal => 
      signal.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [],
    [signals, searchTerm]
  );

  return (
    <div>
      <SearchInput value={searchTerm} onChange={setSearchTerm} />
      <CollapseButton expanded={isExpanded} onClick={() => setIsExpanded(!isExpanded)} />
      {isExpanded && (
        <SignalList signals={filteredSignals} isLoading={isLoading} />
      )}
    </div>
  );
}
```


