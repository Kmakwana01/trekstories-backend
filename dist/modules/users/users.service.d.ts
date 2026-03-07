import { Model } from 'mongoose';
import { UserDocument } from '../../database/schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SavedTravelerDto } from './dto/saved-traveler.dto';
import { PaginationQuery } from '../../common/helpers/pagination.helper';
export declare class UsersService {
    private userModel;
    private bookingModel;
    private reviewModel;
    private notificationModel;
    constructor(userModel: Model<UserDocument>, bookingModel: Model<any>, reviewModel: Model<any>, notificationModel: Model<any>);
    getProfile(userId: string): Promise<any>;
    updateProfile(userId: string, updateProfileDto: UpdateProfileDto): Promise<any>;
    changePassword(userId: string, changePasswordDto: ChangePasswordDto): Promise<{
        message: string;
    }>;
    getSavedTravelers(userId: string): Promise<{
        fullName: string;
        age: number;
        gender: string;
        idNumber: string;
    }[]>;
    addSavedTraveler(userId: string, travelerDto: SavedTravelerDto): Promise<{
        fullName: string;
        age: number;
        gender: string;
        idNumber: string;
    }[]>;
    removeSavedTraveler(userId: string, travelerId: string): Promise<{
        fullName: string;
        age: number;
        gender: string;
        idNumber: string;
    }[]>;
    getMyBookings(userId: string, paginationQuery: PaginationQuery): Promise<import("../../common/helpers/pagination.helper").PaginationResult<unknown>>;
    getDashboardSummary(userId: string): Promise<{
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
    private sanitizeUser;
}
