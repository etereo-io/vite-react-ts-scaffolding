# Exercise Editor - Coding Instructions

This directory contains modular coding instructions for FrontEnd development. Each file focuses on a specific aspect of development.

## Instruction Files Overview

### Technology & Architecture
- **[stack.instruction.md](./stack.instruction.md)** - Technology stack, frameworks, and architectural patterns
- **[project-structure.instruction.md](./project-structure.instruction.md)** - Project structure, module organization, and file naming conventions
- **[component-architecture.instruction.md](./component-architecture.instruction.md)** - Component patterns, controller hooks, and separation of concerns
- **[state-and-data.instruction.md](./state-and-data.instruction.md)** - State management, data fetching, and React Query patterns

### Code Organization
- **[naming-conventions.instruction.md](./naming-conventions.instruction.md)** - Code naming patterns, constants, and avoiding magic strings
- **[imports-exports.instruction.md](./imports-exports.instruction.md)** - Import/export patterns, architectural layers, and dependency flow
- **[development-patterns.instruction.md](./development-patterns.instruction.md)** - Service patterns, error handling, mock strategies, and API communication

### UI and User Experience
- **[ui-and-styling.instruction.md](./ui-and-styling.instruction.md)** - Layout conventions, responsive design, styling patterns, and accessibility
- **[internationalization.instruction.md](./internationalization.instruction.md)** - i18n patterns, translation key structure, and localization guidelines

### Quality and Testing
- **[testing.instruction.md](./testing.instruction.md)** - Testing strategies, controller-focused testing, and mock patterns
- **[general-principles.instruction.md](./general-principles.instruction.md)** - Architectural decisions, development philosophy, and best practices

### Workflows and Processes
- **[git.instruction.md](../git.instruction.md)** - Git workflows, branching strategies, and commit conventions
- **[ai-observability.instruction.md](../ai-observability.instruction.md)** - AI observability patterns, logging, and monitoring strategies
- **[pr-review.instruction.md](./pr-review.instruction.md)** - Pull request review guidelines, code quality checks, and collaboration practices

## Key Patterns
- Feature-based architecture with clear domain separation
- Controller hooks for business logic, view components for presentation
- Service hooks with React Query for data management
- No default exports, direct imports over barrel exports
- No magic strings - use constants from domain files

