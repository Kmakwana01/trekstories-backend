import {
  Controller,
  Post,
  Body,
  UseGuards,
  Get,
  Param,
  Patch,
  Delete,
  Query,
  Req,
} from '@nestjs/common';
import { CouponsService } from './coupons.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import {
  CreateCouponDto,
  UpdateCouponDto,
  ValidateCouponDto,
} from './dto/coupon.dto';
import { AdminLogService } from '../admin/services/admin-log.service';
import { PaginationQuery } from '../../common/helpers/pagination.helper';

@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @Post('validate')
  @UseGuards(JwtAuthGuard)
  async validate(@Body() dto: ValidateCouponDto, @CurrentUser() user: any) {
    return this.couponsService.validateCoupon(
      dto.code,
      user._id,
      dto.tourId,
      dto.orderAmount,
    );
  }
}

@Controller('admin/coupons')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminCouponsController {
  constructor(
    private readonly couponsService: CouponsService,
    private readonly adminLogService: AdminLogService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateCouponDto,
    @CurrentUser('_id') adminId: string,
    @Req() req: any,
  ) {
    const coupon = await this.couponsService.create(dto);
    await this.adminLogService.logAction(
      adminId,
      'CREATE_COUPON',
      'Coupons',
      (coupon as any)._id?.toString(),
      { code: dto.code },
      req.ip,
      req.headers['user-agent'],
    );
    return coupon;
  }

  @Get()
  async findAll(@Query() query: PaginationQuery) {
    const { page, limit, sort, order, search, ...filters } = query;
    return this.couponsService.findAll(filters, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.couponsService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCouponDto,
    @CurrentUser('_id') adminId: string,
    @Req() req: any,
  ) {
    const coupon = await this.couponsService.update(id, dto);
    await this.adminLogService.logAction(
      adminId,
      'UPDATE_COUPON',
      'Coupons',
      id,
      { fields: Object.keys(dto) },
      req.ip,
      req.headers['user-agent'],
    );
    return coupon;
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
    @CurrentUser('_id') adminId: string,
    @Req() req: any,
  ) {
    await this.couponsService.remove(id);
    await this.adminLogService.logAction(
      adminId,
      'DELETE_COUPON',
      'Coupons',
      id,
      {},
      req.ip,
      req.headers['user-agent'],
    );
    return { message: 'Coupon deleted successfully' };
  }

  @Get(':id/usage')
  async getUsage(@Param('id') id: string, @Query() query: any) {
    return this.couponsService.getCouponUsage(id, query);
  }
}
