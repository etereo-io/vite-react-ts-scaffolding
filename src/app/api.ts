export function getEndpoint() {
  return import.meta.env.VITE_APP_ENDPOINT || "/api/";
}

export interface ApiListResponse<T> {
  data: T;
}

export interface PaginatedParams {
  offset?: number;
  limit?: number;
}

export interface Pagination {
  offset: number;
  limit: number;
  count: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> extends ApiListResponse<T> {
  pagination: Pagination;
}

export const API_DEFAULT_LIMIT = 20;
