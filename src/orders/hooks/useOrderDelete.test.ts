import { act, renderHook, waitFor } from "@testing-library/react";
import { HttpResponse, http } from "msw";

import { server } from "@/mock-server/node";

import { useOrderDelete } from "./useOrderDelete";

import { TestProviders } from "#/tests.helpers";

const mockInvalidateQueries = vi.fn();
vi.mock("@tanstack/react-query", async () => ({
  ...(await vi.importActual("@tanstack/react-query")),
  useQueryClient: () => ({
    invalidateQueries: () => mockInvalidateQueries(),
  }),
}));

const mockEvent = vi.fn();
vi.mock("@/app/hooks/useMetrics", () => ({
  useMetrics: () => ({
    event: (name: string) => mockEvent(name),
  }),
}));

const mockNotificationError = vi.fn();
const mockNotificationSuccess = vi.fn();
vi.mock("@/lib/notifications", () => ({
  notifications: {
    error: (...args: unknown[]) => mockNotificationError(...args),
    success: (...args: unknown[]) => mockNotificationSuccess(...args),
  },
}));

describe("useOrderDelete", () => {
  const orderId = "orderId";

  it("delete single", async () => {
    const { result } = renderHook(() => useOrderDelete(), { wrapper: TestProviders });

    act(() => {
      result.current.mutate(orderId);
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    // expect(mockEvent).toHaveBeenCalledWith(EVENT_ORDER_DELETE);
    // await waitFor(() => expect(mockInvalidateQueries).toHaveBeenCalledTimes(1));
  });

  it("notify on error", async () => {
    // override already mocked endpoint
    server.use(
      http.delete("/api/orders/orderId", () => {
        // TODO: error response example
        return HttpResponse.error();
      }),
    );

    const { result } = renderHook(() => useOrderDelete(), { wrapper: TestProviders });

    act(() => {
      result.current.mutate(orderId);
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    // expect(mockEvent).toHaveBeenCalledWith(EVENT_ORDER_DELETE);
    await waitFor(() => expect(mockNotificationError).toHaveBeenCalledTimes(1));
    expect(mockNotificationError).toHaveBeenCalledWith("Error deleting order");
  });
});
