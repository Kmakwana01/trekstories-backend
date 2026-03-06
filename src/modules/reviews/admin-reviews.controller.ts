import { Controller, Get, Patch, Delete, Param, Body, UseGuards, Query, Req } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { FilterReviewDto } from './dto/filter-review.dto';
import { RejectReviewDto } from './dto/reject-review.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { AdminLogService } from '../admin/services/admin-log.service';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@Controller('admin/reviews')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminReviewsController {
    constructor(
        private readonly reviewsService: ReviewsService,
        private readonly adminLogService: AdminLogService,
    ) { }

    @Get()
    findAll(@Query() filterReviewDto: FilterReviewDto) {
        return this.reviewsService.findAllAdmin(filterReviewDto);
    }

    @Patch(':id/approve')
    async approve(
        @Param('id') id: string,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        const review = await this.reviewsService.approve(id);
        await this.adminLogService.logAction(adminId, 'APPROVE_REVIEW', 'Reviews', id, {}, req.ip, req.headers['user-agent']);
        return review;
    }

    @Patch(':id/reject')
    async reject(
        @Param('id') id: string,
        @Body() rejectReviewDto: RejectReviewDto,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        const review = await this.reviewsService.reject(id, rejectReviewDto.reason);
        await this.adminLogService.logAction(adminId, 'REJECT_REVIEW', 'Reviews', id, { reason: rejectReviewDto.reason }, req.ip, req.headers['user-agent']);
        return review;
    }

    @Delete(':id')
    async remove(
        @Param('id') id: string,
        @CurrentUser('_id') adminId: string,
        @Req() req: any,
    ) {
        await this.reviewsService.delete(id);
        await this.adminLogService.logAction(adminId, 'DELETE_REVIEW', 'Reviews', id, {}, req.ip, req.headers['user-agent']);
        return { message: 'Review deleted successfully' };
    }
}
