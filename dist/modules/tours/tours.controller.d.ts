import { ToursService } from './tours.service';
import { TourFiltersDto } from './dto/tour-filters.dto';
import { PaginationQuery } from '../../common/helpers/pagination.helper';
export declare class ToursController {
    private readonly toursService;
    constructor(toursService: ToursService);
    getAllTours(filters: TourFiltersDto): Promise<import("../../common/helpers/pagination.helper").PaginationResult<import("../../database/schemas/tour.schema").TourDocument>>;
    getFilterOptions(): Promise<{
        states: string[];
        categories: string[];
        departureCities: string[];
    }>;
    getByState(state: string, pagination: PaginationQuery): Promise<import("../../common/helpers/pagination.helper").PaginationResult<unknown>>;
    getTourBySlug(slug: string): Promise<any>;
    getTourDates(id: string): Promise<import("../../database/schemas/tour-date.schema").TourDateDocument[]>;
}
