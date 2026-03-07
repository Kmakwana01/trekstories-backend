import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SavedTravelerDto } from './dto/saved-traveler.dto';
import { PaginationQuery } from '../../common/helpers/pagination.helper';
import { ImgbbService } from '../../common/services/imgbb.service';
export declare class UsersController {
    private usersService;
    private imgbbService;
    constructor(usersService: UsersService, imgbbService: ImgbbService);
    getProfile(user: any): Promise<any>;
    updateProfile(user: any, updateProfileDto: UpdateProfileDto, file?: Express.Multer.File): Promise<any>;
    changePassword(user: any, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getTravelers(user: any): Promise<{
        fullName: string;
        age: number;
        gender: string;
        idNumber: string;
    }[]>;
    addTraveler(user: any, travelerDto: SavedTravelerDto): Promise<{
        fullName: string;
        age: number;
        gender: string;
        idNumber: string;
    }[]>;
    removeTraveler(user: any, id: string): Promise<{
        fullName: string;
        age: number;
        gender: string;
        idNumber: string;
    }[]>;
    getMyBookings(user: any, paginationQuery: PaginationQuery): Promise<import("../../common/helpers/pagination.helper").PaginationResult<unknown>>;
    getDashboardSummary(user: any): Promise<{
        upcomingBooking: any;
        recentBookings: any[];
        recentNotifications: any[];
        stats: {
            totalBookingsCount: number;
            completedTripsCount: number;
            reviewsCount: number;
            wishlistCount: number;
        };
    }>;
}
