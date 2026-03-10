import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PickupPoint, PickupPointSchema } from './tour.schema';
import { BookingStatus, PaymentType, RefundStatus } from '../../common/enums/booking-status.enum';
import { Gender } from '../../common/enums/gender.enum';

@Schema({ _id: false })
class InternalNote {
    @Prop({ required: true })
    note: string;

    @Prop({ default: () => new Date() })
    createdAt: Date;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    adminId: MongooseSchema.Types.ObjectId;
}
const InternalNoteSchema = SchemaFactory.createForClass(InternalNote);

export type BookingDocument = Booking & Document;

@Schema()
class Traveler {
    @Prop()
    fullName: string;

    @Prop()
    age: number;

    @Prop({
        type: String,
        enum: Object.values(Gender),
        uppercase: true,
        trim: true
    })
    gender: string;

    @Prop()
    phone: string;

    @Prop()
    idNumber: string;
}
const TravelerSchema = SchemaFactory.createForClass(Traveler);

@Schema({ timestamps: true })
export class Booking {
    @Prop({ unique: true, index: true })
    bookingNumber: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true, index: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tour', required: true, index: true })
    tour: MongooseSchema.Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'TourDate',
        required: true,
        index: true,
    })
    tourDate: MongooseSchema.Types.ObjectId;

    @Prop({ type: PickupPointSchema })
    pickupOption: PickupPoint;

    @Prop({ type: [TravelerSchema] })
    travelers: Traveler[];

    @Prop()
    totalTravelers: number;

    @Prop({ index: true })
    baseAmount: number;

    @Prop({ default: 0 })
    discountAmount: number;

    @Prop()
    couponCode: string;

    @Prop({ required: true, index: true })
    totalAmount: number;

    @Prop({ default: 0 })
    taxAmount: number;

    @Prop({ default: 5 })
    taxRate: number;

    @Prop()
    perPersonPrice: number;

    @Prop({ default: 0 })
    paidAmount: number;

    @Prop()
    pendingAmount: number;

    @Prop({
        type: String,
        enum: Object.values(PaymentType),
        uppercase: true,
        trim: true
    })
    paymentType: string;

    @Prop({
        type: String,
        enum: Object.values(BookingStatus),
        default: BookingStatus.PENDING,
        uppercase: true,
        trim: true,
        index: true,
    })
    status: string;

    @Prop()
    additionalRequests: string;

    @Prop()
    transactionId: string;

    @Prop()
    receiptImage: string;

    @Prop()
    paymentVerifiedAt: Date;

    @Prop({ type: [InternalNoteSchema], default: [] })
    internalNotes: InternalNote[];

    @Prop()
    pricingSummary: string;

    @Prop({
        type: String,
        enum: Object.values(RefundStatus),
        default: RefundStatus.NONE,
        uppercase: true,
        trim: true
    })
    refundStatus: string;

    @Prop()
    refundAdminNote: string;

    @Prop({ default: 0 })
    refundAmount: number;

    @Prop()
    refundReason: string;

    @Prop()
    refundRequestedAt: Date;

    @Prop()
    refundProcessedAt: Date;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
