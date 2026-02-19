import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

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
        enum: ['payment', 'refund', 'manual_credit', 'manual_debit'],
        required: true,
    })
    type: string;

    @Prop({ required: true })
    amount: number;

    @Prop()
    paymentMethod: string;

    @Prop()
    transactionId: string;

    @Prop({ enum: ['pending', 'success', 'failed'], default: 'pending' })
    status: string;

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
