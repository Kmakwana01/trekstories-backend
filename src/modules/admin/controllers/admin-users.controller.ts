import { Controller, Get, Post, Patch, Param, Body, Query, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../../common/guards/roles.guard';
import { Roles } from '../../../common/decorators/roles.decorator';
import { Role } from '../../../common/enums/roles.enum';
import { AdminCrmService } from '../services/admin-crm.service';
import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { UserDocument } from '../../../database/schemas/user.schema';
import { PaginationQuery } from '../../../common/helpers/pagination.helper';


@Controller('admin/users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
export class AdminUsersController {
    constructor(private crmService: AdminCrmService) { }

    @Get()
    async getAllUsers(
        @Query() pagination: PaginationQuery,
        @Query('search') search: string,
        @Query('isVerified') isVerified: string,
        @Query('isBlocked') isBlocked: string,
    ) {
        return this.crmService.getAllUsers({ search, isVerified, isBlocked }, pagination);
    }

    @Get(':id')
    async getUserById(@Param('id') id: string) {
        return this.crmService.getUserById(id);
    }

    @Patch(':id/block')
    async blockUser(
        @Param('id') id: string,
        @Body('reason') reason: string,
        @CurrentUser() admin: UserDocument,
        @Req() req: any,
    ) {
        return this.crmService.blockUser(id, admin._id.toString(), reason, req.ip);
    }

    @Patch(':id/unblock')
    async unblockUser(
        @Param('id') id: string,
        @CurrentUser() admin: UserDocument,
        @Req() req: any,
    ) {
        return this.crmService.unblockUser(id, admin._id.toString(), req.ip);
    }

    @Post(':id/notes')
    async addUserNote(@Param('id') id: string, @Body('note') note: string) {
        return this.crmService.addUserNote(id, note);
    }
}
