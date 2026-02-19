import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    user: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tour', required: true })
    tour: MongooseSchema.Types.ObjectId;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Booking', required: true })
    booking: MongooseSchema.Types.ObjectId;

    @Prop({ min: 1, max: 5, required: true })
    rating: number;

    @Prop()
    title: string;

    @Prop()
    comment: string;

    @Prop([String])
    images: string[];

    @Prop({
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending',
    })
    status: string;

    @Prop()
    adminNote: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Ensure one review per tour per user
ReviewSchema.index({ user: 1, tour: 1 }, { unique: true });
