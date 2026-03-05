import { faker } from "@faker-js/faker";
import { delay, HttpResponse, http } from "msw";

import {
  API_DEFAULT_LIMIT,
  API_MOCK_PREFIX
} from "@/app/features/api/api.constants";
import { DEFAULT_DELAY } from "@/app/features/mock-server/constants";

import { tasksMockDb } from "./__mocks__/tasks.mock-db";
import { TaskPriority, TaskStatus } from "./tasks.enums";
import type {
  TaskCreateRequest,
  TaskResponse,
  TaskUpdateRequest
} from "./tasks.types";

function buildTasksListHandler() {
  return http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, async ({ request }) => {
    const url = new URL(request.url);
    const offset = +(url.searchParams.get("offset") ?? 0);
    const limit = +(url.searchParams.get("limit") ?? API_DEFAULT_LIMIT);
    const search = url.searchParams.get("search") ?? "";
    const statusEq = url.searchParams.get("status.eq") ?? "";
    const priorityEq = url.searchParams.get("priority.eq") ?? "";
    const sort = url.searchParams.get("sort") ?? "-createdAt";

    let tasks = await tasksMockDb.getAll();

    // Filter by search
    if (search) {
      const lowerSearch = search.toLowerCase();
      tasks = tasks.filter(
        (task) =>
          task.title.toLowerCase().includes(lowerSearch) ||
          task.description.toLowerCase().includes(lowerSearch)
      );
    }

    // Filter by status
    if (statusEq) {
      tasks = tasks.filter((task) => task.status === statusEq);
    }

    // Filter by priority
    if (priorityEq) {
      tasks = tasks.filter((task) => task.priority === priorityEq);
    }

    // Sort
    if (sort) {
      const desc = sort.startsWith("-");
      const field = (desc ? sort.slice(1) : sort) as keyof TaskResponse;
      tasks = [...tasks].sort((a, b) => {
        const aVal = a[field] ?? "";
        const bVal = b[field] ?? "";
        const comparison = String(aVal).localeCompare(String(bVal));
        return desc ? -comparison : comparison;
      });
    }

    const total = tasks.length;
    const paginatedTasks = tasks.slice(offset, offset + limit);

    await delay(DEFAULT_DELAY);
    return HttpResponse.json({
      data: paginatedTasks,
      total,
      offset,
      limit
    });
  });
}

function buildTaskDetailHandler() {
  return http.get(
    `${API_MOCK_PREFIX}/api/v1/tasks/:taskId`,
    async ({ params }) => {
      const taskId = params.taskId as string;
      const task = await tasksMockDb.getById(taskId);

      if (!task) {
        await delay(DEFAULT_DELAY);
        return HttpResponse.json(
          { code: "ERR-TASK-001", message: "Task not found" },
          { status: 404 }
        );
      }

      await delay(DEFAULT_DELAY);
      return HttpResponse.json(task);
    }
  );
}

function buildTaskCreateHandler() {
  return http.post(`${API_MOCK_PREFIX}/api/v1/tasks`, async ({ request }) => {
    const body = (await request.json()) as TaskCreateRequest;
    const now = new Date().toISOString();

    const newTask: TaskResponse = {
      id: faker.string.uuid(),
      title: body.title,
      description: body.description ?? "",
      status: body.status ?? TaskStatus.PENDING,
      priority: body.priority ?? TaskPriority.MEDIUM,
      assignee: body.assignee ?? null,
      dueDate: body.dueDate ?? null,
      createdAt: now,
      updatedAt: now
    };

    await tasksMockDb.create(newTask);

    await delay(DEFAULT_DELAY);
    return HttpResponse.json(newTask, { status: 201 });
  });
}

function buildTaskUpdateHandler() {
  return http.put(
    `${API_MOCK_PREFIX}/api/v1/tasks/:taskId`,
    async ({ params, request }) => {
      const taskId = params.taskId as string;
      const existing = await tasksMockDb.getById(taskId);

      if (!existing) {
        await delay(DEFAULT_DELAY);
        return HttpResponse.json(
          { code: "ERR-TASK-001", message: "Task not found" },
          { status: 404 }
        );
      }

      const body = (await request.json()) as TaskCreateRequest;
      const updatedTask: TaskResponse = {
        ...existing,
        title: body.title,
        description: body.description ?? existing.description,
        status: body.status ?? existing.status,
        priority: body.priority ?? existing.priority,
        assignee: body.assignee ?? existing.assignee,
        dueDate: body.dueDate ?? existing.dueDate,
        updatedAt: new Date().toISOString()
      };

      await tasksMockDb.update(taskId, updatedTask);

      await delay(DEFAULT_DELAY);
      return HttpResponse.json(updatedTask);
    }
  );
}

function buildTaskPatchHandler() {
  return http.patch(
    `${API_MOCK_PREFIX}/api/v1/tasks/:taskId`,
    async ({ params, request }) => {
      const taskId = params.taskId as string;
      const existing = await tasksMockDb.getById(taskId);

      if (!existing) {
        await delay(DEFAULT_DELAY);
        return HttpResponse.json(
          { code: "ERR-TASK-001", message: "Task not found" },
          { status: 404 }
        );
      }

      const body = (await request.json()) as TaskUpdateRequest;
      const updatedTask: TaskResponse = {
        ...existing,
        ...body,
        id: taskId,
        assignee:
          body.assignee !== undefined
            ? (body.assignee ?? null)
            : existing.assignee,
        dueDate:
          body.dueDate !== undefined
            ? (body.dueDate ?? null)
            : existing.dueDate,
        updatedAt: new Date().toISOString()
      };

      await tasksMockDb.update(taskId, updatedTask);

      await delay(DEFAULT_DELAY);
      return HttpResponse.json(updatedTask);
    }
  );
}

function buildTaskDeleteHandler() {
  return http.delete(
    `${API_MOCK_PREFIX}/api/v1/tasks/:taskId`,
    async ({ params }) => {
      const taskId = params.taskId as string;
      const existing = await tasksMockDb.getById(taskId);

      if (!existing) {
        await delay(DEFAULT_DELAY);
        return HttpResponse.json(
          { code: "ERR-TASK-001", message: "Task not found" },
          { status: 404 }
        );
      }

      await tasksMockDb.remove(taskId);

      await delay(DEFAULT_DELAY);
      return new HttpResponse(null, { status: 204 });
    }
  );
}

export const getMockHandlers = () => [
  buildTasksListHandler(),
  buildTaskDetailHandler(),
  buildTaskCreateHandler(),
  buildTaskUpdateHandler(),
  buildTaskPatchHandler(),
  buildTaskDeleteHandler()
];
