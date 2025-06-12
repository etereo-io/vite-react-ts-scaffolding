import { SelectChangeEvent } from "@mui/material";
import { useCallback, useState } from "react";

import { API_DEFAULT_LIMIT } from "@/app/api";
import { useQueryParamState } from "@/lib/queryparams/hooks/useQueryParamState";

import { useOrderDelete } from "../hooks/useOrderDelete";
import { useOrders } from "../hooks/useOrders";
import { QUERY_PARAM_ORDERS_STATUS } from "../orders.constants";
import { OrderStatus } from "../orders.types";
import { useOrdersPermissions } from "./useOrdersPermissions";

export function useOrdersController() {
  const [offset, setOffset] = useState(0);

  const { canDelete } = useOrdersPermissions();

  const { value: status, setValue: setStatus } =
    useQueryParamState<OrderStatus | null>(QUERY_PARAM_ORDERS_STATUS);

  const { data: orders, isFetching } = useOrders({
    offset,
    status: status ?? undefined,
  });
  const mutation = useOrderDelete();

  const handleOnPaginationChange = (_: unknown, page: number) => {
    setOffset((page - 1) * API_DEFAULT_LIMIT);
  };

  const handleOrderStatusChange = useCallback(
    (event: SelectChangeEvent<OrderStatus>) => {
      setStatus(event.target.value as OrderStatus);
      setOffset(0);
    },
    [setStatus],
  );

  const handleOrderDelete = useCallback(
    (orderId: string) => () => mutation.mutate(orderId),
    [mutation],
  );

  const handleSeeMoreOrders = (event: React.MouseEvent) => {
    event.preventDefault();
  };

  const page = isFetching
    ? 0
    : Math.floor((offset ?? 0) / (orders?.pagination.limit ?? 0)) + 1 || 0;

  return {
    canDelete,
    page,
    orders,
    mutation,
    status,
    handleOrderStatusChange,
    handleOnPaginationChange,
    handleOrderDelete,
    handleSeeMoreOrders,
  };
}
