import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Query } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { FilterReviewDto } from './dto/filter-review.dto';
import { RejectReviewDto } from './dto/reject-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';

@Controller('admin/reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminReviewsController {
    constructor(private readonly reviewsService: ReviewsService) { }

    @Get()
    findAll(@Query() filterReviewDto: FilterReviewDto) {
        return this.reviewsService.findAllAdmin(filterReviewDto);
    }

    @Patch(':id/approve')
    approve(@Param('id') id: string) {
        return this.reviewsService.approve(id);
    }

    @Patch(':id/reject')
    reject(@Param('id') id: string, @Body() rejectReviewDto: RejectReviewDto) {
        return this.reviewsService.reject(id, rejectReviewDto.reason);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.reviewsService.delete(id);
    }
}
