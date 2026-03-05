Perform a comprehensive code review of `$ARGUMENTS` against ALL documented project conventions.

If `$ARGUMENTS` is empty or "all", review all staged/modified files (`git diff --name-only`).

## Instructions

1. Read these instruction files to understand ALL conventions:
   - `docs/rules/frontend/component-architecture.instruction.md`
   - `docs/rules/frontend/imports-exports.instruction.md`
   - `docs/rules/frontend/naming-conventions.instruction.md`
   - `docs/rules/frontend/testing.instruction.md`
   - `docs/rules/frontend/state-and-data.instruction.md`
   - `docs/rules/frontend/internationalization.instruction.md`
   - `docs/rules/frontend/general-principles.instruction.md`
   - `docs/rules/frontend/pr-review.instruction.md`

2. Read every file in the review target.

3. Check each file against ALL categories below.

## Review Checklist

### Architecture
- [ ] Components are pure prop assignment (NO business logic, NO handler creation, NO useState/useCallback)
- [ ] ALL handlers and business logic in controller hooks
- [ ] Services have NO error handling (no try/catch, no .catch())
- [ ] Import hierarchy respected (Types < Constants < Helpers < Services < Hooks < Components < Pages)
- [ ] No circular imports
- [ ] One hook per file for query/mutation hooks
- [ ] Pages only hold minimal UI state (search, page index)

### Exports & Imports
- [ ] Named exports ONLY (no `export default`)
- [ ] No barrel exports (no `export *` or re-export index.ts)
- [ ] Direct imports to specific files
- [ ] `import type` for TypeScript type-only imports
- [ ] Correct import order: External > @/lib > @/shared > Feature (types>constants>helpers>services>hooks>components) > Cross-feature
- [ ] Path aliases used (@/ for src/, #/ for test/)

### Naming
- [ ] PascalCase for components (.tsx), camelCase for hooks (use*.ts)
- [ ] Domain files follow `[domain].suffix.ts` pattern
- [ ] Constants use SCREAMING_SNAKE_CASE with correct prefixes (MODULE_, QUERY_KEY_, PERMISSION_, etc.)
- [ ] Boolean variables use `is*`/`has*`/`can*`/`should*` prefixes
- [ ] Event handlers use `handle*` prefix
- [ ] No magic strings -- all strings from constants/enums

### TypeScript
- [ ] `readonly` on ALL interface props
- [ ] Function declarations for components and hooks (not arrow functions)
- [ ] No `any` type without explicit justification comment
- [ ] Proper use of `as const` for constant objects/arrays

### Testing
- [ ] MSW-level mocking ONLY (never mock services, axios, or apiClient)
- [ ] Object Mother factories for ALL test data (never inline literals)
- [ ] No `userEvent.click()` in controller tests -- call handlers via `act()`
- [ ] Correct provider tiering (None for helpers, MinimalTestProviders for hooks, TestProviders for components)
- [ ] Standard mutation mock setup (queryClient, metrics, notifications)
- [ ] Descriptive test names explaining expected behavior

### i18n
- [ ] ALL user-facing text uses `t()` from `useTranslation`
- [ ] Keys follow `module.entity.aspect` pattern
- [ ] No dynamic key construction (no template literals for i18n keys)
- [ ] Feature-colocated locales in `assets/locales/`

### Red Flags
- [ ] No `any` type without justification
- [ ] No `console.log` in production code
- [ ] No commented-out code blocks
- [ ] No TODO/FIXME without GitHub issue reference
- [ ] No direct DOM manipulation in React components
- [ ] No hardcoded configuration values

## Output Format

For each finding, use this format:

### Blocking Issues

**Issue**: [Brief description]
**File**: `path/to/file.ts:lineNumber`
**Problem**: [Why this violates conventions]
**Suggestion**: [Code fix or approach]
**Reference**: [Instruction file path]

### Suggestions (non-blocking)

**Optional**: [Brief description]
**File**: `path/to/file.ts:lineNumber`
**Benefit**: [Improvement rationale]
**Suggestion**: [Code example]

### Positive Highlights

**Great work**: [What was done well and why it follows conventions]

## Summary

End with a summary table:
| Category | Pass | Fail | Warnings |
|----------|------|------|----------|
| Architecture | | | |
| Exports & Imports | | | |
| Naming | | | |
| TypeScript | | | |
| Testing | | | |
| i18n | | | |
| Red Flags | | | |
