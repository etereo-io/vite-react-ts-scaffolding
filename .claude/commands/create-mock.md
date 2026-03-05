Create the complete mock infrastructure for a feature module.

## Arguments

Parse `$ARGUMENTS` as `feature:EntityName` where:
- **feature**: the feature directory name (e.g., "products")
- **EntityName**: PascalCase singular entity name (e.g., "Product")

## Instructions

1. Read `src/features/tasks/__mocks__/task.mother.ts` as the canonical Mother Object reference.
2. Read `src/features/tasks/__mocks__/tasks.mock-db.ts` as the canonical Mock DB reference.
3. Read `src/features/tasks/tasks.mock.handlers.ts` as the canonical MSW handlers reference.
4. Read the feature's types and enums files to understand the entity shape.

## Generate 3 Files

### 1. Mother Object

Create `src/features/{feature}/__mocks__/{entity}.mother.ts`:

```typescript
import { faker } from "@faker-js/faker";
import { API_DEFAULT_LIMIT } from "@/app/features/api/api.constants";
// Import feature types and enums

function getRandomItem(overrides?: Partial<EntityResponse>): EntityResponse {
  return {
    id: faker.string.uuid(),
    // ... faker-generated fields matching EntityResponse
    ...overrides,
  };
}

function getRandomList(count = API_DEFAULT_LIMIT, overrides?: Partial<EntityResponse>): EntityResponse[] {
  return Array.from({ length: count }, () => getRandomItem(overrides));
}

function getRandomPage(offset = 0, limit = API_DEFAULT_LIMIT) {
  const total = 50;
  const data = Array.from(
    { length: Math.min(limit, total - offset) },
    (_, index) => getRandomItem({ id: `{entity}-${offset + index}` }),
  );
  return { data, total, offset, limit };
}

export const {entity}Mother = { getRandomItem, getRandomList, getRandomPage };
```

Rules:
- Use `faker` for ALL random data (no hardcoded values)
- Use `faker.helpers.enumValue()` for enum fields
- Use `faker.helpers.maybe()` for nullable fields
- `overrides` parameter allows pinning specific fields for deterministic tests
- `getRandomPage` uses deterministic IDs based on offset+index

### 2. Mock Database

Create `src/features/{feature}/__mocks__/{feature}.mock-db.ts`:

```typescript
import { openMockStore } from "@/lib/storage/indexed-db";
// Import entity type and mother

const store = openMockStore<EntityResponse>("{feature}");

async function ensureInitialized(): Promise<void> {
  await store.initialize({entity}Mother.getRandomList(50));
}

async function getAll(): Promise<EntityResponse[]> { ... }
async function getById(id: string): Promise<EntityResponse | undefined> { ... }
async function create(item: EntityResponse): Promise<void> { ... }
async function update(id: string, item: EntityResponse): Promise<void> { ... }
async function remove(id: string): Promise<void> { ... }
async function reset(): Promise<void> { ... }

export const {feature}MockDb = { getAll, getById, create, update, remove, reset };
```

Rules:
- Use `openMockStore` from `@/lib/storage/indexed-db`
- Initialize with 50 items from Mother Object
- All functions are async (IndexedDB is async)
- Named export of the mock db object

### 3. MSW Handlers

Create `src/features/{feature}/{feature}.mock.handlers.ts`:

```typescript
import { delay, HttpResponse, http } from "msw";
import { API_DEFAULT_LIMIT, API_MOCK_PREFIX } from "@/app/features/api/api.constants";
import { DEFAULT_DELAY } from "@/app/features/mock-server/constants";
// Import mock-db, types, enums

function build{Feature}ListHandler() {
  return http.get(`${API_MOCK_PREFIX}/api/v1/{feature}`, async ({ request }) => {
    const url = new URL(request.url);
    // Parse query params, apply filters, paginate
    await delay(DEFAULT_DELAY);
    return HttpResponse.json({ data, total, offset, limit });
  });
}

function build{Feature}DetailHandler() { ... }
function build{Feature}CreateHandler() { ... }  // Return 201
function build{Feature}UpdateHandler() { ... }
function build{Feature}DeleteHandler() { ... }  // Return 204

export function getMockHandlers() {
  return [
    build{Feature}ListHandler(),
    build{Feature}DetailHandler(),
    build{Feature}CreateHandler(),
    build{Feature}UpdateHandler(),
    build{Feature}DeleteHandler(),
  ];
}
```

Rules:
- Use `API_MOCK_PREFIX` in ALL handler URLs
- Use `delay(DEFAULT_DELAY)` for realistic response timing
- Use mock-db for CRUD persistence
- Return proper HTTP status codes (200 list/detail, 201 create, 204 delete, 404 not found)
- Parse and apply query params for filtering/sorting/pagination
- Named export of `getMockHandlers()`

## Enforcement Rules
- Named exports ONLY
- ALL data from faker (no hardcoded strings)
- API_MOCK_PREFIX in every handler URL
- delay(DEFAULT_DELAY) in every handler
