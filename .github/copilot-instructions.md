# Project Quick Reference (Copilot)

Vite + React + TypeScript scaffolding archetype with modular architecture, runtime config, auth system, MSW mocking, i18n, shadcn/ui, and comprehensive testing infrastructure.

Read through all instructions before anything else to understand the coding standards, architectural patterns, and best practices to follow while contributing to the project.

## Quick Commands

- `pnpm dev` — Start dev server
- `pnpm build` — Production build
- `pnpm test:run` — Run all tests
- `pnpm types:check` — TypeScript check
- `pnpm lint` — Biome lint check
- `pnpm lint:fix` — Auto-fix lint issues

## Key Directories

- `src/app/` — App shell (providers, config, auth, modules, i18n, mock-server)
- `src/features/` — Feature modules (tasks, orders, dashboard)
- `src/shared/` — React-specific shared code (hooks, components, layouts)
- `src/lib/` — Framework-agnostic utilities (string, date, file, format, storage)
- `test/` — Test helpers and providers
- `config/` — Environment YAML configs
- `docker/` — Docker configs

## Reference Module

Use `src/features/tasks/` as the canonical reference for creating new feature modules.

## Module Creation Checklist

Constants -> Routes -> Types -> Schemas -> Helpers -> Services -> Hooks -> Components -> Pages -> Mocks -> Locales -> Registration

## Key Conventions

- Named exports only (no default exports)
- Readonly props on interfaces
- Controller hooks for business logic (not in components)
- Query key factory pattern for React Query
- Permission format: `module:action:scope`
- Direct imports (no barrel exports)

## Architecture & Instruction Files

- Frontend Coding Rules => docs/rules/frontend/README.md
- AI Observability => docs/rules/ai-observability.instruction.md
- Git Workflow => docs/rules/git.instruction.md

Copilot and all AI tools should follow these rules for code generation, review, and suggestions.
