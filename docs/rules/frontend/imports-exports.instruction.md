# Import/Export Conventions

## No Default Exports

Always use named exports for better refactoring and IDE support:

### ❌ Avoid Default Exports
```typescript
// Component
export default function MyComponent() {
  return <div>My Component</div>;
}

// Service
const apiService = { apiMethod };
export default apiService;
```

### ✅ Preferred Named Exports
```typescript
// Component
export function MyComponent() {
  return <div>My Component</div>;
}

// Service
export const apiService = { apiMethod };

// Types
export interface User {
  readonly id: string;
  readonly name: string;
}
```

## Direct Imports Over Barrel Exports

Avoid barrel exports (index.ts files) in favor of direct imports for better performance and clarity.

### ❌ Avoid Barrel Exports
```typescript
// features/charts/index.ts
export { TimeLineChart } from "./components/TimeLineChart";
export { useTimeLineChartController } from "./hooks/useTimeLineChartController";
export * from "./types/charts.types";

// Usage - unclear dependencies
import { 
  TimeLineChart, 
  useTimeLineChartController,
  ChartSignal 
} from "@/features/charts";
```

### ✅ Preferred Direct Imports
```typescript
// Clear, explicit imports
import { TimeLineChart } from "@/features/charts/components/TimeLineChart";
import { useTimeLineChartController } from "@/features/charts/hooks/useTimeLineChartController";
import type { ChartSignal } from "@/features/charts/types/charts.types";
import { chartService } from "@/features/charts/services/chart.service";
```

## Benefits of Direct Imports

### 1. Better Tree Shaking
Only imports what's actually used, reducing bundle size

### 2. Clearer Dependencies
Explicit about which files are being used

### 3. IDE Performance
Faster auto-completion and navigation

### 4. Build Performance
Reduces compilation time and improves build performance

## Import Order & Architectural Hierarchy

Follow strict import precedence to prevent circular dependencies:

### Architectural Layers (Bottom to Top)
```
┌─────────────────┐ ← Pages (Top Level)
│ Pages           │
├─────────────────┤
│ Components      │ ← Can import hooks, services, helpers, constants, types
├─────────────────┤
│ Hook Controllers│ ← Can import service hooks, services, helpers, constants, types
├─────────────────┤
│ Hook Services   │ ← Can import services, helpers, constants, types
├─────────────────┤
│ Services        │ ← Can import helpers, constants, types
├─────────────────┤
│ Helpers/Utils   │ ← Can import constants, types
├─────────────────┤
│ Constants       │ ← Can import types
├─────────────────┤
│ Types           │ ← Foundation layer (no business logic imports)
└─────────────────┘
```

### Import Order Rules

**1. External Libraries First**
```typescript
// 1. React and core libraries
import { useCallback, useMemo } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
```

**2. Internal Utilities (lib/shared)**
```typescript
// 2. Shared utilities and helpers
import { classNames } from '@/lib/classnames';
import { formatDate } from '@/lib/date.utils';
import { Button } from '@/shared/components/Button';
import { useLocalStorage } from '@/shared/hooks/useLocalStorage';
```

**3. Current Feature - Bottom to Top**
```typescript
// 3a. Types (foundation)
import type { ChartSignal, ChartDataPoint } from '../types/charts.types';

// 3b. Constants
import { CHART_COLORS, QUERY_KEYS, API_ENDPOINTS } from '../charts.constants';

// 3c. Helpers/Utils
import { buildChartData, formatChartValue } from '../utils/chart.utils';

// 3d. Services (lowest business logic layer)
import { chartService } from '../services/chart.service';

// 3e. Service Hooks
import { useNodeSignals, useSignalsData } from '../hooks/useNodeSignals';

// 3f. Controller Hooks
import { useTimeLineChartController } from '../hooks/useTimeLineChartController';

// 3g. Components (highest in feature)
import { ChartD3 } from '../components/ChartD3';
```

**4. Other Features - Same Layer or Lower**
```typescript
// 4. Cross-feature imports (same layer or lower only)
import type { Node } from '@/features/nodes/types/nodes.types';
import { nodeService } from '@/features/nodes/services/node.service';
```

## Layer-Specific Import Rules

### ❌ Forbidden Patterns
```typescript
// Services cannot import hooks
import { useNodeSignals } from '../hooks/useNodeSignals'; // FORBIDDEN

// Helpers cannot import services
import { chartService } from '../services/chart.service'; // FORBIDDEN

// Constants cannot import business logic
import { chartService } from '../services/chart.service'; // FORBIDDEN

// Components cannot import other components from same feature
import { OtherChart } from './OtherChart'; // FORBIDDEN - use composition
```

### ✅ Correct Patterns
```typescript
// Components can import controller hooks
import { useTimeLineChartController } from '../hooks/useTimeLineChartController';

// Controllers can import service hooks
import { useNodeSignals } from './useNodeSignals';

// Services can import helpers and constants
import { buildApiUrl } from '../utils/api.utils';
import { API_ENDPOINTS } from '../charts.constants';
```

## Type Import Conventions

Use `type` imports for TypeScript types:

```typescript
// ✅ Explicit type imports
import type { ChartSignal } from '../types/charts.types';
import type { ComponentProps } from 'react';

// ✅ Runtime imports
import { chartService } from '../services/chart.service';
import { useQuery } from '@tanstack/react-query';

// ✅ Mixed imports when needed
import { useCallback, type ComponentType } from 'react';
```

## Re-export Patterns

When re-exports are necessary, be explicit and selective:

```typescript
// ✅ Selective re-exports for public API
// features/charts/public-api.ts
export { TimeLineChart } from './components/TimeLineChart';
export { useTimeLineChartController } from './hooks/useTimeLineChartController';
export type { ChartSignal, ChartDataPoint } from './types/charts.types';

// Don't re-export internal implementation details
```

## Anti-Patterns to Avoid

### ❌ Circular Imports
Avoid circular dependencies by respecting the architectural hierarchy

### ❌ Layer Violations
Don't import from higher architectural layers

### ❌ Cross-Feature Layer Violations
Don't import from higher layers in other features

### ❌ Deep Relative Imports
Avoid complex relative paths - use path aliases instead

### ❌ Mixed Import Styles
Be consistent within a file

## Dynamic Imports

Use dynamic imports for code splitting when appropriate:

```typescript
// ✅ Lazy loading heavy components
const HeavyChart = lazy(() => import('./components/HeavyChart').then(module => ({
  default: module.HeavyChart
})));

// ✅ Conditional feature loading
const loadAdvancedFeatures = async () => {
  const { AdvancedChartTools } = await import('./components/AdvancedChartTools');
  return AdvancedChartTools;
};
```

### Layer-Specific Import Rules

#### 📄 Pages Layer
```typescript
// ✅ Pages can import from any lower layer
import { TimeLineChart } from '@/features/charts/components/TimeLineChart';
import { useTimeLineChartController } from '@/features/charts/hooks/useTimeLineChartController';
import { chartService } from '@/features/charts/services/chart.service';
import type { ChartSignal } from '@/features/charts/types/charts.types';

// ❌ Pages cannot import other pages
import { OtherPage } from './OtherPage'; // FORBIDDEN
```

#### 🧩 Components Layer
```typescript
// ✅ Components can import hooks, services, helpers, constants, types
import { useTimeLineChartController } from '../hooks/useTimeLineChartController';
import { chartService } from '../services/chart.service';
import { formatChartValue } from '../utils/chart.utils';
import type { ChartSignal } from '../types/charts.types';

// ❌ Components cannot import pages or other components from same feature
import { SomePage } from '../pages/SomePage'; // FORBIDDEN
import { OtherChart } from './OtherChart'; // FORBIDDEN - use composition instead
```

#### 🎮 Hook Controllers Layer
```typescript
// ✅ Hook controllers can import service hooks, services, helpers, constants, types
import { useNodeSignals } from './useNodeSignals'; // service hook
import { chartService } from '../services/chart.service';
import { buildChartData } from '../utils/chart.utils';
import type { ChartSignal } from '../types/charts.types';

// ❌ Hook controllers cannot import components or pages
import { TimeLineChart } from '../components/TimeLineChart'; // FORBIDDEN
import { ChartPage } from '../pages/ChartPage'; // FORBIDDEN
```

#### 🔌 Hook Services Layer
```typescript
// ✅ Service hooks can import services, helpers, constants, types
import { chartService } from '../services/chart.service';
import { QUERY_KEYS } from '../charts.constants';
import type { ChartSignal } from '../types/charts.types';

// ❌ Service hooks cannot import controller hooks or components
import { useTimeLineChartController } from './useTimeLineChartController'; // FORBIDDEN
import { TimeLineChart } from '../components/TimeLineChart'; // FORBIDDEN
```

#### 🛠 Services Layer
```typescript
// ✅ Services can import helpers, constants, types
import { buildApiUrl } from '../utils/api.utils';
import { API_ENDPOINTS } from '../charts.constants';
import type { SignalDataParams } from '../types/charts.types';

// ❌ Services cannot import hooks or components
import { useNodeSignals } from '../hooks/useNodeSignals'; // FORBIDDEN
import { TimeLineChart } from '../components/TimeLineChart'; // FORBIDDEN
```

#### ⚙️ Helpers/Utils Layer
```typescript
// ✅ Helpers can import constants and types
import { CHART_COLORS } from '../charts.constants';
import type { ChartSignal } from '../types/charts.types';

// ❌ Helpers cannot import services, hooks, or components
import { chartService } from '../services/chart.service'; // FORBIDDEN
import { useNodeSignals } from '../hooks/useNodeSignals'; // FORBIDDEN
```

#### 📋 Constants Layer
```typescript
// ✅ Constants can import types for type safety
import type { SignalSampling } from '../types/charts.types';

export const DEFAULT_SAMPLING: SignalSampling = "1min";

// ❌ Constants cannot import business logic
import { chartService } from '../services/chart.service'; // FORBIDDEN
```

#### 📝 Types Layer
```typescript
// ✅ Types are foundation - no business logic imports
export interface ChartSignal {
  readonly id: string;
  readonly name: string;
}

// ❌ Types cannot import anything except other types
import { chartService } from '../services/chart.service'; // FORBIDDEN
import { CHART_COLORS } from '../charts.constants'; // FORBIDDEN
```

## Type Import Conventions

Use `type` imports for TypeScript types to distinguish from runtime imports:

```typescript
// ✅ Explicit type imports
import type { ChartSignal } from '../types/charts.types';
import type { ComponentProps } from 'react';
import type { QueryFunction } from '@tanstack/react-query';

// ✅ Runtime imports
import { chartService } from '../services/chart.service';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/shared/components/Button';

// ✅ Mixed imports when needed
import { useCallback, type ComponentType } from 'react';
import { chartService, type ChartServiceConfig } from '../services/chart.service';
```

## Re-export Patterns

When re-exports are necessary, be explicit and selective:

```typescript
// ✅ Selective re-exports for public API
// features/charts/public-api.ts
export { TimeLineChart } from './components/TimeLineChart';
export { useTimeLineChartController } from './hooks/useTimeLineChartController';
export type { ChartSignal, ChartDataPoint } from './types/charts.types';

// Don't re-export internal implementation details
// Don't use export * patterns
```

## Path Alias Configuration

Use consistent path aliases for clean imports:

```typescript
// vite.config.ts or tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./src/*"],
      "@/features/*": ["./src/features/*"],
      "@/shared/*": ["./src/shared/*"],
      "@/lib/*": ["./src/lib/*"]
    }
  }
}

// Usage
import { Button } from '@/shared/components/Button';
import { useChartController } from '@/features/charts/hooks/useChartController';
import { classNames } from '@/lib/classnames';
```

## Import Anti-Patterns

### ❌ Circular Imports
Avoid circular dependencies by respecting the architectural hierarchy:

```typescript
// ❌ Circular dependency violation
// features/charts/hooks/useTimeLineChartController.ts
import { TimeLineChart } from '../components/TimeLineChart'; // FORBIDDEN - higher layer

// features/charts/components/TimeLineChart.tsx  
import { useTimeLineChartController } from '../hooks/useTimeLineChartController'; // Creates circular dependency
```

### ❌ Layer Violations
Don't import from higher architectural layers:

```typescript
// ❌ Service importing hook - violates hierarchy
// features/charts/services/chart.service.ts
import { useNodeSignals } from '../hooks/useNodeSignals'; // FORBIDDEN

// ❌ Helper importing service - violates hierarchy  
// features/charts/utils/chart.utils.ts
import { chartService } from '../services/chart.service'; // FORBIDDEN

// ❌ Constants importing helpers - violates hierarchy
// features/charts/charts.constants.ts
import { formatValue } from '../utils/chart.utils'; // FORBIDDEN
```

### ❌ Cross-Feature Layer Violations
Don't import from higher layers in other features:

```typescript
// ❌ From charts service importing nodes component
// features/charts/services/chart.service.ts
import { NodeEditor } from '@/features/nodes/components/NodeEditor'; // FORBIDDEN

// ✅ Only import from same or lower layers
import type { Node } from '@/features/nodes/types/nodes.types'; // OK - types layer
import { nodeService } from '@/features/nodes/services/node.service'; // OK - same layer
```

### ❌ Deep Relative Imports
Avoid complex relative paths:

```typescript
// ❌ Hard to maintain
import { Button } from '../../../shared/components/Button';
import { utils } from '../../../../lib/utils';

// ✅ Use path aliases
import { Button } from '@/shared/components/Button';
import { utils } from '@/lib/utils';
```

### ❌ Mixed Import Styles
Be consistent within a file:

```typescript
// ❌ Inconsistent
import React from 'react'; // default import
import { useState } from 'react'; // named import

// ✅ Consistent
import { useState, useCallback, useEffect } from 'react';
```

## Dynamic Imports

Use dynamic imports for code splitting when appropriate:

```typescript
// ✅ Lazy loading heavy components
const HeavyChart = lazy(() => import('./components/HeavyChart').then(module => ({
  default: module.HeavyChart
})));

// ✅ Conditional feature loading
const loadAdvancedFeatures = async () => {
  const { AdvancedChartTools } = await import('./components/AdvancedChartTools');
  return AdvancedChartTools;
};
```

## Export Organization

Group and organize exports logically:

```typescript
// ✅ Organized exports in service files
// chart.service.ts

// Main service object
export const chartService = {
  getSignals,
  getSignalData,
  updateSignal,
};

// Individual functions if needed elsewhere
export { getSignals, getSignalData, updateSignal };

// Types used by service consumers
export type { SignalDataParams, ChartServiceConfig };

// Constants used by service
export { API_ENDPOINTS, ERROR_MESSAGES };
```

## Dependency Flow Examples

### ✅ Correct Import Flow
```typescript
// Page imports everything it needs
// pages/ChartPage.tsx
import { TimeLineChart } from '@/features/charts/components/TimeLineChart';
import type { ChartSignal } from '@/features/charts/types/charts.types';

// Component imports controller hook
// components/TimeLineChart.tsx  
import { useTimeLineChartController } from '../hooks/useTimeLineChartController';
import type { ChartSignal } from '../types/charts.types';

// Controller hook imports service hooks and business logic
// hooks/useTimeLineChartController.ts
import { useNodeSignals } from './useNodeSignals'; // service hook
import { buildChartData } from '../utils/chart.utils'; // helper
import type { ChartSignal } from '../types/charts.types'; // types

// Service hook imports service
// hooks/useNodeSignals.ts  
import { chartService } from '../services/chart.service';
import { QUERY_KEYS } from '../charts.constants';

// Service imports helpers and constants
// services/chart.service.ts
import { buildApiUrl } from '../utils/api.utils';
import { API_ENDPOINTS } from '../charts.constants';
import type { SignalDataParams } from '../types/charts.types';
```

### ❌ Incorrect Import Flow
```typescript
// ❌ Service trying to import hook - WRONG DIRECTION
// services/chart.service.ts
import { useNodeSignals } from '../hooks/useNodeSignals'; // FORBIDDEN

// ❌ Helper trying to import service - WRONG DIRECTION  
// utils/chart.utils.ts
import { chartService } from '../services/chart.service'; // FORBIDDEN

// ❌ Type importing business logic - WRONG DIRECTION
// types/charts.types.ts
import { CHART_COLORS } from '../charts.constants'; // FORBIDDEN
```

### Composition Over Import Violations

When you need functionality from the same layer, use composition:

```typescript
// ❌ Component importing another component directly
// components/TimeLineChart.tsx
import { ChartLegend } from './ChartLegend'; // FORBIDDEN - same layer

// ✅ Use composition in parent component/page
// pages/ChartPage.tsx
import { TimeLineChart } from '@/features/charts/components/TimeLineChart';
import { ChartLegend } from '@/features/charts/components/ChartLegend';

export function ChartPage() {
  return (
    <div>
      <TimeLineChart />
      <ChartLegend />
    </div>
  );
}
```
