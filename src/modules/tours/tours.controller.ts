import { Controller, Get, Param, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { ToursService } from './tours.service';
import { TourFiltersDto } from './dto/tour-filters.dto';
import { PaginationQuery } from '../../common/helpers/pagination.helper';

@Controller('tours')
export class ToursController {
    constructor(private readonly toursService: ToursService) { }

    @Get()
    @UsePipes(new ValidationPipe({ transform: true }))
    async getAllTours(@Query() filters: TourFiltersDto) {
        return this.toursService.getAllTours(filters);
    }

    @Get('filter-options')
    async getFilterOptions() {
        return this.toursService.getFilterOptions();
    }

    @Get('state/:state')
    async getByState(
        @Param('state') state: string,
        @Query() pagination: PaginationQuery
    ) {
        return this.toursService.getByState(state, pagination);
    }

    @Get(':slug')
    async getTourBySlug(@Param('slug') slug: string) {
        return this.toursService.getTourBySlug(slug);
    }

    @Get(':id/dates')
    async getTourDates(@Param('id') id: string) {
        return this.toursService.getTourDates(id);
    }

}
