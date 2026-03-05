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
