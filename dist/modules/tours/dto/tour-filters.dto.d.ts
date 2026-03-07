import { PaginationQuery } from '../../../common/helpers/pagination.helper';
export declare class TourFiltersDto extends PaginationQuery {
    location?: string;
    state?: string | string[];
    category?: string | string[];
    priceMin?: number;
    priceMax?: number;
    durationDays?: number;
    minDuration?: number;
    maxDuration?: number;
    departureCity?: string;
}
