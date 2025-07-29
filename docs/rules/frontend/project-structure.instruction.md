# Project Structure & File Organization

## Feature-Based Architecture

```
src/
├── app/                # Root application components
│   ├── components/     # App-specific components
│   └── features/       # App wide feature modules
├── features/           # Feature modules
│   ├── [feature]/
│   │   ├── __mocks__/  # Mocks for testing
│   │   ├── components/ # UI components for this feature
│   │   ├── pages/      # Feature-specific pages
│   │   ├── hooks/      # Custom hooks and controllers
│   │   ├── services/   # API services and business logic
│   │   ├── types/      # TypeScript types/interfaces
│   │   └── utils/      # Feature-specific utilities
├── shared/            # Shared across features, React-specific
│   ├── components/    # Reusable UI components
│   ├── pages/         # Shared pages
│   ├── hooks/         # Shared hooks
│   ├── services/      # Shared services
│   ├── types/         # Shared types
│   └── utils/         # Shared utilities
├── lib/               # Core utilities, not React-specific
├── assets/            # Static assets
└── locales/           # Internationalization files
```

## File Naming Conventions

### Components
- **PascalCase** - `NodePageSkeleton.tsx`, `TimeLineChart.tsx`

### Hooks
- **camelCase with `use` prefix** - `useTimeLineChartController.ts`, `useNodeSignals.ts`

### Services
- **domain.service.ts** - `node.service.ts`, `chart.service.ts`

### Types
- **camelCase with types suffix** - `charts.types.ts`, `node.types.ts`

### Constants
- **domain.constants.ts** - `charts.constants.ts`, `node.constants.ts`

### Utils/Helpers
- **camelCase with descriptor** - `charts.helpers.ts`, `date.utils.ts`

### Test Files
- **Same as source with `.test.ts` suffix** - `date.test.ts`

### Mock Files
- **Same as source with `.mock.ts` suffix** - `charts.mock.ts`

## Module Organization Principles

### 1. Domain Separation
Each feature should be self-contained with its own:
- Components (UI layer)
- Hooks (business logic layer)
- Services (data layer)
- Types (data structures)
- Constants (configuration)

### 2. Shared vs Feature-Specific
- **Shared**: React-specific utilities without business logic
- **Features**: Domain-specific business logic and components
- **Lib**: Core utilities, not React-specific

### 3. Import Strategy
Use direct imports, avoid barrel exports:

```typescript
// ✅ Preferred - Direct imports
import { TimeLineChart } from "@/features/charts/components/TimeLineChart";
import { useTimeLineChartController } from "@/features/charts/hooks/useTimeLineChartController";
import type { ChartSignal } from "@/features/charts/types/charts.types";

// ❌ Avoid barrel exports
import { TimeLineChart, useTimeLineChartController } from "@/features/charts";
```

### Benefits
- **Better tree shaking**: Only imports what's actually used
- **Clearer dependencies**: Explicit about which files are being used
- **IDE performance**: Faster auto-completion and navigation
- **Build performance**: Reduces bundle size and compilation time

## Directory Structure Guidelines

### Feature Module Template
```
features/[feature-name]/
├── __mocks__/                      # Test data factories and MSW handlers
│   ├── [Feature]Mother.ts
│   └── [feature].mock.ts
├── components/                     # UI components
│   ├── [FeatureComponent].tsx
│   └── [SubComponent].tsx
├── pages/                          # Feature-specific pages
│   ├── [FeaturePage].tsx
│   └── [SubPage].tsx
├── hooks/                          # Business logic hooks
│   ├── use[Feature]Controller.ts
│   └── use[ServiceHook].ts
├── [feature].service.ts            # API and business logic
├── [feature].types.ts              # TypeScript definitions
└── [feature].helpers.ts            # Feature-specific utilities
```

### Asset Organization
```
src/assets/
├── icons/          # SVG icons
├── images/         # Images (PNG, JPG)
└── fonts/          # Custom fonts
```
