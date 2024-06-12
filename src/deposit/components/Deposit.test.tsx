import { render } from "@testing-library/react";

import { Deposit } from "./Deposit";

vi.mock("react-i18next", () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useTranslation: () => ({ t: (key: any) => key }),
}));

vi.mock("../hooks/useDepositControllers", () => ({
  useDepositControllers: () => ({
    totalAmount: 100,
    mutation: { isPending: false },
    handleDepositDelete: vi.fn(),
  }),
}));

describe("Deposit", () => {
  // Mock del valor retornado por useDepositControllers
  const mockTotalAmount = 100;

  it("renders total amount correctly", () => {
    const { getByText } = render(<Deposit />);
    expect(getByText(`$${mockTotalAmount.toFixed(2)}`)).toBeInTheDocument();
  });

  it("renders balance link", () => {
    const { getByText } = render(<Deposit />);
    expect(getByText("deposit.balance")).toBeInTheDocument();
  });
});
