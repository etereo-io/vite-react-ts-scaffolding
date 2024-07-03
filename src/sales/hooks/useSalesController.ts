import { useCallback, useState } from "react";

import { API_DEFAULT_LIMIT } from "@/app/api";

import { useSales } from "./useSales";
import { useSalesCreate } from "./useSalesCreate";
import { NewSaleFormValues } from "../components/forms/NewSaleForm/types";

export function useSalesController() {
  const [offset, setOffset] = useState<number>(0);
  const { data: sales, isFetching } = useSales({ offset });

  const createMutation = useSalesCreate();

  /**
   * Handles the creation of a new sale.
   *
   * @param {NewSaleFormValues} sale - The values of the new sale form.
   * @returns {void} Triggers the mutation to create a new sale.
   */
  const handleCreateNewSale = useCallback((sale: NewSaleFormValues) => createMutation.mutate(sale), [createMutation]);

  /**
   * Handles the change in pagination.
   *
   * @param {unknown} _ - Unused parameter.
   * @param {number} page - The current page number.
   * @returns {void} Updates the offset based on the current page.
   */
  const handleOnPaginationChange = (_: unknown, page: number) => {
    setOffset((page - 1) * API_DEFAULT_LIMIT);
  };

  /**
   * Calculates the current page number.
   *
   * @returns {number} The current page number.
   */
  const page = isFetching ? 0 : Math.floor((offset ?? 0) / (sales?.pagination.limit ?? 0)) + 1 || 0;

  return {
    sales,
    isFetching,
    page,

    createMutation,

    handleCreateNewSale,
    handleOnPaginationChange,
  };
}
