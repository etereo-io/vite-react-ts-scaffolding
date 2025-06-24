import { useQuery } from "@tanstack/react-query";

import { API_DEFAULT_LIMIT } from "@/app/features/api/api.contants";

import { QUERY_KEY_ORDERS } from "../orders.constants";
import { ordersService } from "../orders.services";
import type { OrdersFilters } from "../orders.types";

export function useOrders(
  filters: OrdersFilters = { offset: 0, limit: API_DEFAULT_LIMIT }
) {
  return useQuery({
    queryKey: [QUERY_KEY_ORDERS, JSON.stringify(filters)],
    queryFn: () => ordersService.fetchOrders(filters),
    // ensure query has error handling
    meta: {
      errorMessage: "orders.fetch.error"
    }
  });
}
