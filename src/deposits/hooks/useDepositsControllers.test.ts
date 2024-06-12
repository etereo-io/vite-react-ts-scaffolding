import { act, renderHook, waitFor } from "@testing-library/react";
import { describe } from "vitest";

import { useDepositsControllers } from "./useDepositsControllers";
import { DepositsMother } from "../__mocks__/DepositsMother";

import { TestProviders } from "#/tests.helpers";

const depositData = DepositsMother.getRandomList();

vi.mock("./useDeposit", () => ({
  useDeposit: () => ({
    data: { data: depositData },
  }),
}));

describe("useDepositControllers", () => {
  const expectedTotalAmount = depositData.reduce((acc, deposit) => acc + parseFloat(deposit.amount), 0);
  it("should calculate totalAmount correctly", () => {
    const { result } = renderHook(() => useDepositsControllers(), { wrapper: TestProviders });

    expect(result.current.totalAmount).toBe(expectedTotalAmount);
  });

  it("should call mutation.mutate when handleDepositDelete is called", async () => {
    const { result } = renderHook(() => useDepositsControllers(), { wrapper: TestProviders });

    act(() => {
      result.current.handleDepositDelete("depositId")();
    });

    await waitFor(() => expect(result.current.mutation.isPending).toBe(false));
  });
});
