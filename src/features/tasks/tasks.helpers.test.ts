import { TaskPriority, TaskStatus } from "./tasks.enums";
import {
  buildTaskSortQuery,
  getPriorityBadgeVariant,
  getStatusBadgeVariant,
  getTaskStatusLabel,
  isTaskOverdue,
  mapColumnFiltersToTaskFilters
} from "./tasks.helpers";
import type { TaskResponse } from "./tasks.types";

function createTask(overrides: Partial<TaskResponse> = {}): TaskResponse {
  return {
    id: "task-1",
    title: "Test task",
    description: "Test description",
    status: TaskStatus.PENDING,
    priority: TaskPriority.MEDIUM,
    assignee: null,
    dueDate: null,
    createdAt: "2026-01-01T00:00:00Z",
    updatedAt: "2026-01-01T00:00:00Z",
    ...overrides
  };
}

describe("getStatusBadgeVariant", () => {
  it("returns 'secondary' for PENDING", () => {
    expect(getStatusBadgeVariant(TaskStatus.PENDING)).toBe("secondary");
  });

  it("returns 'default' for IN_PROGRESS", () => {
    expect(getStatusBadgeVariant(TaskStatus.IN_PROGRESS)).toBe("default");
  });

  it("returns 'outline' for COMPLETED", () => {
    expect(getStatusBadgeVariant(TaskStatus.COMPLETED)).toBe("outline");
  });

  it("returns 'destructive' for CANCELLED", () => {
    expect(getStatusBadgeVariant(TaskStatus.CANCELLED)).toBe("destructive");
  });
});

describe("getPriorityBadgeVariant", () => {
  it("returns 'outline' for LOW", () => {
    expect(getPriorityBadgeVariant(TaskPriority.LOW)).toBe("outline");
  });

  it("returns 'secondary' for MEDIUM", () => {
    expect(getPriorityBadgeVariant(TaskPriority.MEDIUM)).toBe("secondary");
  });

  it("returns 'default' for HIGH", () => {
    expect(getPriorityBadgeVariant(TaskPriority.HIGH)).toBe("default");
  });

  it("returns 'destructive' for CRITICAL", () => {
    expect(getPriorityBadgeVariant(TaskPriority.CRITICAL)).toBe("destructive");
  });
});

describe("isTaskOverdue", () => {
  it("returns false when dueDate is null", () => {
    const task = createTask({ dueDate: null });
    expect(isTaskOverdue(task)).toBe(false);
  });

  it("returns false when task is COMPLETED", () => {
    const task = createTask({
      status: TaskStatus.COMPLETED,
      dueDate: "2020-01-01T00:00:00Z"
    });
    expect(isTaskOverdue(task)).toBe(false);
  });

  it("returns false when task is CANCELLED", () => {
    const task = createTask({
      status: TaskStatus.CANCELLED,
      dueDate: "2020-01-01T00:00:00Z"
    });
    expect(isTaskOverdue(task)).toBe(false);
  });

  it("returns true when dueDate is in the past and task is PENDING", () => {
    const task = createTask({
      status: TaskStatus.PENDING,
      dueDate: "2020-01-01T00:00:00Z"
    });
    expect(isTaskOverdue(task)).toBe(true);
  });

  it("returns true when dueDate is in the past and task is IN_PROGRESS", () => {
    const task = createTask({
      status: TaskStatus.IN_PROGRESS,
      dueDate: "2020-01-01T00:00:00Z"
    });
    expect(isTaskOverdue(task)).toBe(true);
  });

  it("returns false when dueDate is in the future", () => {
    const task = createTask({
      status: TaskStatus.PENDING,
      dueDate: "2099-12-31T23:59:59Z"
    });
    expect(isTaskOverdue(task)).toBe(false);
  });
});

describe("buildTaskSortQuery", () => {
  it("returns empty string for empty sorting array", () => {
    expect(buildTaskSortQuery([])).toBe("");
  });

  it("returns field name for ascending sort", () => {
    expect(buildTaskSortQuery([{ id: "title", desc: false }])).toBe("title");
  });

  it("returns prefixed field name for descending sort", () => {
    expect(buildTaskSortQuery([{ id: "createdAt", desc: true }])).toBe(
      "-createdAt"
    );
  });

  it("handles multiple sort fields", () => {
    expect(
      buildTaskSortQuery([
        { id: "priority", desc: true },
        { id: "title", desc: false }
      ])
    ).toBe("-priority,title");
  });
});

describe("mapColumnFiltersToTaskFilters", () => {
  it("returns empty filters for empty column filters", () => {
    expect(mapColumnFiltersToTaskFilters([])).toEqual({});
  });

  it("maps status filter as single value", () => {
    const result = mapColumnFiltersToTaskFilters([
      { id: "status", value: TaskStatus.PENDING }
    ]);
    expect(result).toEqual({ "status.eq": TaskStatus.PENDING });
  });

  it("maps status filter as array", () => {
    const result = mapColumnFiltersToTaskFilters([
      { id: "status", value: [TaskStatus.PENDING, TaskStatus.IN_PROGRESS] }
    ]);
    expect(result).toEqual({
      "status.in": [TaskStatus.PENDING, TaskStatus.IN_PROGRESS]
    });
  });

  it("maps priority filter", () => {
    const result = mapColumnFiltersToTaskFilters([
      { id: "priority", value: TaskPriority.HIGH }
    ]);
    expect(result).toEqual({ "priority.eq": TaskPriority.HIGH });
  });

  it("maps assignee filter", () => {
    const result = mapColumnFiltersToTaskFilters([
      { id: "assignee", value: "user-1" }
    ]);
    expect(result).toEqual({ "assignee.eq": "user-1" });
  });

  it("maps dueDate range filter", () => {
    const result = mapColumnFiltersToTaskFilters([
      {
        id: "dueDate",
        value: { from: "2026-01-01", to: "2026-12-31" }
      }
    ]);
    expect(result).toEqual({
      "dueDate.gte": "2026-01-01",
      "dueDate.lte": "2026-12-31"
    });
  });

  it("includes global filter as search", () => {
    const result = mapColumnFiltersToTaskFilters([], "my search term");
    expect(result).toEqual({ search: "my search term" });
  });

  it("combines column filters and global filter", () => {
    const result = mapColumnFiltersToTaskFilters(
      [{ id: "priority", value: TaskPriority.CRITICAL }],
      "urgent"
    );
    expect(result).toEqual({
      "priority.eq": TaskPriority.CRITICAL,
      search: "urgent"
    });
  });

  it("does not include search when global filter is empty", () => {
    const result = mapColumnFiltersToTaskFilters([], "");
    expect(result).toEqual({});
  });
});

describe("getTaskStatusLabel", () => {
  it("returns correct i18n key for PENDING", () => {
    expect(getTaskStatusLabel(TaskStatus.PENDING)).toBe("tasks.status.pending");
  });

  it("returns correct i18n key for IN_PROGRESS", () => {
    expect(getTaskStatusLabel(TaskStatus.IN_PROGRESS)).toBe(
      "tasks.status.inProgress"
    );
  });

  it("returns correct i18n key for COMPLETED", () => {
    expect(getTaskStatusLabel(TaskStatus.COMPLETED)).toBe(
      "tasks.status.completed"
    );
  });

  it("returns correct i18n key for CANCELLED", () => {
    expect(getTaskStatusLabel(TaskStatus.CANCELLED)).toBe(
      "tasks.status.cancelled"
    );
  });
});
