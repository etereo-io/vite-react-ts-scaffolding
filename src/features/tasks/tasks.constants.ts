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
  "title",
  "status",
  "priority",
  "dueDate",
  "createdAt",
  "updatedAt"
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
