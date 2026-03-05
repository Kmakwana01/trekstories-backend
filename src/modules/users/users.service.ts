import {
    BadRequestException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { User, UserDocument } from '../../database/schemas/user.schema';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { SavedTravelerDto } from './dto/saved-traveler.dto';
import { paginate, PaginationQuery } from '../../common/helpers/pagination.helper';
import { DateUtil } from '../../utils/date.util';
import { BookingStatus } from '../../common/enums/booking-status.enum';

@Injectable()
export class UsersService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel('Booking') private bookingModel: Model<any>,
        @InjectModel('Review') private reviewModel: Model<any>,
        @InjectModel('Notification') private notificationModel: Model<any>,
    ) { }

    async getProfile(userId: string) {
        const user = await this.userModel.findById(userId);
        if (!user)
        {
            throw new NotFoundException('User not found');
        }
        return this.sanitizeUser(user);
    }

    async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { $set: updateProfileDto },
            { returnDocument: 'after', runValidators: true } as any,
        );

        if (!user)
        {
            throw new NotFoundException('User not found');
        }

        return this.sanitizeUser(user);
    }

    async changePassword(userId: string, changePasswordDto: ChangePasswordDto) {
        const { oldPassword, newPassword } = changePasswordDto;
        const user = await this.userModel.findById(userId);

        if (!user)
        {
            throw new NotFoundException('User not found');
        }

        const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isMatch)
        {
            throw new BadRequestException('Invalid old password');
        }

        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();

        return { message: 'Password changed successfully' };
    }

    async getSavedTravelers(userId: string) {
        const user = await this.userModel.findById(userId).select('savedTravelers');
        if (!user)
        {
            throw new NotFoundException('User not found');
        }
        return user.savedTravelers;
    }

    async addSavedTraveler(userId: string, travelerDto: SavedTravelerDto) {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { $push: { savedTravelers: travelerDto } },
            { returnDocument: 'after' } as any,
        );

        if (!user)
        {
            throw new NotFoundException('User not found');
        }

        return user.savedTravelers;
    }

    async removeSavedTraveler(userId: string, travelerId: string) {
        const user = await this.userModel.findByIdAndUpdate(
            userId,
            { $pull: { savedTravelers: { _id: travelerId } } },
            { returnDocument: 'after' } as any,
        );

        if (!user)
        {
            throw new NotFoundException('User not found');
        }

        return user.savedTravelers;
    }

    async getMyBookings(userId: string, paginationQuery: PaginationQuery) {
        return paginate(
            this.bookingModel,
            { user: new Types.ObjectId(userId) },
            paginationQuery,
        );
    }

    async getDashboardSummary(userId: string) {
        const uid = new Types.ObjectId(userId);

        // 1. Get user for wishlist count
        const user = await this.userModel.findById(userId).select('wishlist').lean();
        const wishlistCount = user?.wishlist?.length || 0;

        // 2. Fetch parallel data
        const [
            allBookings,
            recentNotifications,
            reviewsCount
        ] = await Promise.all([
            // Get all user bookings
            this.bookingModel.find({ user: uid })
                .populate('tour', 'title slug thumbnailImage location images')
                .populate('tourDate', 'startDate endDate date')
                .sort({ createdAt: -1 })
                .lean(),

            // Get 5 recent notifications
            this.notificationModel.find({ user: uid })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),

            // Get total reviews count
            this.reviewModel.countDocuments({ user: uid })
        ]);

        // Process bookings
        const totalBookingsCount = allBookings.length;
        const completedTripsCount = allBookings.filter(b => (b as any).status === BookingStatus.COMPLETED).length;

        // recent bookings (max 5)
        const recentBookings = allBookings.slice(0, 5);

        // Upcoming booking (soonest upcoming confirmed/pending)
        const now = DateUtil.nowUTC();
        const upcomingBookings = allBookings.filter(b => {
            const stat = (b as any).status;
            const d = (b as any).tourDate;
            const dateToCompare = d?.startDate || d?.date || (b as any).createdAt;
            return (stat === BookingStatus.CONFIRMED || stat === BookingStatus.PENDING) && DateUtil.startOfDayIST(dateToCompare) >= DateUtil.startOfDayIST(now);
        }).sort((a, b: any) => {
            const dA = (a as any).tourDate;
            const dB = (b as any).tourDate;
            const dateA = new Date(dA?.startDate || dA?.date || (a as any).createdAt).getTime();
            const dateB = new Date(dB?.startDate || dB?.date || (b as any).createdAt).getTime();
            return dateA - dateB;
        });

        const upcomingBooking = upcomingBookings.length > 0 ? upcomingBookings[0] : (recentBookings.length > 0 ? recentBookings[0] : null);

        return {
            upcomingBooking,
            recentBookings,
            recentNotifications,
            stats: {
                totalBookingsCount,
                completedTripsCount,
                reviewsCount,
                wishlistCount
            }
        };
    }

    private sanitizeUser(user: UserDocument) {
        const obj = user.toObject();
        delete obj.passwordHash;
        delete obj.refreshTokenHash;
        delete obj.otp;
        delete obj.otpExpiry;
        delete obj.resetToken;
        delete obj.resetTokenExpiry;
        return obj;
    }
}
