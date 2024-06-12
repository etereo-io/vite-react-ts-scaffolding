import { I18nextProvider, initReactI18next } from "react-i18next";

import { waitFor } from "@testing-library/react";
import i18next from "i18next";
import { http, HttpResponse } from "msw";

import { server } from "@/mock-server/node";

import { Deposit } from "./Deposit";
import { DepositsMother } from "../__mocks__/DepositsMother";
import resources from "../assets/locales";

import { renderWithTestProviders } from "#/tests.helpers";

i18next.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources,
});

describe("Deposit", () => {
  const deposits = DepositsMother.getRandomList();
  const mockTotalAmount = deposits.reduce((total, deposit) => total + parseFloat(deposit.amount), 0);

  beforeEach(() => {
    //server mock return data
    server.use(
      http.get("/api/deposits", () =>
        HttpResponse.json({
          data: deposits,
        }),
      ),
    );
  });

  it("renders total amount correctly", async () => {
    const { getByText } = renderWithTestProviders(
      <I18nextProvider i18n={i18next}>
        <Deposit />
      </I18nextProvider>,
    );

    await waitFor(() => expect(getByText(`$${mockTotalAmount.toFixed(2)}`)).toBeInTheDocument());
  });

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
