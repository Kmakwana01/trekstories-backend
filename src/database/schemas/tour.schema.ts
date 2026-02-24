import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type TourDocument = Tour & Document;

@Schema({ _id: false })
class ItineraryPoint {
    @Prop({ required: true })
    text: string;

    @Prop([String])
    subPoints: string[];
}
const ItineraryPointSchema = SchemaFactory.createForClass(ItineraryPoint);

@Schema({ _id: false })
class ItineraryDay {
    @Prop({ required: true })
    dayNumber: number;

    @Prop({ required: true })
    title: string;

    @Prop({ type: [ItineraryPointSchema], required: true })
    points: ItineraryPoint[];
}
const ItineraryDaySchema = SchemaFactory.createForClass(ItineraryDay);

@Schema({ _id: false })
export class PickupPoint {
    @Prop()
    fromCity: string;

    @Prop()
    toCity: string;

    @Prop({ enum: ['AC', 'NON-AC', 'FLIGHT', 'TRAIN'] })
    type: string;

    @Prop()
    departureTimeAndPlace: string;

    @Prop()
    totalDays: number;

    @Prop()
    totalNights: number;

    @Prop({ default: 0 })
    priceAdjustment: number;
}
export const PickupPointSchema = SchemaFactory.createForClass(PickupPoint);

@Schema({ timestamps: true })
export class Tour {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop()
    description: string;

    @Prop()
    duration: string;

    @Prop({ required: true })
    basePrice: number;

    @Prop()
    minAge: number;

    @Prop()
    maxAge: number;

    @Prop()
    @Prop({ index: true })
    category: string;

    @Prop()
    location: string;

    @Prop({ index: true })
    state: string;

    @Prop()
    country: string;

    @Prop([String])
    highlights: string[];

    @Prop({ type: [PickupPointSchema] })
    departureOptions: PickupPoint[];

    @Prop({ type: [ItineraryDaySchema] })
    itinerary: ItineraryDay[];

    @Prop([String])
    inclusions: string[];

    @Prop([String])
    exclusions: string[];

    @Prop({ type: [{ question: String, answer: String }], _id: false })
    faqs: { question: string; answer: string }[];

    @Prop([String])
    images: string[];

    @Prop()
    thumbnailImage: string;

    @Prop({ default: true, index: true })
    isActive: boolean;

    @Prop({ default: false, index: true })
    isFeatured: boolean;

    @Prop({ default: 0 })
    viewCount: number;

    @Prop({ default: 0 })
    averageRating: number;

    @Prop({ default: 0 })
    reviewCount: number;
}

export const TourSchema = SchemaFactory.createForClass(Tour);

// Compound index for featured tours sorting/filtering
TourSchema.index({ isActive: 1, isFeatured: 1 });
