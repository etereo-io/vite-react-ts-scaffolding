import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";

import { AllowedAuth } from "@/app/features/auth/components/AllowedAuth";
import { formatDateValue } from "@/lib/date";
import { formatCurrency } from "@/lib/format";
import { Title } from "@/shared/components/Title";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/shared/components/ui/table";

import { useOrdersController } from "../hooks/useOrdersController";
import { OrderStatus } from "../orders.types";

function getStatusVariant(status: OrderStatus) {
  switch (status) {
    case OrderStatus.PENDING:
      return "secondary";
    case OrderStatus.CLOSED:
      return "default";
    default:
      return "outline";
  }
}

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
            {Object.values(OrderStatus).map((statusValue) => (
              <option key={statusValue} value={statusValue}>
                {statusValue.toUpperCase()}
              </option>
            ))}
          </select>
        </div>
      </Title>

      <Table data-testid="orders-table">
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Ship To</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Sale Amount</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.data.map((order) => (
            <TableRow key={order.id}>
              <TableCell>{formatDateValue(order.date)}</TableCell>
              <TableCell>{order.name}</TableCell>
              <TableCell>{order.shipTo}</TableCell>
              <TableCell>{order.paymentMethod}</TableCell>
              <TableCell>
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status.toUpperCase()}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(order.amount)}
              </TableCell>
              <TableCell className="text-right">
                <AllowedAuth permissions={canDelete}>
                  <Button
                    variant="ghost"
                    size="icon-xs"
                    onClick={handleOrderDelete(order.id)}
                    aria-label="delete"
                    className="text-red-600 hover:text-red-800 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </AllowedAuth>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Simple pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-700">
          Page {page} of {orders?.pagination.count || 0}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              handleOnPaginationChange(null, Math.max(1, page - 1))
            }
            disabled={page <= 1}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleOnPaginationChange(null, page + 1)}
            disabled={page >= (orders?.pagination.count || 0)}
          >
            Next
          </Button>
        </div>
      </div>

      <Button
        variant="link"
        size="sm"
        onClick={handleSeeMoreOrders}
        className="mt-4"
      >
        See more orders
      </Button>
    </>
  );
}
