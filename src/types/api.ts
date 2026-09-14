export interface Page<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PaginationQuery {
  page?: number;
  page_size?: number;
}

export type ISO8601 = string;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public fields: Record<string, string[]> = {}
  ) {
    super(message);
    this.name = "ApiError";
  }
}