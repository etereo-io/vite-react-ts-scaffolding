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
