import { act, renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";
import { TestProviders } from "#/tests.helpers";
import {
  API_MOCK_PREFIX,
  ERROR_INTERNAL
} from "@/app/features/api/api.contants";
import { server } from "@/app/features/mock-server/node";
import { EVENT_ORDER_DELETE } from "../orders.constants";
import { useOrderDelete } from "./useOrderDelete";

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

describe("useOrderDelete", () => {
  const orderId = "orderId";

  it("delete single", async () => {
    const { result } = renderHook(() => useOrderDelete(), {
      wrapper: TestProviders
    });

    act(() => {
      result.current.mutate(orderId);
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(mockEvent).toHaveBeenCalledWith(EVENT_ORDER_DELETE);
    await waitFor(() => expect(mockInvalidateQueries).toHaveBeenCalledTimes(1));
    await waitFor(() =>
      expect(mockNotificationSuccess).toHaveBeenCalledTimes(1)
    );
    expect(mockNotificationSuccess).toHaveBeenCalledWith(
      "Order deleted successfully"
    );
  });

  it("notify on error", async () => {
    // override already mocked endpoint
    server.use(
      http.delete(`${API_MOCK_PREFIX}/api/v1/orders/orderId`, () => {
        return HttpResponse.json(
          {
            code: ERROR_INTERNAL
          },
          { status: 500 }
        );
      })
    );

    const { result } = renderHook(() => useOrderDelete(), {
      wrapper: TestProviders
    });

    act(() => {
      result.current.mutate(orderId);
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    expect(mockEvent).toHaveBeenCalledWith(EVENT_ORDER_DELETE);
    await waitFor(() => expect(mockNotificationError).toHaveBeenCalledTimes(1));
    expect(mockNotificationError).toHaveBeenCalledWith("Error deleting order");
  });
});
