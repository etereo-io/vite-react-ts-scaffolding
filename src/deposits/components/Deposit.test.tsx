import { I18nextProvider, initReactI18next } from "react-i18next";

import i18next from "i18next";

import { Deposit } from "./Deposit";
import resources from "../assets/locales";

import { renderWithTestProviders } from "#/tests.helpers";

i18next.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources,
});

vi.mock("../hooks/useDepositControllers", () => ({
  useDepositControllers: () => ({
    totalAmount: 100,
    mutation: { isPending: false },
    handleDepositDelete: vi.fn(),
  }),
}));

describe("Deposit", () => {
  // // Mock value return by useDepositControllers
  // const mockTotalAmount = 100;

  // // it("renders total amount correctly", () => {
  // //   renderWithTestProviders(<Deposit />);

  // //   expect(screen.getByText(`$${mockTotalAmount}`)).toBeInTheDocument();
  // // });

  it("renders title and balance link", () => {
    const { getByText } = renderWithTestProviders(
      <I18nextProvider i18n={i18next}>
        <Deposit />
      </I18nextProvider>,
    );
    expect(getByText("Total deposits")).toBeInTheDocument();
    expect(getByText("View balance")).toBeInTheDocument();
  });
});
