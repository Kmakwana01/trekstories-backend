import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { TransactionType, TransactionStatus } from '../../common/enums/transaction.enum';

export type TransactionDocument = Transaction & Document;

@Schema({ timestamps: true })
export class Transaction {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    user: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Booking' })
    booking: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Payment' })
    payment: MongooseSchema.Types.ObjectId;

    @Prop({
        type: String,
        enum: Object.values(TransactionType),
        required: true,
        uppercase: true,
        trim: true
    })
    type: string;

    @Prop({ required: true })
    amount: number;

    @Prop()
    paymentMethod: string;

    @Prop()
    transactionId: string;

    @Prop({
        type: String,
        enum: Object.values(TransactionStatus),
        default: TransactionStatus.PENDING,
        uppercase: true,
        trim: true
    })
    status: string;

    @Prop()
    receiptImage: string;

    @Prop()
    rejectionReason: string;

    @Prop()
    description: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User' })
    processedBy: MongooseSchema.Types.ObjectId;

    @Prop()
    processedAt: Date;

    @Prop({ type: MongooseSchema.Types.Mixed })
    metadata: any;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);
