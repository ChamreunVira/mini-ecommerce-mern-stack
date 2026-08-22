export interface PaginationResponse<T> {
    success: true,
    data: T[],
    meta: {
        totalItems: number;
        totalPages: number;
        currentPage: number;
        limit: number;
        hasPrevPage: boolean;
        hasNextPage: boolean;
    }
}