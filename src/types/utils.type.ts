export interface ApiResponseType<T> {
  isSuccess: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface ApiErrorResponseType {
  isSuccess: boolean;
  message: string;
  error: string;
  timestamp: string;
  path?: string;
  statusCode: number;
}

export interface ApiPaginationResponseType<T> {
  isSuccess: boolean;
  message: string;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  timestamp: string;
}
