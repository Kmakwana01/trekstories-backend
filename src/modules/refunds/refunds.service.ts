import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import {
  Booking,
  BookingDocument,
} from '../../database/schemas/booking.schema';
import {
  Transaction,
  TransactionDocument,
} from '../../database/schemas/transaction.schema';
import { NotificationsService } from '../notifications/notifications.service';
import {
  BookingStatus,
  RefundStatus,
} from '../../common/enums/booking-status.enum';
import {
  TransactionType,
  TransactionStatus,
} from '../../common/enums/transaction.enum';
import { NotificationType } from '../../common/enums/notification-type.enum';

@Injectable()
export class RefundsService {
  constructor(
    @InjectModel(Booking.name) private bookingModel: Model<BookingDocument>,
    @InjectModel(Transaction.name)
    private transactionModel: Model<TransactionDocument>,
    private notificationsService: NotificationsService,
  ) {}

  async requestRefund(userId: string, bookingId: string, reason: string) {
    // Casting filter as any to bypass complex Mongoose type overloads
    const booking = await this.bookingModel.findOne({
      _id: new Types.ObjectId(bookingId),
      user: new Types.ObjectId(userId),
    } as any);
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.status !== BookingStatus.CANCELLED) {
      throw new BadRequestException(
        'Refund can only be requested for cancelled bookings',
      );
    }
    if (booking.paidAmount <= 0) {
      throw new BadRequestException('No amount paid to refund');
    }
    if (booking.refundStatus !== RefundStatus.NONE) {
      throw new BadRequestException('Refund request already exists');
    }

    booking.refundStatus = RefundStatus.REQUESTED;
    booking.refundReason = reason;
    booking.refundRequestedAt = new Date();

    await booking.save();

    await this.notificationsService.createNotification(
      userId,
      NotificationType.REFUND_REQUESTED,
      'Refund Requested',
      `Your refund request for booking ${booking.bookingNumber} has been submitted.`,
    );

    return { message: 'Refund requested successfully', booking };
  }

  async adminApproveRefund(
    adminId: string,
    bookingId: string,
    refundAmount: number,
    refundAdminNote: string,
  ) {
    const booking = await this.bookingModel
      .findById(bookingId)
      .populate('user');
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.refundStatus !== RefundStatus.REQUESTED) {
      throw new BadRequestException('No active refund request to approve');
    }
    if (refundAmount > booking.paidAmount) {
      throw new BadRequestException(
        'Refund amount cannot specify more than the paid amount',
      );
    }

    booking.refundStatus = RefundStatus.APPROVED;
    booking.refundAmount = refundAmount;
    booking.refundAdminNote = refundAdminNote;
    await booking.save();

    // Create transaction
    await this.transactionModel.create({
      user: booking.user as any,
      booking: booking._id as any,
      type: TransactionType.REFUND,
      amount: refundAmount,
      status: TransactionStatus.PENDING,
      description: `Refund approved for booking ${booking.bookingNumber}${refundAdminNote ? `. Note: ${refundAdminNote}` : ''}`,
      processedBy: new Types.ObjectId(adminId),
      processedAt: new Date(),
    } as any);

    const userObj: any = booking.user;
    const msg = `Your refund of ₹${refundAmount} for booking ${booking.bookingNumber} has been approved. ${refundAdminNote ? `Note: ${refundAdminNote}` : ''}`;
    await this.notificationsService.createNotification(
      userObj._id.toString(),
      NotificationType.REFUND_APPROVED,
      'Refund Approved',
      msg,
    );

    return { message: 'Refund approved successfully', booking };
  }

  async adminRejectRefund(adminId: string, bookingId: string, reason: string) {
    const booking = await this.bookingModel
      .findById(bookingId)
      .populate('user');
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.refundStatus !== RefundStatus.REQUESTED) {
      throw new BadRequestException('No active refund request to reject');
    }

    booking.refundStatus = RefundStatus.REJECTED;
    booking.internalNotes.push({
      note: `Refund rejected: ${reason}`,
      createdAt: new Date(),
      adminId: new Types.ObjectId(adminId),
    } as any);

    await booking.save();

    const userObj: any = booking.user;
    const msg = `Your refund request for booking ${booking.bookingNumber} was rejected. Reason: ${reason}`;
    await this.notificationsService.createNotification(
      userObj._id.toString(),
      NotificationType.REFUND_REJECTED,
      'Refund Rejected',
      msg,
    );

    return { message: 'Refund rejected successfully', booking };
  }

  async markRefundProcessed(adminId: string, bookingId: string) {
    const booking = await this.bookingModel
      .findById(bookingId)
      .populate('user');
    if (!booking) throw new NotFoundException('Booking not found');

    if (booking.refundStatus !== RefundStatus.APPROVED) {
      throw new BadRequestException(
        'Refund must be APPROVED before it can be marked as PROCESSED',
      );
    }

    booking.refundStatus = RefundStatus.PROCESSED;
    booking.refundProcessedAt = new Date();
    await booking.save();

    // Update transaction logic if necessary to set status SUCCESS
    await this.transactionModel.updateMany(
      {
        booking: booking._id as any,
        type: TransactionType.REFUND,
        status: TransactionStatus.PENDING,
      } as any,
      {
        $set: {
          status: TransactionStatus.SUCCESS,
          processedAt: new Date(),
          processedBy: new Types.ObjectId(adminId),
        },
      },
    );

    const userObj: any = booking.user;
    const msg = `Your refund of ₹${booking.refundAmount} for booking ${booking.bookingNumber} has been processed.`;
    await this.notificationsService.createNotification(
      userObj._id.toString(),
      NotificationType.REFUND_PROCESSED,
      'Refund Processed',
      msg,
    );

    return { message: 'Refund marked as processed', booking };
  }

  async getRefundRequests(query: any) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (query.status) {
      filter.refundStatus = query.status;
    } else {
      filter.refundStatus = {
        $in: [
          RefundStatus.REQUESTED,
          RefundStatus.APPROVED,
          RefundStatus.REJECTED,
          RefundStatus.PROCESSED,
        ],
      };
    }

    const items = await this.bookingModel
      .find(filter)
      .populate('user', 'name email phone avatar')
      .populate('tour', 'title')
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await this.bookingModel.countDocuments(filter);

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}
