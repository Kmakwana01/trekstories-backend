import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { Role } from '../../common/enums/roles.enum';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SavedTravelerDto } from './dto/saved-traveler.dto';
import { PaginationQuery } from '../../common/helpers/pagination.helper';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.CUSTOMER, Role.ADMIN) // Both can access profile, though usually CUSTOMER for these specific ones
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    async getProfile(@CurrentUser() user) {
        return this.usersService.getProfile(user._id);
    }

    @Patch('profile')
    async updateProfile(
        @CurrentUser() user,
        @Body() updateProfileDto: UpdateProfileDto,
    ) {
        return this.usersService.updateProfile(user._id, updateProfileDto);
    }

    @Patch('change-password')
    async changePassword(
        @CurrentUser() user,
        @Body() changePasswordDto: ChangePasswordDto,
    ) {
        return this.usersService.changePassword(user._id, changePasswordDto);
    }

    @Get('travelers')
    async getTravelers(@CurrentUser() user) {
        return this.usersService.getSavedTravelers(user._id);
    }

    @Post('travelers')
    async addTraveler(
        @CurrentUser() user,
        @Body() travelerDto: SavedTravelerDto,
    ) {
        return this.usersService.addSavedTraveler(user._id, travelerDto);
    }

    @Delete('travelers/:id')
    async removeTraveler(@CurrentUser() user, @Param('id') id: string) {
        return this.usersService.removeSavedTraveler(user._id, id);
    }

    @Get('my-bookings')
    async getMyBookings(
        @CurrentUser() user,
        @Query() paginationQuery: PaginationQuery,
    ) {
        return this.usersService.getMyBookings(user._id, paginationQuery);
    }

    @Get('my-reviews')
    async getMyReviews(
        @CurrentUser() user,
        @Query() paginationQuery: PaginationQuery,
    ) {
        return this.usersService.getMyReviews(user._id, paginationQuery);
    }
}
