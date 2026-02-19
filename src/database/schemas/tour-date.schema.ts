import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type TourDateDocument = TourDate & Document;

@Schema({ timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } })
export class TourDate {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Tour', required: true })
    tour: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    startDate: Date;

    @Prop({ required: true })
    endDate: Date;

    @Prop({ required: true })
    totalSeats: number;

    @Prop({ default: 0 })
    bookedSeats: number;

    @Prop()
    priceOverride: number;

    @Prop()
    departureNote: string;

    @Prop({
        enum: ['upcoming', 'full', 'completed', 'cancelled'],
        default: 'upcoming',
    })
    status: string;
}

export const TourDateSchema = SchemaFactory.createForClass(TourDate);

TourDateSchema.virtual('availableSeats').get(function (this: TourDateDocument) {
    return this.totalSeats - this.bookedSeats;
});
