import { Trans } from "react-i18next";

import { AllowedAuth } from "@/auth/components/AllowedAuth";

import { Orders } from "../components/Orders";
import { PERMISSION_ORDERS_LIST } from "../orders.constants";

export function OrdersPage() {
  return (
    <div className="col-span-1 md:col-span-3">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 flex flex-col">
        <AllowedAuth
          permissions={PERMISSION_ORDERS_LIST}
          error={<Trans i18nKey="shared.error.page.permissions" />}
        >
          <Orders />
        </AllowedAuth>
      </div>
    </div>
  );
}
