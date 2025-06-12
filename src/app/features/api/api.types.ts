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
