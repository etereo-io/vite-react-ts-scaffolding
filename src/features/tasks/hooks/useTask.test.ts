import { renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { TestProviders } from "#/tests.helpers";
import { API_MOCK_PREFIX } from "@/app/features/api/api.constants";
import { server } from "@/app/features/mock-server/node";
import { taskMother } from "../__mocks__/task.mother";
import { useTask } from "./useTask";

const mockNotificationError = vi.fn();
vi.mock("@/lib/notifications/notifications", () => ({
  notifications: {
    error: (...args: unknown[]) => mockNotificationError(...args)
  }
}));

describe("useTask", () => {
  const task = taskMother.getRandomTask({ id: "task-42" });

  beforeEach(() => {
    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/tasks/:taskId`, ({ params }) => {
        if (params.taskId === task.id) {
          return HttpResponse.json(task);
        }
        return HttpResponse.json(
          { code: "ERR-TASK-001", message: "Not found" },
          { status: 404 }
        );
      })
    );
  });

  it("should return a single task by id", async () => {
    const { result } = renderHook(() => useTask("task-42"), {
      wrapper: TestProviders
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data).toStrictEqual(task);
  });

  it("should not fetch when id is empty", () => {
    const { result } = renderHook(() => useTask(""), {
      wrapper: TestProviders
    });

    expect(result.current.fetchStatus).toBe("idle");
  });

  it("should notify on error", async () => {
    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/tasks/:taskId`, () =>
        HttpResponse.error()
      )
    );

    const { result } = renderHook(() => useTask("task-42"), {
      wrapper: TestProviders
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockNotificationError).toHaveBeenCalledTimes(1);
  });
});
