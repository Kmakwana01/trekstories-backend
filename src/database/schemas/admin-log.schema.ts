import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';

export type AdminLogDocument = AdminLog & Document;

@Schema({ timestamps: true })
export class AdminLog {
    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    admin: MongooseSchema.Types.ObjectId;

    @Prop({ required: true })
    action: string;

    @Prop({ required: true })
    module: string;

    @Prop()
    targetId: string;

    @Prop({ type: MongooseSchema.Types.Mixed })
    details: any;

    @Prop()
    ipAddress: string;

    @Prop()
    userAgent: string;
}

export const AdminLogSchema = SchemaFactory.createForClass(AdminLog);
