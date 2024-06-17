import { act, renderHook, waitFor } from "@testing-library/react";
import { http, HttpResponse } from "msw";

import { ERROR_INTERNAL } from "@/app/api";
import { server } from "@/mock-server/node";

import { useDepositDelete } from "./useDepositDelete";

import { TestProviders } from "#/tests.helpers";

const mockInvalidateQueries = vi.fn();
vi.mock("@tanstack/react-query", async () => ({
  ...(await vi.importActual("@tanstack/react-query")),
  useQueryClient: () => ({
    invalidateQueries: () => mockInvalidateQueries(),
  }),
}));

const mockNotificationError = vi.fn();
const mockNotificationSuccess = vi.fn();
vi.mock("@/lib/notifications/notifications", () => ({
  notifications: {
    error: (...args: unknown[]) => mockNotificationError(...args),
    success: (...args: unknown[]) => mockNotificationSuccess(...args),
  },
}));

describe("useDepositDelete", () => {
  const depositId = "depositId";

  it("delete single", async () => {
    const { result } = renderHook(() => useDepositDelete(), { wrapper: TestProviders });

    act(() => {
      result.current.mutate(depositId);
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    await waitFor(() => expect(mockInvalidateQueries).toHaveBeenCalledTimes(1));
    await waitFor(() => expect(mockNotificationSuccess).toHaveBeenCalledTimes(1));
    expect(mockNotificationSuccess).toHaveBeenCalledWith("Deposit successfully deleted");
  });

  it("notify on error", async () => {
    // override already mocked endpoint
    server.use(
      http.delete("/api/deposits/depositId", () => {
        return HttpResponse.json(
          {
            code: ERROR_INTERNAL,
          },
          { status: 400 },
        );
      }),
    );

    const { result } = renderHook(() => useDepositDelete(), { wrapper: TestProviders });

    act(() => {
      result.current.mutate(depositId);
    });

    await waitFor(() => expect(result.current.isPending).toBe(false));
    await waitFor(() => expect(mockNotificationError).toHaveBeenCalledTimes(1));
    expect(mockNotificationError).toHaveBeenCalledWith("Error deleting deposit");
  });
});
