# Module Creation Guide

This guide walks through creating a new feature module step by step. It uses the **Tasks** module (`src/features/tasks/`) as the reference implementation.

---

## Prerequisites

Before starting, ensure you understand:
- The [Architecture document](../architecture/ARCHITECTURE.md) for how modules work.
- The coding conventions in `docs/rules/frontend/README.md`.

---

## Step 1: Create the feature directory structure

```
src/features/tasks/
  __mocks__/
    task.mother.ts
    tasks.mock-db.ts
  assets/
    locales/
      en.json
      es.json
      index.ts
  components/
    TasksList.tsx
    TaskForm.tsx
    TaskStatusBadge.tsx
    TaskPriorityBadge.tsx
  hooks/
    useTasks.ts
    useTask.ts
    useCreateTask.ts
    useUpdateTask.ts
    usePartialUpdateTask.ts
    useDeleteTask.ts
    useTasksPermissions.ts
    useTasksListController.ts
    useTaskFormController.ts
  pages/
    TasksListPage.tsx
    TaskFormPage.tsx
  index.tsx
  tasks.constants.ts
  tasks.routes.ts
  tasks.enums.ts
  tasks.types.ts
  tasks.schemas.ts
  tasks.helpers.ts
  tasks.helpers.test.ts
  tasks.services.ts
  tasks.mock.handlers.ts
```

---

## Step 2: Define constants

**File:** `src/features/tasks/tasks.constants.ts`

Define all identifiers that the module needs. Use the established prefix conventions.

```typescript
// Module identification
export const MODULE_TASKS = "tasks";

// Route IDs (dotted hierarchy)
export const ROUTE_ID_TASKS = "admin.tasks";
export const ROUTE_ID_TASKS_LIST = "admin.tasks.list";
export const ROUTE_ID_TASKS_CREATE = "admin.tasks.create";
export const ROUTE_ID_TASKS_EDIT = "admin.tasks.edit";

// Menu IDs
export const MENU_ID_TASKS = "menu.admin.tasks";
export const MENU_ID_TASKS_LIST = "menu.admin.tasks.list";

// API Endpoints
export const API_ENDPOINT_TASKS = "/v1/tasks";
export const API_ENDPOINT_TASK_BY_ID = (id: string) => `/v1/tasks/${id}`;

// Query Key Factory
export const QUERY_KEY_TASKS = "tasks";
export const taskKeys = {
  all: [QUERY_KEY_TASKS] as const,
  lists: () => [...taskKeys.all, "list"] as const,
  list: (filters: Record<string, unknown>) =>
    [...taskKeys.lists(), filters] as const,
  details: () => [...taskKeys.all, "detail"] as const,
  detail: (id: string) => [...taskKeys.details(), id] as const
};

// Permissions
export const PERMISSION_TASKS_READ_ALL = "tasks:read:all";
export const PERMISSION_TASKS_WRITE_ALL = "tasks:write:all";
export const PERMISSION_TASKS_ADMIN_ALL = "tasks:admin:all";

// Default filters
export const DEFAULT_TASKS_LIMIT = 20;
export const DEFAULT_TASKS_OFFSET = 0;
export const DEFAULT_TASKS_FILTERS = { offset: 0, limit: 20 } as const;

// Sorting
export const DEFAULT_TASKS_SORT = "-createdAt";
export const TASK_SORTABLE_FIELDS = [
  "title", "status", "priority", "dueDate", "createdAt", "updatedAt"
] as const;

// Error code mapping
export const TASK_ERROR_MESSAGES: Record<string, string> = {
  "ERR-TASK-001": "tasks.errors.notFound",
  "ERR-TASK-002": "tasks.errors.createFailed",
  "ERR-TASK-003": "tasks.errors.updateFailed",
  "ERR-TASK-004": "tasks.errors.deleteFailed"
};

// Analytics events
export const EVENT_TASK_VIEWED = "task_viewed";
export const EVENT_TASK_CREATED = "task_created";
export const EVENT_TASK_UPDATED = "task_updated";
export const EVENT_TASK_DELETED = "task_deleted";
export const EVENT_TASK_STATUS_CHANGED = "task_status_changed";
```

---

## Step 3: Define routes

**File:** `src/features/tasks/tasks.routes.ts`

Define both PATTERNS (absolute, for navigation) and SEGMENTS (relative, for router config):

```typescript
export const TASKS_ROUTES = {
  PATTERNS: {
    root: "/admin/tasks",
    list: "/admin/tasks/list",
    create: "/admin/tasks/create",
    edit: (id: string) => `/admin/tasks/${id}/edit`
  },
  SEGMENTS: {
    root: "tasks",
    list: "tasks/list",
    create: "tasks/create",
    edit: "tasks/:taskId/edit"
  }
} as const;
```

**Rules:**
- `PATTERNS` are used for `<Link to={...}>` and `navigate(...)`.
- `SEGMENTS` are used in `RouteObject.path`.
- Dynamic segments in PATTERNS are functions; in SEGMENTS they use `:paramName` syntax.

---

## Step 4: Create enums (if needed)

**File:** `src/features/tasks/tasks.enums.ts`

Define enums for constrained domain values:

```typescript
export enum TaskStatus {
  PENDING = "PENDING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export enum TaskPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL"
}
```

---

## Step 5: Define types

**File:** `src/features/tasks/tasks.types.ts`

Define the API response types, request types, and filter types:

```typescript
import type { TaskPriority, TaskStatus } from "./tasks.enums";

export interface TaskResponse {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee: string | null;
  dueDate: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskCreateRequest {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assignee?: string;
  dueDate?: string;
}

export type TaskUpdateRequest = Partial<TaskCreateRequest>;

export interface TaskFilters {
  "status.eq"?: TaskStatus;
  "status.in"?: TaskStatus[];
  "priority.eq"?: TaskPriority;
  "assignee.eq"?: string;
  "dueDate.lte"?: string;
  "dueDate.gte"?: string;
  search?: string;
  offset?: number;
  limit?: number;
  sort?: string;
}

export interface TaskListResponse {
  data: TaskResponse[];
  total: number;
  offset: number;
  limit: number;
}
```

---

## Step 6: Create Zod schemas

**File:** `src/features/tasks/tasks.schemas.ts`

Define validation schemas for forms and filter inputs:

```typescript
import { z } from "zod/v4";
import { TaskPriority, TaskStatus } from "./tasks.enums";

export const taskFormSchema = z.object({
  title: z
    .string()
    .min(1, "tasks.validation.titleRequired")
    .max(200, "tasks.validation.titleMaxLength"),
  description: z
    .string()
    .max(2000, "tasks.validation.descriptionMaxLength")
    .optional()
    .or(z.literal("")),
  status: z.nativeEnum(TaskStatus),
  priority: z.nativeEnum(TaskPriority),
  assignee: z.string().optional().or(z.literal("")),
  dueDate: z.string().optional().or(z.literal(""))
});

export type TaskFormData = z.infer<typeof taskFormSchema>;
```

**Note:** Validation error messages use i18n keys (e.g., `"tasks.validation.titleRequired"`) so they can be translated.

---

## Step 7: Create helpers

**File:** `src/features/tasks/tasks.helpers.ts`

Pure functions for business logic that does not require React hooks:

```typescript
import { TaskPriority, TaskStatus } from "./tasks.enums";
import type { TaskFilters, TaskResponse } from "./tasks.types";

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export function getStatusBadgeVariant(status: TaskStatus): BadgeVariant {
  switch (status) {
    case TaskStatus.PENDING:      return "secondary";
    case TaskStatus.IN_PROGRESS:  return "default";
    case TaskStatus.COMPLETED:    return "outline";
    case TaskStatus.CANCELLED:    return "destructive";
    default:                      return "default";
  }
}

export function isTaskOverdue(task: TaskResponse): boolean {
  if (!task.dueDate) return false;
  if (task.status === TaskStatus.COMPLETED || task.status === TaskStatus.CANCELLED) return false;
  return new Date(task.dueDate) < new Date();
}

export function buildTaskSortQuery(sorting: SortingState[]): string {
  if (sorting.length === 0) return "";
  return sorting.map((sort) => (sort.desc ? `-${sort.id}` : sort.id)).join(",");
}

export function mapColumnFiltersToTaskFilters(
  columnFilters: ColumnFilter[],
  globalFilter?: string
): TaskFilters {
  const filters: TaskFilters = {};
  for (const filter of columnFilters) {
    switch (filter.id) {
      case "status":
        if (Array.isArray(filter.value)) {
          filters["status.in"] = filter.value as TaskStatus[];
        } else {
          filters["status.eq"] = filter.value as TaskStatus;
        }
        break;
      case "priority":
        filters["priority.eq"] = filter.value as TaskPriority;
        break;
      // ... more filter mappings
    }
  }
  if (globalFilter) filters.search = globalFilter;
  return filters;
}
```

Write tests for helpers in `tasks.helpers.test.ts`. Helpers are pure functions and easy to test without any providers.

---

## Step 8: Create services

**File:** `src/features/tasks/tasks.services.ts`

Services are pure API communication. No error handling (delegated to React Query hooks). Use the shared `apiClient` instance and endpoint constants:

```typescript
import { apiClient } from "@/app/features/api/api";
import { API_ENDPOINT_TASK_BY_ID, API_ENDPOINT_TASKS } from "./tasks.constants";
import type {
  TaskCreateRequest, TaskFilters, TaskListResponse,
  TaskResponse, TaskUpdateRequest
} from "./tasks.types";

function listTasks(filters?: TaskFilters) {
  return apiClient
    .get<TaskListResponse>(API_ENDPOINT_TASKS, { params: filters })
    .then((res) => res.data);
}

function getTaskById(id: string) {
  return apiClient
    .get<TaskResponse>(API_ENDPOINT_TASK_BY_ID(id))
    .then((res) => res.data);
}

function createTask(data: TaskCreateRequest) {
  return apiClient
    .post<TaskResponse>(API_ENDPOINT_TASKS, data)
    .then((res) => res.data);
}

function updateTask(id: string, data: TaskCreateRequest) {
  return apiClient
    .put<TaskResponse>(API_ENDPOINT_TASK_BY_ID(id), data)
    .then((res) => res.data);
}

function partialUpdateTask(id: string, data: TaskUpdateRequest) {
  return apiClient
    .patch<TaskResponse>(API_ENDPOINT_TASK_BY_ID(id), data)
    .then((res) => res.data);
}

function deleteTask(id: string) {
  return apiClient.delete(API_ENDPOINT_TASK_BY_ID(id)).then((res) => res.data);
}

export const tasksService = {
  listTasks, getTaskById, createTask, updateTask, partialUpdateTask, deleteTask
};
```

---

## Step 9: Create query hooks

One hook per file. Each wraps a service function with `useQuery` and the query key factory.

**File:** `src/features/tasks/hooks/useTasks.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import { DEFAULT_TASKS_FILTERS, taskKeys } from "../tasks.constants";
import { tasksService } from "../tasks.services";
import type { TaskFilters } from "../tasks.types";

export function useTasks(filters: TaskFilters = DEFAULT_TASKS_FILTERS) {
  return useQuery({
    queryKey: taskKeys.list(filters as Record<string, unknown>),
    queryFn: () => tasksService.listTasks(filters),
    meta: { errorMessage: "tasks.fetch.error" }
  });
}
```

**File:** `src/features/tasks/hooks/useTask.ts`

```typescript
import { useQuery } from "@tanstack/react-query";
import { taskKeys } from "../tasks.constants";
import { tasksService } from "../tasks.services";

export function useTask(id: string) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: () => tasksService.getTaskById(id),
    enabled: !!id,
    meta: { errorMessage: "tasks.fetchDetail.error" }
  });
}
```

---

## Step 10: Create mutation hooks

One hook per mutation. Each handles cache invalidation, metrics, and success/error messages.

**File:** `src/features/tasks/hooks/useCreateTask.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useMetrics } from "@/lib/metrics/useMetrics";
import { EVENT_TASK_CREATED, taskKeys } from "../tasks.constants";
import { tasksService } from "../tasks.services";
import type { TaskCreateRequest } from "../tasks.types";

export function useCreateTask() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const metrics = useMetrics();

  return useMutation({
    mutationFn: (data: TaskCreateRequest) => {
      metrics.event(EVENT_TASK_CREATED);
      return tasksService.createTask(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    meta: {
      errorMessage: t("tasks.create.error"),
      successMessage: t("tasks.create.success")
    }
  });
}
```

**File:** `src/features/tasks/hooks/useDeleteTask.ts`

```typescript
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useMetrics } from "@/lib/metrics/useMetrics";
import { EVENT_TASK_DELETED, taskKeys } from "../tasks.constants";
import { tasksService } from "../tasks.services";

export function useDeleteTask() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const metrics = useMetrics();

  return useMutation({
    mutationFn: (id: string) => {
      metrics.event(EVENT_TASK_DELETED);
      return tasksService.deleteTask(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
    meta: {
      errorMessage: t("tasks.delete.error"),
      successMessage: t("tasks.delete.success")
    }
  });
}
```

---

## Step 11: Create permission hook

**File:** `src/features/tasks/hooks/useTasksPermissions.ts`

```typescript
import { useUserAuth } from "@/app/features/auth/hooks/useUserAuth";
import {
  PERMISSION_TASKS_ADMIN_ALL,
  PERMISSION_TASKS_READ_ALL,
  PERMISSION_TASKS_WRITE_ALL
} from "../tasks.constants";

export function useTasksPermissions() {
  const { isAllowed, isPending } = useUserAuth();

  const canRead = isAllowed(PERMISSION_TASKS_READ_ALL);
  const canWrite = isAllowed(PERMISSION_TASKS_WRITE_ALL);
  const canAdmin = isAllowed(PERMISSION_TASKS_ADMIN_ALL);

  const canCreate = canWrite || canAdmin;
  const canUpdate = canWrite || canAdmin;
  const canDelete = canAdmin;

  return { isPending, canRead, canWrite, canAdmin, canCreate, canUpdate, canDelete };
}
```

---

## Step 12: Create controller hooks

Controllers compose service hooks, permissions, local state, and event handlers.

**File:** `src/features/tasks/hooks/useTasksListController.ts`

```typescript
import { useCallback, useMemo } from "react";
import { DEFAULT_TASKS_FILTERS, DEFAULT_TASKS_SORT } from "../tasks.constants";
import { buildTaskSortQuery, mapColumnFiltersToTaskFilters } from "../tasks.helpers";
import type { TaskFilters } from "../tasks.types";
import { useDeleteTask } from "./useDeleteTask";
import { useTasks } from "./useTasks";
import { useTasksPermissions } from "./useTasksPermissions";

interface UseTasksListControllerOptions {
  readonly columnFilters?: ColumnFilter[];
  readonly globalFilter?: string;
  readonly sorting?: SortingState[];
  readonly pagination?: PaginationState;
}

export function useTasksListController(options: UseTasksListControllerOptions = {}) {
  const { columnFilters = [], globalFilter = "", sorting = [], pagination = { pageIndex: 0, pageSize: DEFAULT_TASKS_FILTERS.limit } } = options;

  const permissions = useTasksPermissions();
  const deleteTaskMutation = useDeleteTask();

  // Build filters from table state
  const filters: TaskFilters = useMemo(() => {
    const mappedFilters = mapColumnFiltersToTaskFilters(columnFilters, globalFilter);
    const sortQuery = buildTaskSortQuery(sorting);
    return {
      ...mappedFilters,
      offset: pagination.pageIndex * pagination.pageSize,
      limit: pagination.pageSize,
      sort: sortQuery || DEFAULT_TASKS_SORT
    };
  }, [columnFilters, globalFilter, sorting, pagination]);

  const { data, isFetching, isError, error } = useTasks(filters);

  // Handlers
  const handleDeleteTask = useCallback(
    (taskId: string) => () => deleteTaskMutation.mutate(taskId),
    [deleteTaskMutation]
  );

  const totalPages = useMemo(() => {
    if (!data?.total) return 0;
    return Math.ceil(data.total / pagination.pageSize);
  }, [data?.total, pagination.pageSize]);

  return {
    tasks: data?.data ?? [],
    total: data?.total ?? 0,
    totalPages,
    isFetching, isError, error,
    isDeleting: deleteTaskMutation.isPending,
    ...permissions,
    handleDeleteTask
  };
}
```

**File:** `src/features/tasks/hooks/useTaskFormController.ts`

```typescript
import { useCallback } from "react";
import { TaskPriority, TaskStatus } from "../tasks.enums";
import type { TaskFormData } from "../tasks.schemas";
import type { TaskResponse } from "../tasks.types";
import { useCreateTask } from "./useCreateTask";
import { useUpdateTask } from "./useUpdateTask";

interface UseTaskFormControllerOptions {
  readonly mode: "create" | "edit";
  readonly task?: TaskResponse;
  readonly onSuccess?: () => void;
}

export function useTaskFormController(options: UseTaskFormControllerOptions) {
  const { mode, task, onSuccess } = options;
  const createMutation = useCreateTask();
  const updateMutation = useUpdateTask();

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  const defaultValues: TaskFormData = {
    title: task?.title ?? "",
    description: task?.description ?? "",
    status: task?.status ?? TaskStatus.PENDING,
    priority: task?.priority ?? TaskPriority.MEDIUM,
    assignee: task?.assignee ?? "",
    dueDate: task?.dueDate ?? ""
  };

  const handleSubmit = useCallback((data: TaskFormData) => {
    const payload = {
      ...data,
      assignee: data.assignee || undefined,
      dueDate: data.dueDate || undefined,
      description: data.description || undefined
    };
    if (mode === "create") {
      createMutation.mutate(payload, { onSuccess: () => onSuccess?.() });
    } else if (task) {
      updateMutation.mutate({ id: task.id, data: payload }, { onSuccess: () => onSuccess?.() });
    }
  }, [mode, task, createMutation, updateMutation, onSuccess]);

  return {
    defaultValues, isSubmitting,
    isCreateMode: mode === "create",
    isEditMode: mode === "edit",
    handleSubmit,
    createError: createMutation.error,
    updateError: updateMutation.error
  };
}
```

---

## Step 13: Create components

Components are pure prop assignment. Use shadcn/ui primitives from `@/shared/components/ui/`.

**File:** `src/features/tasks/components/TasksList.tsx`

```typescript
import { Pencil, Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import type { RequiredPermissions } from "@/app/features/auth/auth.types";
import { AllowedAuth } from "@/app/features/auth/components/AllowedAuth";
import { Button } from "@/shared/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/shared/components/ui/table";

import { TASKS_ROUTES } from "../tasks.routes";
import type { TaskResponse } from "../tasks.types";
import { TaskPriorityBadge } from "./TaskPriorityBadge";
import { TaskStatusBadge } from "./TaskStatusBadge";

interface TasksListProps {
  readonly tasks: TaskResponse[];
  readonly canDelete: RequiredPermissions;
  readonly onDelete: (id: string) => void;
}

export function TasksList({ tasks, canDelete, onDelete }: TasksListProps) {
  const { t } = useTranslation();

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        {t("tasks.table.empty")}
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>{t("tasks.table.columns.title")}</TableHead>
          <TableHead>{t("tasks.table.columns.status")}</TableHead>
          {/* ... more columns */}
        </TableRow>
      </TableHeader>
      <TableBody>
        {tasks.map((task) => (
          <TableRow key={task.id}>
            <TableCell className="font-medium">{task.title}</TableCell>
            <TableCell><TaskStatusBadge status={task.status} /></TableCell>
            {/* ... more cells */}
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon-xs" asChild>
                  <Link to={TASKS_ROUTES.PATTERNS.edit(task.id)}>
                    <Pencil className="w-4 h-4" />
                  </Link>
                </Button>
                <AllowedAuth permissions={canDelete}>
                  <Button variant="ghost" size="icon-xs"
                    onClick={() => onDelete(task.id)}
                    aria-label={t("tasks.actions.delete")}>
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </AllowedAuth>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
```

**Key principles:**
- Components receive data and handlers via props -- no business logic.
- Use `AllowedAuth` for permission-gated UI.
- Use `TASKS_ROUTES.PATTERNS` for navigation links.
- Use i18n keys for all user-facing text.

---

## Step 14: Create pages

Pages wire controllers to components. They may hold minimal UI-only state (search input, page index).

**File:** `src/features/tasks/pages/TasksListPage.tsx`

```typescript
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router";

import { TasksList } from "../components/TasksList";
import { useTasksListController } from "../hooks/useTasksListController";
import { DEFAULT_TASKS_FILTERS, PERMISSION_TASKS_WRITE_ALL } from "../tasks.constants";
import { TASKS_ROUTES } from "../tasks.routes";

export function TasksListPage() {
  const { t } = useTranslation();
  const [search, setSearch] = useState("");
  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = DEFAULT_TASKS_FILTERS.limit;

  const { tasks, total, totalPages, isFetching, canDelete, handleDeleteTask } =
    useTasksListController({
      globalFilter: search,
      pagination: { pageIndex, pageSize }
    });

  return (
    <div>
      {/* Title, search input, create button, task list, pagination */}
      <TasksList
        tasks={tasks}
        canDelete={canDelete}
        onDelete={(id) => handleDeleteTask(id)()}
      />
    </div>
  );
}
```

Pages use lazy loading in the module's `index.tsx` for code splitting:

```typescript
const TasksListPage = async () => {
  const { TasksListPage } = await import("./pages/TasksListPage");
  return { Component: TasksListPage };
};
```

---

## Step 15: Create mock files

### 15a. Mother object

**File:** `src/features/tasks/__mocks__/task.mother.ts`

```typescript
import { faker } from "@faker-js/faker";
import { API_DEFAULT_LIMIT } from "@/app/features/api/api.constants";
import { TaskPriority, TaskStatus } from "../tasks.enums";
import type { TaskResponse } from "../tasks.types";

function getRandomTask(overrides?: Partial<TaskResponse>): TaskResponse {
  const createdAt = faker.date.recent({ days: 30 }).toISOString();
  const updatedAt = faker.date.between({ from: createdAt, to: new Date() }).toISOString();
  return {
    id: faker.string.uuid(),
    title: faker.lorem.sentence({ min: 3, max: 8 }),
    description: faker.lorem.paragraph(),
    status: faker.helpers.enumValue(TaskStatus),
    priority: faker.helpers.enumValue(TaskPriority),
    assignee: faker.helpers.maybe(() => faker.person.fullName(), { probability: 0.7 }) ?? null,
    dueDate: faker.helpers.maybe(() => faker.date.soon({ days: 30 }).toISOString(), { probability: 0.8 }) ?? null,
    createdAt, updatedAt,
    ...overrides
  };
}

function getRandomList(count = API_DEFAULT_LIMIT, overrides?: Partial<TaskResponse>): TaskResponse[] {
  return Array.from({ length: count }, () => getRandomTask(overrides));
}

function getRandomPage(offset = 0, limit = API_DEFAULT_LIMIT) {
  const total = 50;
  const data = Array.from(
    { length: Math.min(limit, total - offset) },
    (_, index) => getRandomTask({ id: `task-${offset + index}` })
  );
  return { data, total, offset, limit };
}

export const taskMother = { getRandomTask, getRandomList, getRandomPage };
```

### 15b. Mock database

**File:** `src/features/tasks/__mocks__/tasks.mock-db.ts`

```typescript
import { openMockStore } from "@/lib/storage/indexed-db";
import type { TaskResponse } from "../tasks.types";
import { taskMother } from "./task.mother";

const taskStore = openMockStore<TaskResponse>("tasks");

async function ensureInitialized(): Promise<void> {
  await taskStore.initialize(taskMother.getRandomList(50));
}

async function getAll(): Promise<TaskResponse[]> {
  await ensureInitialized();
  return taskStore.getAll();
}

async function getById(id: string): Promise<TaskResponse | undefined> {
  await ensureInitialized();
  return taskStore.getById(id);
}

async function create(item: TaskResponse): Promise<void> {
  await ensureInitialized();
  await taskStore.put(item);
}

async function update(id: string, item: TaskResponse): Promise<void> {
  await ensureInitialized();
  const existing = await taskStore.getById(id);
  if (!existing) throw new Error(`Task with id ${id} not found`);
  await taskStore.put({ ...existing, ...item, id });
}

async function remove(id: string): Promise<void> {
  await ensureInitialized();
  await taskStore.delete(id);
}

async function reset(): Promise<void> {
  await taskStore.clear();
  await taskStore.initialize(taskMother.getRandomList(50));
}

export const tasksMockDb = { getAll, getById, create, update, remove, reset };
```

### 15c. MSW handlers

**File:** `src/features/tasks/tasks.mock.handlers.ts`

```typescript
import { faker } from "@faker-js/faker";
import { delay, HttpResponse, http } from "msw";
import { API_DEFAULT_LIMIT, API_MOCK_PREFIX } from "@/app/features/api/api.constants";
import { DEFAULT_DELAY } from "@/app/features/mock-server/constants";
import { tasksMockDb } from "./__mocks__/tasks.mock-db";
import { TaskPriority, TaskStatus } from "./tasks.enums";
import type { TaskCreateRequest, TaskResponse, TaskUpdateRequest } from "./tasks.types";

function buildTasksListHandler() {
  return http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, async ({ request }) => {
    const url = new URL(request.url);
    const offset = +(url.searchParams.get("offset") ?? 0);
    const limit = +(url.searchParams.get("limit") ?? API_DEFAULT_LIMIT);
    // ... filtering, sorting, pagination logic
    let tasks = await tasksMockDb.getAll();
    // Apply filters...
    const total = tasks.length;
    const paginatedTasks = tasks.slice(offset, offset + limit);
    await delay(DEFAULT_DELAY);
    return HttpResponse.json({ data: paginatedTasks, total, offset, limit });
  });
}

// buildTaskDetailHandler(), buildTaskCreateHandler(), etc.
// Each handler follows the same pattern: read from mock-db, apply business logic, return response.

export const getMockHandlers = () => [
  buildTasksListHandler(),
  buildTaskDetailHandler(),
  buildTaskCreateHandler(),
  buildTaskUpdateHandler(),
  buildTaskPatchHandler(),
  buildTaskDeleteHandler()
];
```

**Key patterns:**
- Use `API_MOCK_PREFIX` prefix for all handler URLs.
- Use `delay(DEFAULT_DELAY)` for realistic response times.
- Return proper HTTP status codes (201 for create, 204 for delete, 404 for not found).
- Use the mock-db for CRUD persistence.

---

## Step 16: Create locales

**File:** `src/features/tasks/assets/locales/en.json`

```json
{
  "translation": {
    "tasks.title": "Tasks",
    "tasks.page.list.title": "Tasks",
    "tasks.page.list.description": "Manage and track your team's tasks",
    "tasks.page.create.title": "Create Task",
    "tasks.page.edit.title": "Edit Task",
    "tasks.form.fields.title": "Title",
    "tasks.form.fields.description": "Description",
    "tasks.form.fields.status": "Status",
    "tasks.form.fields.priority": "Priority",
    "tasks.form.fields.assignee": "Assignee",
    "tasks.form.fields.dueDate": "Due Date",
    "tasks.form.placeholders.title": "Search tasks...",
    "tasks.status.PENDING": "Pending",
    "tasks.status.IN_PROGRESS": "In Progress",
    "tasks.actions.create": "New Task",
    "tasks.actions.delete": "Delete",
    "tasks.table.columns.title": "Title",
    "tasks.table.empty": "No tasks found",
    "tasks.errors.notFound": "Task not found",
    "tasks.success.created": "Task created successfully",
    "tasks.validation.titleRequired": "Title is required"
  }
}
```

Create matching `es.json` with Spanish translations.

**File:** `src/features/tasks/assets/locales/index.ts`

```typescript
import type { LocaleResources } from "@/app/features/i18n/i18n.types";
import en from "./en.json";
import es from "./es.json";

export const locales = { en, es } as LocaleResources;
```

**Key convention:** All keys are prefixed with the module name (`tasks.`), use flat dot-separated paths, and follow the pattern `module.entity.aspect`.

---

## Step 17: Register module

**File:** `src/features/tasks/index.tsx`

This is the module entrypoint. It registers routes, menu items, locales, mock handlers, and permissions:

```typescript
import { ClipboardList } from "lucide-react";
import type { RouteObject } from "react-router";
import type { MenuItem } from "@/app/app.types";
import type { User } from "@/app/features/auth/auth.types";
import { registerModule } from "@/app/features/modules/modules.helpers";
import { ProtectedAdminLayout } from "@/shared/layouts/ProtectedAdminLayout";

import { locales } from "./assets/locales";
import {
  MODULE_TASKS,
  PERMISSION_TASKS_ADMIN_ALL,
  PERMISSION_TASKS_READ_ALL,
  PERMISSION_TASKS_WRITE_ALL
} from "./tasks.constants";
import { getMockHandlers } from "./tasks.mock.handlers";
import { TASKS_ROUTES } from "./tasks.routes";

// Lazy-loaded pages for code splitting
const TasksListPage = async () => {
  const { TasksListPage } = await import("./pages/TasksListPage");
  return { Component: TasksListPage };
};

const TaskFormPage = async () => {
  const { TaskFormPage } = await import("./pages/TaskFormPage");
  return { Component: TaskFormPage };
};

const routes: RouteObject[] = [
  {
    path: "/admin",
    element: <ProtectedAdminLayout />,
    children: [
      { path: TASKS_ROUTES.SEGMENTS.list, lazy: TasksListPage },
      { path: TASKS_ROUTES.SEGMENTS.create, lazy: TaskFormPage },
      { path: TASKS_ROUTES.SEGMENTS.edit, lazy: TaskFormPage }
    ]
  }
];

const menuItems: MenuItem[] = [
  {
    title: "tasks.title",
    path: TASKS_ROUTES.PATTERNS.list,
    icon: <ClipboardList className="w-5 h-5" />,
    isAllowed: (user: User) =>
      user.permissions?.includes(PERMISSION_TASKS_READ_ALL) ||
      user.permissions?.includes(PERMISSION_TASKS_ADMIN_ALL) ||
      true
  }
];

registerModule({
  name: MODULE_TASKS,
  routes,
  menuItems,
  locales,
  getMockHandlers,
  permissions: [
    PERMISSION_TASKS_READ_ALL,
    PERMISSION_TASKS_WRITE_ALL,
    PERMISSION_TASKS_ADMIN_ALL
  ]
});
```

### Activate the module

Add the side-effect import to `src/app/features/modules/modules.ts`:

```typescript
import "@/features/tasks";
```

That is the only change needed outside the feature directory. The module system will automatically include the routes, menu items, locales, and mock handlers.

---

## Checklist

- [ ] Feature directory created under `src/features/[name]/`
- [ ] Constants defined with proper prefixes (`MODULE_`, `QUERY_KEY_`, `PERMISSION_`, `API_ENDPOINT_`, `EVENT_`)
- [ ] Routes defined with PATTERNS and SEGMENTS
- [ ] Enums created for constrained values
- [ ] Types defined (Response, Request, Filters, ListResponse)
- [ ] Zod schemas created for form validation
- [ ] Helpers implemented as pure functions with tests
- [ ] Service object created using `apiClient`
- [ ] Query hooks created (one per file, using query key factory)
- [ ] Mutation hooks created (one per file, with cache invalidation and metrics)
- [ ] Permission hook created composing `useUserAuth`
- [ ] Controller hooks created composing all of the above
- [ ] Components created as pure prop assignment with shadcn/ui
- [ ] Pages created wiring controllers to components
- [ ] Mother object created with faker
- [ ] Mock database created with `openMockStore`
- [ ] MSW handlers created with `API_MOCK_PREFIX` and `DEFAULT_DELAY`
- [ ] Locale files created (en.json, es.json, index.ts)
- [ ] Module registered in `index.tsx` with `registerModule()`
- [ ] Side-effect import added to `modules.ts`
