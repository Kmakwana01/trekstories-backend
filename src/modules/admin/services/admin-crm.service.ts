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
        const user = await this.userModel.findById(id).select('-passwordHash -otp -otpExpiry').exec();
        if (!user) throw new NotFoundException('User not found');

        const [bookingCount, totalSpent] = await Promise.all([
            this.bookingModel.countDocuments({ user: id as any, status: BookingStatus.CONFIRMED }),
            this.bookingModel.aggregate([
                { $match: { user: new Types.ObjectId(id), status: BookingStatus.CONFIRMED } },
                { $group: { _id: null, total: { $sum: '$paidAmount' } } },
            ]),
        ]);

        return {
            user,
            stats: {
                bookingCount,
                totalSpent: totalSpent[0]?.total || 0,
            },
        };
    }

    async blockUser(id: string, adminId: string, reason: string, ip: string) {
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
        );
        return user;
    }

    async unblockUser(id: string, adminId: string, ip: string) {
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
