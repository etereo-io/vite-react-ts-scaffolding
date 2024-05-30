import { useQuery } from "@tanstack/react-query";

import { API_DEFAULT_LIMIT } from "@/app/api";

import { QUERY_KEY_ORDERS } from "../orders.constants";
import { fetchOrders } from "../orders.services";

export function useOrders(offset?: number, limit = API_DEFAULT_LIMIT) {
  return useQuery({
    queryKey: [QUERY_KEY_ORDERS, offset, limit],
    queryFn: () => fetchOrders(offset, limit),
    // ensure query has error handling
    meta: {
      errorMessage: "orders.fetch.error",
    },
  });
}
