import { renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { TestProviders } from "#/tests.helpers";
import { API_MOCK_PREFIX } from "@/app/features/api/api.constants";
import { server } from "@/app/features/mock-server/node";
import { taskMother } from "../__mocks__/task.mother";
import { useTasks } from "./useTasks";

const mockNotificationError = vi.fn();
vi.mock("@/lib/notifications/notifications", () => ({
  notifications: {
    error: (...args: unknown[]) => mockNotificationError(...args)
  }
}));

describe("useTasks", () => {
  const page = taskMother.getRandomPage();

  beforeEach(() => {
    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, () => HttpResponse.json(page))
    );
  });

  it("should return paginated task data", async () => {
    const { result } = renderHook(() => useTasks(), {
      wrapper: TestProviders
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data?.data).toStrictEqual(page.data);
    expect(result.current.data?.total).toBe(page.total);
    expect(result.current.data?.offset).toBe(page.offset);
  });

  it("should pass filters as query params", async () => {
    const filters = { offset: 10, limit: 5, search: "deploy" };
    const filteredPage = taskMother.getRandomPage(10, 5);

    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, ({ request }) => {
        const url = new URL(request.url);
        expect(url.searchParams.get("search")).toBe("deploy");
        expect(url.searchParams.get("offset")).toBe("10");
        expect(url.searchParams.get("limit")).toBe("5");
        return HttpResponse.json(filteredPage);
      })
    );

    const { result } = renderHook(() => useTasks(filters), {
      wrapper: TestProviders
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data?.data).toHaveLength(filteredPage.data.length);
  });

  it("should notify on error", async () => {
    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/tasks`, () => HttpResponse.error())
    );

    const { result } = renderHook(() => useTasks(), {
      wrapper: TestProviders
    });

    await waitFor(() => expect(result.current.isError).toBe(true));
    expect(mockNotificationError).toHaveBeenCalledTimes(1);
  });
});
