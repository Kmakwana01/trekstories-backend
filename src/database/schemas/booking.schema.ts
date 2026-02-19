import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { PickupPoint, PickupPointSchema } from './tour.schema';

export type BookingDocument = Booking & Document;

@Schema()
class Traveler {
    @Prop()
    fullName: string;

    @Prop()
    age: number;

    @Prop()
    gender: string;

    @Prop()
    phone: string;

    @Prop()
    idNumber: string;
}
const TravelerSchema = SchemaFactory.createForClass(Traveler);

@Schema({ timestamps: true })
export class Booking {
    @Prop({ unique: true })
    bookingNumber: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tour', required: true })
    tour: MongooseSchema.Types.ObjectId;

    @Prop({
        type: MongooseSchema.Types.ObjectId,
        ref: 'TourDate',
        required: true,
    })
    tourDate: MongooseSchema.Types.ObjectId;

    @Prop({ type: PickupPointSchema })
    pickupOption: PickupPoint;

    @Prop({ type: [TravelerSchema] })
    travelers: Traveler[];

    @Prop()
    totalTravelers: number;

    @Prop()
    baseAmount: number;

    @Prop({ default: 0 })
    discountAmount: number;

    @Prop()
    couponCode: string;

    @Prop({ required: true })
    totalAmount: number;

    @Prop({ default: 0 })
    paidAmount: number;

    @Prop()
    pendingAmount: number;

    @Prop({ enum: ['online', 'offline', 'partial'] })
    paymentType: string;

    @Prop({
        enum: ['pending', 'confirmed', 'cancelled', 'completed', 'on_hold'],
        default: 'pending',
    })
    status: string;

    @Prop()
    additionalRequests: string;

    @Prop()
    internalNotes: string;
}

export const BookingSchema = SchemaFactory.createForClass(Booking);
