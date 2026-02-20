import { Controller, Post, Body, UseGuards, Get, Param, Patch, Delete, Query } from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { CreateCouponDto, UpdateCouponDto, ValidateCouponDto } from './dto/coupon.dto';

@Controller('coupons')
export class CouponsController {
    constructor(private readonly couponsService: CouponsService) { }

    @Post('validate')
    @UseGuards(JwtAuthGuard)
    async validate(@Body() dto: ValidateCouponDto, @CurrentUser() user: any) {
        return this.couponsService.validateCoupon(dto.code, user._id, dto.tourId, dto.orderAmount);
    }
}

@Controller('admin/coupons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminCouponsController {
    constructor(private readonly couponsService: CouponsService) { }

    @Post()
    async create(@Body() dto: CreateCouponDto) {
        return this.couponsService.create(dto);
    }

    @Get()
    async findAll(@Query() query: any) {
        return this.couponsService.findAll(query);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.couponsService.findOne(id);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateCouponDto) {
        return this.couponsService.update(id, dto);
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        await this.couponsService.remove(id);
        return { message: 'Coupon deleted successfully' };
    }

    @Get(':id/usage')
    async getUsage(@Param('id') id: string, @Query() query: any) {
        return this.couponsService.getCouponUsage(id, query);
    }
}
