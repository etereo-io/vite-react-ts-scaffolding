import { useCallback, useState } from "react";

import { API_DEFAULT_LIMIT } from "@/app/api";

import { useOrderDelete } from "../hooks/useOrderDelete";
import { useOrders } from "../hooks/useOrders";

export function useOrdersController() {
  const [offset, setOffset] = useState(0);

  const handleOnPaginationChange = (_: unknown, page: number) => {
    setOffset((page - 1) * API_DEFAULT_LIMIT);
  };

  const { data: orders, isFetching } = useOrders(offset);
  const mutation = useOrderDelete();

  const handleOrderDelete = useCallback((orderId: string) => () => mutation.mutate(orderId), [mutation]);

  const handleSeeMoreOrders = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const page = isFetching ? 0 : Math.floor((offset ?? 0) / (orders?.pagination.limit ?? 0)) + 1 || 0;

  return {
    page,
    orders,
    mutation,
    handleOnPaginationChange,
    handleOrderDelete,
    handleSeeMoreOrders,
  };
}
