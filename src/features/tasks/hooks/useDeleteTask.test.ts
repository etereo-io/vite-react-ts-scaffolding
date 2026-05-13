import { act, renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { setupMockServer } from "#/msw";
import { TestProviders } from "#/tests.helpers";
import {
  API_MOCK_PREFIX,
  ERROR_INTERNAL
} from "@/app/features/api/api.constants";
import { server } from "@/app/features/mock-server/node";
import { EVENT_TASK_DELETED } from "../tasks.constants";
import { useDeleteTask } from "./useDeleteTask";

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

setupMockServer();

describe("useDeleteTask", () => {
  const taskId = "task-to-delete";

  it("should delete a task, emit event, invalidate and notify", async () => {
    server.use(
      http.delete(
        `${API_MOCK_PREFIX}/api/v1/tasks/${taskId}`,
        () => new HttpResponse(null, { status: 204 })
      )
    );

    const { result } = renderHook(() => useDeleteTask(), {
      wrapper: TestProviders
    });

    act(() => {
      result.current.mutate(taskId);
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockEvent).toHaveBeenCalledWith(EVENT_TASK_DELETED);
    await waitFor(() => expect(mockInvalidateQueries).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(mockNotificationSuccess).toHaveBeenCalledTimes(1)
    );
  });

  it("should notify on error", async () => {
    server.use(
      http.delete(`${API_MOCK_PREFIX}/api/v1/tasks/${taskId}`, () =>
        HttpResponse.json({ code: ERROR_INTERNAL }, { status: 500 })
      )
    );

    const { result } = renderHook(() => useDeleteTask(), {
      wrapper: TestProviders
    });

    act(() => {
      result.current.mutate(taskId);
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(mockEvent).toHaveBeenCalledWith(EVENT_TASK_DELETED);
    await waitFor(() => expect(mockNotificationError).toHaveBeenCalledTimes(1));
  });
});
