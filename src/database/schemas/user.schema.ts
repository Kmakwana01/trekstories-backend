import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document } from 'mongoose';
import { Role } from '../../common/enums/roles.enum';
import { Gender } from '../../common/enums/gender.enum';

export type UserDocument = User & Document;

@Schema()
class SavedTraveler {
    @Prop()
    fullName: string;

    @Prop()
    age: number;

    @Prop({
        type: String,
        enum: Object.values(Gender),
        uppercase: true,
        trim: true
    })
    gender: string;

    @Prop()
    idNumber: string;
}
const SavedTravelerSchema = SchemaFactory.createForClass(SavedTraveler);

@Schema({ timestamps: true })
export class User {
    @Prop({ required: true })
    name: string;

    @Prop({ required: true, unique: true })
    email: string;

    @Prop({ unique: true, sparse: true })
    phone: string;

    @Prop()
    avatar?: string;

    @Prop()
    passwordHash: string;

    @Prop({
        type: String,
        enum: Object.values(Gender),
        uppercase: true,
        trim: true
    })
    gender: string;

    @Prop()
    dateOfBirth: Date;

    @Prop()
    country: string;

    @Prop()
    contactAddress: string;

    @Prop({
        type: String,
        enum: Object.values(Role),
        default: Role.CUSTOMER,
        uppercase: true,
        trim: true,
        index: true
    })
    role: string;

    @Prop({ default: true, index: true })
    isVerified: boolean;

    @Prop({ default: false, index: true })
    isBlocked: boolean;

    @Prop()
    otp?: string;

    @Prop()
    otpExpiry?: Date;

    @Prop()
    resetToken?: string;

    @Prop()
    resetTokenExpiry?: Date;

    @Prop()
    lastLogin: Date;

    @Prop()
    refreshTokenHash?: string;

    @Prop({ type: [{ type: MongooseSchema.Types.ObjectId, ref: 'Tour' }] })
    wishlist: MongooseSchema.Types.ObjectId[];

    @Prop({ type: [SavedTravelerSchema] })
    savedTravelers: SavedTraveler[];

    @Prop()
    internalNotes?: string;

    @Prop({ type: [{ note: String, createdAt: { type: Date, default: Date.now }, adminId: { type: MongooseSchema.Types.ObjectId, ref: 'User' } }], default: [] })
    adminNotes: { note: string; createdAt: Date; adminId?: MongooseSchema.Types.ObjectId }[];
}

export const UserSchema = SchemaFactory.createForClass(User);
