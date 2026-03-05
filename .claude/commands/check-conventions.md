Audit the codebase for convention violations by scanning `$ARGUMENTS` (default: `src/`).

## Instructions

Scan all `.ts` and `.tsx` files in the target directory. For each check, search for violations using Grep/Read tools and report findings.

## Checks to Run

### 1. Default Exports
Search for `export default` in all `.ts`/`.tsx` files.
**Exception**: `vite.config.ts` and i18n config files are allowed.
**Rule**: This project uses named exports ONLY.

### 2. Barrel Exports
Search for `export *` or `export {` followed by `from` in `index.ts` files that are re-exporting.
**Exception**: Module entrypoint `index.tsx` files that call `registerModule()`.
**Rule**: No barrel exports. Use direct imports.

### 3. Arrow Function Components
Search for `export const [A-Z]` in `.tsx` files that are component definitions (not constants).
**Rule**: Use function declarations for components: `export function ComponentName()`.

### 4. Props Without Readonly
Search for `interface.*Props` and check if properties have `readonly` modifier.
**Rule**: ALL interface props must be `readonly`.

### 5. Magic Strings
Search for hardcoded patterns that should be constants:
- `"/api/` or `"/v1/` in non-constants files (should use API_ENDPOINT_*)
- Query key strings in hooks that aren't from constants (should use QUERY_KEY_*)
- Permission strings like `"module:action"` outside constants files (should use PERMISSION_*)
**Rule**: No magic strings. Use constants/enums.

### 6. Business Logic in Components
Search for `useState`, `useCallback`, `useMemo`, `useEffect` in files inside `components/` directories.
**Rule**: Components are pure prop assignment. Business logic goes in controller hooks.

### 7. Error Handling in Services
Search for `try`, `catch`, `.catch(` in `.services.ts` files.
**Rule**: Services have NO error handling. Errors are handled by React Query hooks.

### 8. Service Mocking in Tests
Search for `vi.mock` targeting `.services` or `apiClient` or `axios` in test files.
**Rule**: Mock at MSW level ONLY. Never mock services or HTTP clients directly.

### 9. Inline Test Data
Search for object literals with hardcoded test data in `.test.ts`/`.test.tsx` files that should use Object Mother.
Look for: objects with `id: "..."`, `title: "..."`, `name: "..."` patterns not from mother imports.
**Rule**: Use Object Mother factories for ALL test data.

### 10. Import Order Violations
In each file, check if `@/shared/` or `@/lib/` imports appear after feature-specific imports.
**Rule**: Import order: External > @/lib > @/shared > Current feature > Cross-feature.

## Output Format

```
## Convention Audit Report

### Summary
| # | Check | Violations | Status |
|---|-------|------------|--------|
| 1 | Default Exports | 0 | PASS |
| 2 | Barrel Exports | 2 | FAIL |
| ... | ... | ... | ... |

Total: X violations found across Y files

### Detailed Violations

| # | Check | File | Line | Detail |
|---|-------|------|------|--------|
| 1 | Barrel Export | src/features/x/index.ts | 3 | `export * from "./types"` |
| ... | ... | ... | ... | ... |

### Recommendations
[Prioritized list of fixes, starting with most impactful]
```

Focus on real violations only. Do not report false positives. When in doubt about whether something is a violation, check the reference implementation in `src/features/tasks/`.
