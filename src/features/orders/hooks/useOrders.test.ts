import { renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { TestProviders } from "#/tests.helpers";
import { API_MOCK_PREFIX } from "@/app/features/api/api.contants";
import { server } from "@/app/features/mock-server/node";
import { orderMother } from "../__mocks__/order.mother";
import { useOrders } from "./useOrders";

const mockNotificationError = vi.fn();
vi.mock("@/lib/notifications/notifications", () => ({
  notifications: {
    error: (...args: unknown[]) => mockNotificationError(...args)
  }
}));

describe("useOrders", () => {
  const data = orderMother.getRandomPage();

  beforeEach(() => {
    // override already mocked endpoint
    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/orders`, () =>
        HttpResponse.json({
          data,
          pagination: {
            offset: 0,
            limit: 10,
            count: 100,
            hasMore: true
          }
        })
      )
    );
  });

  it("should return data", async () => {
    const { result } = renderHook(() => useOrders(), {
      wrapper: TestProviders
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(result.current.data?.data).toStrictEqual(data);
    expect(result.current.data?.pagination.count).toStrictEqual(100);
  });

  it("should notify on error", async () => {
    server.use(
      http.get(`${API_MOCK_PREFIX}/api/v1/orders`, () => HttpResponse.error())
    );
    const { result } = renderHook(() => useOrders(), {
      wrapper: TestProviders
    });

    await waitFor(() => expect(result.current.isError).toBeTruthy());
    expect(mockNotificationError).toHaveBeenCalledTimes(1);
  });
});
