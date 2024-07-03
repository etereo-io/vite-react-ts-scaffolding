import { useQuery } from "@tanstack/react-query";

import { API_DEFAULT_LIMIT } from "@/app/api";

import { QUERY_KEY_SALES } from "../sales.constants";
import { fetchSales } from "../sales.service";
import { SalesFilters } from "../sales.types";

export function useSales(filters: SalesFilters = { offset: 0, limit: API_DEFAULT_LIMIT }) {
  return useQuery({
    queryKey: [QUERY_KEY_SALES, JSON.stringify(filters)],
    queryFn: () => fetchSales(filters),
    meta: {
      errorMessage: "sales.fetch.error",
    },
  });
}
