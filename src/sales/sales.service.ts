import axios from "axios";

import { API_DEFAULT_LIMIT, PaginatedResponse, getEndpoint } from "@/app/api";
import { getQueryString } from "@/lib/queryparams/queryparams.helpers";

import { NewSaleFormValues } from "./components/forms/NewSaleForm/types";
import { DEFAULT_SALES_FILTERS } from "./sales.constants";
import { Sale, SalesFilters } from "./sales.types";

/**
 * Creates a new sale by sending a POST request to the sales endpoint.
 *
 * @param {NewSaleFormValues} sale - The sale data to be created.
 * @returns {Promise<Sale>} - A promise that resolves to the created sale.
 */
export function createSale(sale: NewSaleFormValues) {
  return axios.post<Sale>(getEndpoint() + `sales`, sale);
}

/**
 * Fetches sales data from the sales endpoint with optional filters.
 *
 * @param {SalesFilters} filters - The filters to apply to the sales data.
 * @returns {Promise<PaginatedResponse<Sale[]>>} - A promise that resolves to the paginated response containing sales data.
 */
export function fetchSales(
  filters: SalesFilters = {
    offset: 0,
    limit: API_DEFAULT_LIMIT,
  },
) {
  const finalParams = Object.assign({}, DEFAULT_SALES_FILTERS, filters) as unknown as Record<string, unknown>;
  return axios
    .get<PaginatedResponse<Sale[]>>(getEndpoint() + "sales?" + getQueryString(finalParams))
    .then((res) => res.data);
}
