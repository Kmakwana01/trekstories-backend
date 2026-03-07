export declare class PaginationQuery {
    page?: number;
    limit?: number;
    sort?: string;
    order?: 'asc' | 'desc';
    search?: string;
}
export interface PaginationResult<T> {
    items: T[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
}
export declare const paginate: <T>(model: any, filter?: any, options?: PaginationQuery, populate?: string[]) => Promise<PaginationResult<T>>;
