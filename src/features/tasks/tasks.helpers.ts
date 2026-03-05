import { TaskPriority, TaskStatus } from "./tasks.enums";
import type { TaskFilters, TaskResponse } from "./tasks.types";

interface SortingState {
  readonly id: string;
  readonly desc: boolean;
}

interface ColumnFilter {
  readonly id: string;
  readonly value: unknown;
}

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

export function getStatusBadgeVariant(status: TaskStatus): BadgeVariant {
  switch (status) {
    case TaskStatus.PENDING:
      return "secondary";
    case TaskStatus.IN_PROGRESS:
      return "default";
    case TaskStatus.COMPLETED:
      return "outline";
    case TaskStatus.CANCELLED:
      return "destructive";
    default:
      return "default";
  }
}

export function getPriorityBadgeVariant(priority: TaskPriority): BadgeVariant {
  switch (priority) {
    case TaskPriority.LOW:
      return "outline";
    case TaskPriority.MEDIUM:
      return "secondary";
    case TaskPriority.HIGH:
      return "default";
    case TaskPriority.CRITICAL:
      return "destructive";
    default:
      return "default";
  }
}

export function isTaskOverdue(task: TaskResponse): boolean {
  if (!task.dueDate) {
    return false;
  }

  if (
    task.status === TaskStatus.COMPLETED ||
    task.status === TaskStatus.CANCELLED
  ) {
    return false;
  }

  return new Date(task.dueDate) < new Date();
}

export function buildTaskSortQuery(sorting: SortingState[]): string {
  if (sorting.length === 0) {
    return "";
  }

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
      case "assignee":
        filters["assignee.eq"] = filter.value as string;
        break;
      case "dueDate":
        if (
          typeof filter.value === "object" &&
          filter.value !== null &&
          !Array.isArray(filter.value)
        ) {
          const range = filter.value as { from?: string; to?: string };
          if (range.from) {
            filters["dueDate.gte"] = range.from;
          }
          if (range.to) {
            filters["dueDate.lte"] = range.to;
          }
        }
        break;
    }
  }

  if (globalFilter) {
    filters.search = globalFilter;
  }

  return filters;
}

export function getTaskStatusLabel(status: TaskStatus): string {
  switch (status) {
    case TaskStatus.PENDING:
      return "tasks.status.pending";
    case TaskStatus.IN_PROGRESS:
      return "tasks.status.inProgress";
    case TaskStatus.COMPLETED:
      return "tasks.status.completed";
    case TaskStatus.CANCELLED:
      return "tasks.status.cancelled";
    default:
      return "tasks.status.unknown";
  }
}
