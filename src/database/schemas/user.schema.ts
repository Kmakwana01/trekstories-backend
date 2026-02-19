import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema, Document } from 'mongoose';
import { Role } from '../../common/enums/roles.enum';

export type UserDocument = User & Document;

@Schema()
class SavedTraveler {
    @Prop()
    fullName: string;

    @Prop()
    age: number;

    @Prop()
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
    passwordHash: string;

    @Prop({ enum: ['male', 'female', 'other'] })
    gender: string;

    @Prop()
    dateOfBirth: Date;

    @Prop()
    country: string;

    @Prop()
    contactAddress: string;

    @Prop({ enum: Role, default: Role.CUSTOMER })
    role: string;

    @Prop({ default: true })
    isVerified: boolean;

    @Prop({ default: false })
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
}

export const UserSchema = SchemaFactory.createForClass(User);
