Create a new feature module named "$ARGUMENTS" following the project's module creation guide.

## Instructions

1. Read `src/features/tasks/` as the **canonical reference implementation**. Read every file in that directory to understand the exact patterns.
2. Read `docs/guides/module-creation.md` for the complete 17-step process with code examples.
3. Read `docs/guides/patterns-cheatsheet.md` for quick reference on all naming conventions.

## Generate ALL files with complete content

Replace `[mod]` with the module name (lowercase, e.g., "products"), `[Mod]` with PascalCase singular (e.g., "Product"), and `[Mods]` with PascalCase plural (e.g., "Products").

### Step 1: Constants
Create `src/features/[mod]/[mod].constants.ts` with:
- `MODULE_[MOD]` -- module identifier
- `ROUTE_ID_[MOD]`, `ROUTE_ID_[MOD]_LIST`, `ROUTE_ID_[MOD]_CREATE`, `ROUTE_ID_[MOD]_EDIT` -- route IDs
- `MENU_ID_[MOD]`, `MENU_ID_[MOD]_LIST` -- menu IDs
- `API_ENDPOINT_[MOD]`, `API_ENDPOINT_[MOD]_BY_ID(id)` -- API endpoints
- `QUERY_KEY_[MOD]` + query key factory (`[mod]Keys = { all, lists, list, details, detail }`)
- `PERMISSION_[MOD]_READ_ALL`, `PERMISSION_[MOD]_WRITE_ALL`, `PERMISSION_[MOD]_ADMIN_ALL`
- `DEFAULT_[MOD]_LIMIT`, `DEFAULT_[MOD]_OFFSET`, `DEFAULT_[MOD]_FILTERS`, `DEFAULT_[MOD]_SORT`
- `EVENT_[MOD]_VIEWED`, `EVENT_[MOD]_CREATED`, `EVENT_[MOD]_UPDATED`, `EVENT_[MOD]_DELETED`

### Step 2: Routes
Create `src/features/[mod]/[mod].routes.ts` with `[MOD]_ROUTES = { PATTERNS: { root, list, create, edit(id) }, SEGMENTS: { root, list, create, edit } } as const`

### Step 3: Enums
Create `src/features/[mod]/[mod].enums.ts` with domain-appropriate enums (Status, Type, etc.)

### Step 4: Types
Create `src/features/[mod]/[mod].types.ts` with:
- `[Mod]Response` interface (readonly props)
- `[Mod]CreateRequest` interface
- `[Mod]UpdateRequest` type (Partial)
- `[Mod]Filters` interface
- `[Mod]ListResponse` interface ({ data, total, offset, limit })

### Step 5: Schemas
Create `src/features/[mod]/[mod].schemas.ts` with Zod form schema using `z.object()`. Validation error messages use i18n keys.

### Step 6: Helpers + Tests
Create `src/features/[mod]/[mod].helpers.ts` with pure utility functions.
Create `src/features/[mod]/[mod].helpers.test.ts` with direct function call tests (no providers).

### Step 7: Services
Create `src/features/[mod]/[mod].services.ts` using `apiClient` from `@/app/features/api/api`. NO error handling. Export as `[mod]Service = { list[Mods], get[Mod]ById, create[Mod], update[Mod], delete[Mod] }`.

### Step 8-9: Query Hooks (one per file)
- `src/features/[mod]/hooks/use[Mods].ts` -- list query with filters
- `src/features/[mod]/hooks/use[Mod].ts` -- detail query with id

### Step 10: Mutation Hooks (one per file)
- `src/features/[mod]/hooks/useCreate[Mod].ts` -- with cache invalidation, metrics, success/error meta
- `src/features/[mod]/hooks/useUpdate[Mod].ts`
- `src/features/[mod]/hooks/useDelete[Mod].ts`

### Step 11: Permission Hook
Create `src/features/[mod]/hooks/use[Mods]Permissions.ts` composing `useUserAuth().isAllowed()` into `canRead, canWrite, canAdmin, canCreate, canUpdate, canDelete`.

### Step 12: Controller Hooks
- `src/features/[mod]/hooks/use[Mods]ListController.ts` -- compose permissions + mutations + queries + derived state + handlers
- `src/features/[mod]/hooks/use[Mod]FormController.ts` -- handle create/edit modes, default values, submission

### Step 13: Components
- `src/features/[mod]/components/[Mods]List.tsx` -- pure prop assignment with shadcn/ui Table
- `src/features/[mod]/components/[Mod]Form.tsx` -- form with react-hook-form + Zod resolver

### Step 14: Pages
- `src/features/[mod]/pages/[Mods]ListPage.tsx` -- wires list controller to component
- `src/features/[mod]/pages/[Mod]FormPage.tsx` -- wires form controller to component

### Step 15: Mock Infrastructure
- `src/features/[mod]/__mocks__/[entity].mother.ts` -- faker factories with getRandomItem, getRandomList, getRandomPage
- `src/features/[mod]/__mocks__/[mod].mock-db.ts` -- IndexedDB store via openMockStore

### Step 16: MSW Handlers
Create `src/features/[mod]/[mod].mock.handlers.ts` with handler factories using `API_MOCK_PREFIX` and `delay(DEFAULT_DELAY)`. Export `getMockHandlers()`.

### Step 17: Locales
- `src/features/[mod]/assets/locales/en.json` with keys: `[mod].title`, `[mod].page.*`, `[mod].form.*`, `[mod].table.*`, `[mod].actions.*`, `[mod].errors.*`, `[mod].success.*`, `[mod].validation.*`
- `src/features/[mod]/assets/locales/es.json` with Spanish translations
- `src/features/[mod]/assets/locales/index.ts` exporting `{ en, es } as LocaleResources`

### Step 18: Module Registration
Create `src/features/[mod]/index.tsx` with lazy-loaded pages, routes, menuItems, and `registerModule()`.

### Step 19: Activate
Add `import "@/features/[mod]"` to `src/app/features/modules/modules.ts`.

## Enforcement Rules
- Named exports ONLY (no `export default`)
- `readonly` on ALL interface props
- Function declarations for components and hooks
- No magic strings -- ALL strings come from constants
- Services have NO error handling
- One hook per file for query/mutation hooks
- i18n keys follow `[mod].entity.aspect` pattern
- Use `API_MOCK_PREFIX` in MSW handler URLs
- Use `delay(DEFAULT_DELAY)` in MSW handlers

## After Generation
Run `pnpm types:check` and `pnpm test:run` to verify everything compiles and tests pass.
