import { apiClient } from "@/app/features/api/api";

import { API_ENDPOINT_TASK_BY_ID, API_ENDPOINT_TASKS } from "./tasks.constants";
import type {
  TaskCreateRequest,
  TaskFilters,
  TaskListResponse,
  TaskResponse,
  TaskUpdateRequest
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
  listTasks,
  getTaskById,
  createTask,
  updateTask,
  partialUpdateTask,
  deleteTask
};
