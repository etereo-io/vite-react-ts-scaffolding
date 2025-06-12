import { renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { server } from "@/app/features/mock-server/node";

import { OrderMother } from "../__mocks__/OrderMother";
import { useOrders } from "./useOrders";

import { TestProviders } from "#/tests.helpers";

const mockNotificationError = vi.fn();
vi.mock("@/lib/notifications/notifications", () => ({
  notifications: {
    error: (...args: unknown[]) => mockNotificationError(...args)
  }
}));

describe("useOrders", () => {
  const data = OrderMother.getRandomPage();

  beforeEach(() => {
    // override already mocked endpoint
    server.use(
      http.get("/api/orders", () =>
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
    server.use(http.get("/api/orders", () => HttpResponse.error()));
    const { result } = renderHook(() => useOrders(), {
      wrapper: TestProviders
    });

    await waitFor(() => expect(result.current.isError).toBeTruthy());
    expect(mockNotificationError).toHaveBeenCalledTimes(1);
  });
});
