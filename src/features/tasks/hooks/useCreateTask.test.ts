import { act, renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { TestProviders } from "#/tests.helpers";
import {
  API_MOCK_PREFIX,
  ERROR_INTERNAL
} from "@/app/features/api/api.constants";
import { server } from "@/app/features/mock-server/node";
import { EVENT_TASK_CREATED } from "../tasks.constants";
import { TaskPriority, TaskStatus } from "../tasks.enums";
import type { TaskCreateRequest, TaskResponse } from "../tasks.types";
import { useCreateTask } from "./useCreateTask";

const mockInvalidateQueries = vi.fn();
vi.mock("@tanstack/react-query", async () => ({
  ...(await vi.importActual("@tanstack/react-query")),
  useQueryClient: () => ({
    invalidateQueries: () => mockInvalidateQueries()
  })
}));

const mockEvent = vi.fn();
vi.mock("@/lib/metrics/useMetrics", () => ({
  useMetrics: () => ({
    event: mockEvent
  })
}));

const mockNotificationError = vi.fn();
const mockNotificationSuccess = vi.fn();
vi.mock("@/lib/notifications/notifications", () => ({
  notifications: {
    error: (...args: unknown[]) => mockNotificationError(...args),
    success: (...args: unknown[]) => mockNotificationSuccess(...args)
  }
}));

describe("useCreateTask", () => {
  const createPayload: TaskCreateRequest = {
    title: "New task",
    description: "Task description",
    status: TaskStatus.PENDING,
    priority: TaskPriority.HIGH
  };

  const createdTask: TaskResponse = {
    id: "new-task-id",
    title: createPayload.title,
    description: createPayload.description ?? "",
    status: TaskStatus.PENDING,
    priority: TaskPriority.HIGH,
    assignee: null,
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  it("should create a task, emit event, invalidate lists and notify", async () => {
    server.use(
      http.post(`${API_MOCK_PREFIX}/api/v1/tasks`, () =>
        HttpResponse.json(createdTask, { status: 201 })
      )
    );

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: TestProviders
    });

    act(() => {
      result.current.mutate(createPayload);
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockEvent).toHaveBeenCalledWith(EVENT_TASK_CREATED);
    await waitFor(() => expect(mockInvalidateQueries).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(mockNotificationSuccess).toHaveBeenCalledTimes(1)
    );
  });

  it("should notify on error", async () => {
    server.use(
      http.post(`${API_MOCK_PREFIX}/api/v1/tasks`, () =>
        HttpResponse.json({ code: ERROR_INTERNAL }, { status: 500 })
      )
    );

    const { result } = renderHook(() => useCreateTask(), {
      wrapper: TestProviders
    });

    act(() => {
      result.current.mutate(createPayload);
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(mockEvent).toHaveBeenCalledWith(EVENT_TASK_CREATED);
    await waitFor(() => expect(mockNotificationError).toHaveBeenCalledTimes(1));
  });
});
