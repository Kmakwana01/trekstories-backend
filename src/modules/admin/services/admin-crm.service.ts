import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../../database/schemas/user.schema';
import { Booking, BookingDocument } from '../../../database/schemas/booking.schema';
import { paginate } from '../../../common/helpers/pagination.helper';
import { AdminLogService } from './admin-log.service';
import { Role } from '../../../common/enums/roles.enum';
import { BookingStatus } from '../../../common/enums/booking-status.enum';

@Injectable()
export class AdminCrmService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
        private adminLogService: AdminLogService,
    ) { }

    async getAllUsers(filters: any, paginationQuery: any) {
        const query: any = { role: Role.CUSTOMER };
        if (filters.isVerified !== undefined) query.isVerified = filters.isVerified === 'true';
        if (filters.isBlocked !== undefined) query.isBlocked = filters.isBlocked === 'true';
        if (filters.search)
        {
            query.$or = [
                { name: new RegExp(filters.search, 'i') },
                { email: new RegExp(filters.search, 'i') },
                { phone: new RegExp(filters.search, 'i') },
            ];
        }

        return paginate(this.userModel, query, paginationQuery);
    }

    async getUserById(id: string) {
        const user: any = await this.userModel.findById(id).select('-passwordHash -otp -otpExpiry').lean().exec();
        if (!user) throw new NotFoundException('User not found');

        const bookings = await this.bookingModel.find({ user: new Types.ObjectId(id) as any }).sort({ createdAt: -1 }).lean().exec();

        const bookingCount = bookings.filter(b => b.status === BookingStatus.CONFIRMED).length;
        const totalSpent = bookings
            .filter(b => b.status === BookingStatus.CONFIRMED)
            .reduce((sum, b) => sum + (b.paidAmount || 0), 0);

        // Populate Address fallback
        user.address = user.contactAddress ? { street: user.contactAddress, city: user.country || 'Unknown', country: user.country || 'Unknown' } : null;
        user.bookings = bookings;

        // Populate internal notes fallback
        if (!user.adminNotes && user.internalNotes)
        {
            user.adminNotes = [{ note: user.internalNotes, createdAt: user.updatedAt }];
        }

        return {
            user,
            stats: {
                bookingCount,
                totalSpent,
            },
        };
    }

    async blockUser(id: string, adminId: string, reason: string, ip: string, userAgent?: string) {
        const user = await this.userModel.findByIdAndUpdate(
            id,
            { isBlocked: true },
            { returnDocument: 'after' },
        ).exec();
        if (!user) throw new NotFoundException('User not found');

        await this.adminLogService.logAction(
            adminId,
            'BLOCK_USER',
            'users',
            id,
            { reason },
            ip,
            userAgent,
        );
        return user;
    }

    async unblockUser(id: string, adminId: string, ip: string, userAgent?: string) {
        const user = await this.userModel.findByIdAndUpdate(
            id,
            { isBlocked: false },
            { returnDocument: 'after' },
        ).exec();
        if (!user) throw new NotFoundException('User not found');

        await this.adminLogService.logAction(
            adminId,
            'UNBLOCK_USER',
            'users',
            id,
            null,
            ip,
            userAgent,
        );
        return user;
    }

    async addUserNote(id: string, note: string) {
        const user = await this.userModel.findByIdAndUpdate(
            id,
            { $set: { internalNotes: note } }, // Assuming we add internalNotes to user schema if needed, or use a separate field
            { returnDocument: 'after' },
        ).exec();
        if (!user) throw new NotFoundException('User not found');
        return user;
    }
}
