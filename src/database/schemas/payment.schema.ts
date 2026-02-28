import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PaymentStatus, PaymentMethod } from '../../common/enums/payment-status.enum';

export type PaymentDocument = Payment & Document;

@Schema({ timestamps: true })
export class Payment {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Booking', required: true })
    booking: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({
        type: String,
        enum: Object.values(PaymentMethod),
        uppercase: true,
        trim: true
    })
    method: string;

    @Prop()
    paymentMethod: string;

    // Online verification
    @Prop()
    transactionId: string;

    @Prop()
    paymentReceiptImage: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    verifiedBy: MongooseSchema.Types.ObjectId;

    @Prop()
    verifiedAt: Date;

    // Offline collection
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    offlineCollectedBy: MongooseSchema.Types.ObjectId;

    @Prop()
    offlineCollectedAt: Date;

    @Prop()
    offlineReceiptNumber: string;

    @Prop({ required: true })
    amount: number;

    @Prop({ default: 'INR' })
    currency: string;

    @Prop({
        type: String,
        enum: Object.values(PaymentStatus),
        default: PaymentStatus.PENDING,
        uppercase: true,
        trim: true,
        index: true,
    })
    status: string;

    @Prop()
    rejectionReason: string;

    @Prop()
    paidAt: Date;

    @Prop({ type: MongooseSchema.Types.Mixed })
    metadata: any;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);
