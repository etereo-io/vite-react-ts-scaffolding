# Technology Stack

## Frontend Framework
- **React** - UI library for building component-based interfaces
- **TypeScript** - Type-safe JavaScript with enhanced developer experience
- **Vite** - Fast build tool and development server

## Styling & Design
- **TailwindCSS** - Utility-first CSS framework
- **shadcn/ui** - Accessible component library built on Radix UI + Tailwind
- **Container Queries** - Component-based responsive design
- **Flexbox-first** - Layout strategy for most UI components

## State Management
- **TanStack React Query** - Server state management, caching, and synchronization
- **react-idle-timer** - Pauses query polling when user is idle (bridges with focusManager)
- React Query + context is the state strategy (no dedicated global state library)

## Forms & Validation
- **React Hook Form** - Performant form state management
- **Zod** - Schema validation for forms and API data

## HTTP
- **Axios** - HTTP client with interceptor support

## UI
- **sonner** - Toast notification library

## Utilities
- **date-fns** - Lightweight date manipulation library

## Development & Testing
- **Vitest** - Fast unit testing framework
- **Testing Library** - Simple and complete testing utilities
- **MSW (Mock Service Worker)** - API mocking for development and testing

## Internationalization
- **react-i18next** - Internationalization framework for React applications

## Architecture Patterns

### Data Flow
- **Service Layer** - Pure API communication
- **Service Hooks** - React Query integration with error handling
- **Controller Hooks** - Business logic and state coordination
- **View Components** - Pure presentation layer

### Code Organization
- **Feature-based Architecture** - Domain-driven module organization
- **Direct Imports** - No barrel exports for better tree-shaking
- **Named Exports** - No default exports for better refactoring
- **Layer Separation** - Clear architectural hierarchy

### Quality Assurance
- **Type Safety** - Readonly props and strong typing by default
- **No Magic Strings** - Constants and enums for all string literals
- **Composition Pattern** - Small, reusable components over large configurations
- **Controller-focused Testing** - Business logic testing in hooks

## Development Philosophy
- **Explicit over Implicit** - Clear, readable code over clever abstractions
- **Testability First** - Structure for easy testing and mocking
- **Performance Conscious** - Measured optimization strategies
- **Accessibility** - ARIA guidelines and semantic HTML
