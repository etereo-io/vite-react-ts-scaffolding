# Project Structure & File Organization

## Feature-Based Architecture

```
docker/                     # Docker config (entrypoint.sh, nginx.conf)
config/                     # Environment YAML configs (config.dev.yml, config.pro.yml, etc.)
src/
├── app/                    # Root application components
│   ├── components/         # App-specific components
│   └── features/           # App-wide feature modules
│       ├── api/            # API client setup
│       ├── auth/           # Authentication providers & hooks
│       ├── config/         # Runtime config providers
│       ├── debug/          # Debug providers (e.g. DebugProviders)
│       ├── idle/           # Idle detection (pauses query polling)
│       ├── i18n/           # i18n setup components
│       ├── mock-server/    # MSW server providers
│       ├── modules/        # Module registration
│       └── vite-plugins/   # Custom Vite plugins (e.g. htmlMetaTagsPlugin)
├── features/               # Feature modules
│   ├── [feature]/
│   │   ├── __mocks__/      # Mock factories and mock databases
│   │   ├── assets/locales/ # Feature-scoped i18n translations
│   │   ├── components/     # UI components for this feature
│   │   ├── pages/          # Feature-specific pages
│   │   ├── hooks/          # Custom hooks and controllers
│   │   ├── services/       # API services and business logic
│   │   ├── types/          # TypeScript types/interfaces
│   │   └── utils/          # Feature-specific utilities
├── shared/                 # Shared across features, React-specific
│   ├── components/         # Reusable UI components
│   │   └── ui/             # shadcn/ui generated components (button, card, dialog, etc.)
│   ├── hooks/              # Shared hooks
│   │   ├── useDebounce.ts
│   │   ├── useDebouncedCallback.ts
│   │   ├── useDataTable.ts
│   │   ├── useMediaQuery.ts
│   │   ├── useMobile.ts
│   │   ├── useInfiniteScroll.ts
│   │   ├── useNavigationBlocker.ts
│   │   ├── usePaginatedQuery.ts
│   │   └── ...
│   ├── layouts/            # Shared layout components
│   ├── pages/              # Shared pages
│   ├── services/           # Shared services
│   ├── types/              # Shared types
│   └── utils/              # Shared utilities
├── lib/                    # Core utilities, not React-specific
│   ├── string.ts           # String manipulation helpers
│   ├── date.ts             # Date utilities (date-fns wrappers)
│   ├── file.ts             # File handling utilities
│   ├── id.ts               # ID generation (nanoid, etc.)
│   ├── format.ts           # Formatting helpers
│   ├── parsers.ts          # Data parsing utilities
│   ├── compose-refs.ts     # Ref composition utility
│   ├── breakpoints.ts      # Responsive breakpoint definitions
│   ├── classnames.ts       # Classname merge utility (cn)
│   ├── object.ts           # Object manipulation helpers
│   ├── storage/            # Storage manager, IndexedDB wrapper
│   │   ├── storage.ts
│   │   ├── indexed-db.ts
│   │   └── msw-storage.ts
│   ├── metrics/            # Metrics collection
│   ├── notifications/      # Notification utilities
│   └── queryparams/        # URL query parameter hooks
├── assets/                 # Static assets
└── locales/                # Internationalization files
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
Based on the actual `tasks` module structure:
```
features/[feature-name]/
├── __mocks__/                      # Test data factories and mock databases
│   ├── [feature].mother.ts         # Object Mother factory for test data
│   └── [feature].mock-db.ts        # IndexedDB mock database for MSW handlers
├── assets/
│   └── locales/                    # Feature-scoped i18n translations
│       ├── en.json
│       ├── es.json
│       └── index.ts
├── components/                     # UI components
│   ├── [FeatureComponent].tsx
│   └── [SubComponent].tsx
├── pages/                          # Feature-specific pages
│   ├── [FeaturePage].tsx
│   └── [SubPage].tsx
├── hooks/                          # Business logic hooks
│   ├── use[Feature]Controller.ts   # Controller hooks
│   └── use[ServiceHook].ts         # React Query service hooks
├── [feature].services.ts           # API communication layer
├── [feature].types.ts              # TypeScript definitions
├── [feature].schemas.ts            # Zod validation schemas
├── [feature].routes.ts             # Feature route definitions
├── [feature].enums.ts              # Feature-specific enumerations
├── [feature].constants.ts          # Feature-specific constants
├── [feature].helpers.ts            # Feature-specific utilities
├── [feature].mock.handlers.ts      # MSW request handlers for this feature
└── index.tsx                       # Module registration entry point
```

### Asset Organization
```
src/assets/
├── icons/          # SVG icons
├── images/         # Images (PNG, JPG)
└── fonts/          # Custom fonts
```
