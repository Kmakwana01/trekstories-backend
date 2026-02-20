import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/roles.enum';
import { AdminLogService } from '../services/admin-log.service';
import { PaginationQuery } from '../../../common/helpers/pagination.helper';

@Controller('admin/logs')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminLogsController {
    constructor(private adminLogService: AdminLogService) { }

    @Get()
    async getAdminLogs(
        @Query() pagination: PaginationQuery,
        @Query('admin') admin: string,
        @Query('module') module: string,
        @Query('action') action: string,
        @Query('dateFrom') dateFrom: string,
        @Query('dateTo') dateTo: string,
    ) {
        return this.adminLogService.getAdminLogs(
            { admin, module, action, dateFrom, dateTo },
            pagination,
        );
    }
}
