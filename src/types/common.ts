export interface PaginationParams {
  limit?: number;
  page_token?: string;
}

export interface Pagination {
  next_page_token?: string;
  next_page_url?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: Pagination;
}

export interface HuntressClientConfig {
  apiKey: string;
  apiSecret: string;
  baseUrl?: string;
  maxRetries?: number;
  rateLimitPerMinute?: number;
}
