import { apiClient } from "@/app/features/api/api";
import { API_DEFAULT_LIMIT } from "@/app/features/api/api.constants";
import type { PaginatedResponse } from "@/app/features/api/api.types";
import { getQueryString } from "@/lib/queryparams/queryparams.helpers";

import { DEFAULT_ORDERS_FILTERS } from "./orders.constants";
import type { Order, OrdersFilters } from "./orders.types";

function fetchOrders(
  filters: OrdersFilters = {
    offset: 0,
    limit: API_DEFAULT_LIMIT
  }
) {
  const finalParams = Object.assign(
    {},
    DEFAULT_ORDERS_FILTERS,
    filters
  ) as unknown as Record<string, unknown>;

  return apiClient
    .get<PaginatedResponse<Order[]>>(`v1/orders?${getQueryString(finalParams)}`)
    .then((res) => res.data);
}

function deleteOrder(orderId: string) {
  return apiClient.delete(`v1/orders/${orderId}`);
}

export const ordersService = {
  fetchOrders,
  deleteOrder
};
