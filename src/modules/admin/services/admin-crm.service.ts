import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from '../../../database/schemas/user.schema';
import {
  Booking,
  BookingDocument,
} from '../../../database/schemas/booking.schema';
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
    if (filters.isVerified !== undefined)
      query.isVerified = filters.isVerified === 'true';
    if (filters.isBlocked !== undefined)
      query.isBlocked = filters.isBlocked === 'true';
    if (filters.search)
    {
      query.$or = [
        { name: new RegExp(filters.search, 'i') },
        { email: new RegExp(filters.search, 'i') },
        { phone: new RegExp(filters.search, 'i') },
      ];
    }

    if (!paginationQuery.order) paginationQuery.order = 'desc';
    return paginate(this.userModel, query, paginationQuery);
  }

  async getUserById(id: string) {
    const user: any = await this.userModel
      .findById(id)
      .select('-passwordHash -otp -otpExpiry')
      .populate('wishlist', 'title slug thumbnailImage')
      .lean()
      .exec();
    if (!user) throw new NotFoundException('User not found');

    const bookings = await this.bookingModel
      .find({ user: new Types.ObjectId(id) as any })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    const bookingCount = bookings.length;
    const totalSpent = bookings
      .filter((b) => b.status?.toUpperCase() !== 'CANCELLED')
      .reduce((sum, b) => sum + (b.paidAmount || 0), 0);

    // Populate Address fallback
    user.address = user.contactAddress
      ? {
        street: user.contactAddress,
        city: user.country || 'Unknown',
        country: user.country || 'Unknown',
      }
      : null;
    user.bookings = bookings;

    // Populate internal notes fallback
    if (
      user.internalNotes &&
      (!user.adminNotes || user.adminNotes.length === 0)
    )
    {
      user.adminNotes = [
        { note: user.internalNotes, createdAt: user.updatedAt },
      ];
    }

    return {
      user,
      totalBookings: bookingCount,
      totalSpent,
      bookings,
    };
  }

  async blockUser(
    id: string,
    adminId: string,
    reason: string,
    ip: string,
    userAgent?: string,
  ) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { isBlocked: true }, { returnDocument: 'after' })
      .exec();
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

  async unblockUser(
    id: string,
    adminId: string,
    ip: string,
    userAgent?: string,
  ) {
    const user = await this.userModel
      .findByIdAndUpdate(id, { isBlocked: false }, { returnDocument: 'after' })
      .exec();
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
    const user = await this.userModel
      .findByIdAndUpdate(
        id,
        {
          $push: {
            adminNotes: {
              note,
              createdAt: new Date(),
            },
          },
        } as any, // Schema might need update, so ignoring type temporarily for rapid push
        { returnDocument: 'after' },
      )
      .exec();

    // Fallback backward compat if adminNotes isn't in schema fully
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
