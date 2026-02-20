import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type CouponDocument = Coupon & Document;

@Schema({ timestamps: true })
export class Coupon {
    @Prop({ required: true, unique: true, uppercase: true })
    code: string;

    @Prop()
    description: string;

    @Prop({ enum: ['percent', 'flat'], required: true })
    discountType: string;

    @Prop({ required: true })
    discountValue: number;

    @Prop()
    maxDiscountAmount: number;

    @Prop()
    expiryDate: Date;

    @Prop()
    maxUsage: number;

    @Prop({ default: 1 })
    maxUsagePerUser: number;

    @Prop({ default: 0 })
    usedCount: number;

    @Prop({ default: 0 })
    minOrderAmount: number;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Tour' }] })
    applicableTours: MongooseSchema.Types.ObjectId[];

    @Prop({ default: true })
    isActive: boolean;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);
