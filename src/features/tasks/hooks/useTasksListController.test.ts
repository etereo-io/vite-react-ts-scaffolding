import { act, renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { setupMockServer } from "#/msw";
import { TestProviders } from "#/tests.helpers";
import { API_MOCK_PREFIX } from "@/app/features/api/api.constants";
import { server } from "@/app/features/mock-server/node";
import { taskMother } from "../__mocks__/task.mother";
import { useTasksListController } from "./useTasksListController";

const mockEvent = vi.fn();
vi.mock("@/lib/metrics/useMetrics", () => ({
  useMetrics: () => ({
    event: (name: string) => mockEvent(name)
  })
}));

setupMockServer();

describe("useTasksListController", () => {
  const page = taskMother.getRandomPage();

  beforeEach(() => {
    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, () => HttpResponse.json(page))
    );
  });

  test("should return tasks and compute totalPages", async () => {
    const { result } = renderHook(() => useTasksListController(), {
      wrapper: TestProviders
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));

    expect(result.current.tasks).toStrictEqual(page.data);
    expect(result.current.total).toBe(page.total);
    expect(result.current.totalPages).toBeGreaterThan(0);
  });

  test("should return empty tasks when no data", async () => {
    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, () =>
        HttpResponse.json({ data: [], total: 0, offset: 0, limit: 20 })
      )
    );

    const { result } = renderHook(() => useTasksListController(), {
      wrapper: TestProviders
    });

    await waitFor(() => expect(result.current.isFetching).toBe(false));
    expect(result.current.tasks).toStrictEqual([]);
    expect(result.current.total).toBe(0);
    expect(result.current.totalPages).toBe(0);
  });

  test("should apply pagination offset from pageIndex", async () => {
    const pageSize = 10;
    const pageIndex = 2;

    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("offset")).toBe(
          String(pageIndex * pageSize)
        );
        expect(url.searchParams.get("limit")).toBe(String(pageSize));
        return HttpResponse.json(page);
      })
    );

    const { result } = renderHook(
      () =>
        useTasksListController({
          pagination: { pageIndex, pageSize }
        }),
      { wrapper: TestProviders }
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
  });

  test("should apply globalFilter as search param", async () => {
    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("search")).toBe("deploy");
        return HttpResponse.json(page);
      })
    );

    const { result } = renderHook(
      () => useTasksListController({ globalFilter: "deploy" }),
      { wrapper: TestProviders }
    );

    await waitFor(() => expect(result.current.isFetching).toBe(false));
  });

  test("should handle delete via handleDeleteTask", async () => {
    server.use(
      http.delete(
        `${API_MOCK_PREFIX}/api/v1/tasks/task-1`,
        () => new HttpResponse(null, { status: 204 })
      )
    );

    const { result } = renderHook(() => useTasksListController(), {
      wrapper: TestProviders
    });

    act(() => {
      result.current.handleDeleteTask("task-1")();
    });

    await waitFor(() => expect(result.current.isDeleting).toBe(false));
  });

  test("should expose permission flags", async () => {
    const { result } = renderHook(() => useTasksListController(), {
      wrapper: TestProviders
    });

    expect(result.current.canRead).toBeDefined();
    expect(result.current.canWrite).toBeDefined();
    expect(result.current.canDelete).toBeDefined();
    expect(result.current.canCreate).toBeDefined();
  });
});
