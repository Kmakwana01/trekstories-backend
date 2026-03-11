import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { ReviewStatus } from '../../common/enums/review-status.enum';
import { User } from '../schemas/user.schema';
import { Tour } from '../schemas/tour.schema';
import { Booking } from '../schemas/booking.schema';

export type ReviewDocument = Review & Document;

@Schema({ timestamps: true })
export class Review {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tour', required: true })
  tour: Tour;

  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Booking',
    required: true,
    unique: true,
  })
  booking: Booking;

  @Prop({ required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ required: true })
  comment: string;

  @Prop({
    type: String,
    required: true,
    enum: Object.values(ReviewStatus),
    default: ReviewStatus.PENDING,
    uppercase: true,
    trim: true,
    index: true,
  })
  status: string;

  @Prop()
  adminNote: string;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

// Index for fetching public reviews efficiently
ReviewSchema.index({ tour: 1, status: 1 });
