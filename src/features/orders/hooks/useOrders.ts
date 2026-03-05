import { useQuery } from "@tanstack/react-query";

import { API_DEFAULT_LIMIT } from "@/app/features/api/api.constants";

import { orderKeys } from "../orders.constants";
import { ordersService } from "../orders.services";
import type { OrdersFilters } from "../orders.types";

export function useOrders(
  filters: OrdersFilters = { offset: 0, limit: API_DEFAULT_LIMIT }
) {
  return useQuery({
    queryKey: orderKeys.list(filters as Record<string, unknown>),
    queryFn: () => ordersService.fetchOrders(filters),
    // ensure query has error handling
    meta: {
      errorMessage: "orders.fetch.error"
    }
  });
}
