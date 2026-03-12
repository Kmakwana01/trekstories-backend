import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export enum CustomTourStatus {
    NEW = 'NEW',
    CONTACTED = 'CONTACTED',
    CLOSED = 'CLOSED',
}

export type CustomTourRequestDocument = CustomTourRequest & Document;

@Schema({ timestamps: true })
export class CustomTourRequest {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true, lowercase: true })
    email: string;

    @Prop({ required: true, trim: true })
    phone: string;

    @Prop({ required: true, trim: true })
    destination: string;

    @Prop({ trim: true, default: '' })
    travelDates: string;

    @Prop({ default: 1, min: 1 })
    groupSize: number;

    @Prop({ trim: true, default: '' })
    budget: string;

    @Prop({ trim: true, default: '' })
    tourType: string;

    @Prop({ required: true, trim: true })
    message: string;

    @Prop({
        type: String,
        enum: CustomTourStatus,
        default: CustomTourStatus.NEW,
    })
    status: CustomTourStatus;

    @Prop({ trim: true, default: '' })
    adminNotes: string;
}

export const CustomTourRequestSchema =
    SchemaFactory.createForClass(CustomTourRequest);
