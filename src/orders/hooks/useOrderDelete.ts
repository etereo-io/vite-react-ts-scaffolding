import { useQuery } from "@tanstack/react-query";

import { QUERY_KEY_ORDERS } from "../orders.constants";
import { fetchOrders } from "../orders.services";

export function useOrders() {
  return useQuery({
    queryKey: [QUERY_KEY_ORDERS],
    queryFn: fetchOrders,
  });
}
