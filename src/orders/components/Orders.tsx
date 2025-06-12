import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AllowedAuth } from "@/auth/components/AllowedAuth";
import { Title } from "@/shared/components/Title";

import { useOrdersController } from "../hooks/useOrdersController";
import { OrderStatus } from "../orders.types";

export function Orders() {
  const { t } = useTranslation();
  const {
    orders,
    canDelete,
    status,
    page,
    handleOrderStatusChange,
    handleOnPaginationChange,
    handleOrderDelete,
    handleSeeMoreOrders
  } = useOrdersController();

  return (
    <>
      <Title>
        <div className="flex justify-between items-center">
          {t("orders.recent")}
          <select
            value={status ?? ""}
            onChange={(e) =>
              handleOrderStatusChange(e as React.ChangeEvent<HTMLSelectElement>)
            }
            className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">{t("shared.all")}</option>
            {Object.values(OrderStatus).map((status) => (
              <option key={status} value={status}>
                {status.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </Title>

      <div className="overflow-x-auto">
        <table
          className="min-w-full divide-y divide-gray-200"
          data-testid="orders-table"
        >
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ship To
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Payment Method
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sale Amount
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {orders?.data.map((order) => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.date}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.shipTo}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.paymentMethod}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {order.status}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-right">
                  ${order.amount}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <AllowedAuth permissions={canDelete}>
                    <button
                      onClick={handleOrderDelete(order.id)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      aria-label="delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </AllowedAuth>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Simple pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-700">
          Page {page} of {orders?.pagination.count || 0}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() =>
              handleOnPaginationChange(null, Math.max(1, page - 1))
            }
            disabled={page <= 1}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Previous
          </button>
          <button
            onClick={() => handleOnPaginationChange(null, page + 1)}
            disabled={page >= (orders?.pagination.count || 0)}
            className="px-3 py-1 text-sm border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
          >
            Next
          </button>
        </div>
      </div>

      <a
        href="#"
        onClick={handleSeeMoreOrders}
        className="inline-block mt-4 text-blue-600 hover:text-blue-800 text-sm transition-colors"
      >
        See more orders
      </a>
    </>
  );
}
