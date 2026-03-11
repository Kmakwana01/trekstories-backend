import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { NotificationType } from '../../common/enums/notification-type.enum';

export type NotificationDocument = Notification & Document;

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: MongooseSchema.Types.ObjectId;

  @Prop({
    enum: Object.values(NotificationType),
    default: NotificationType.GENERAL,
  })
  type: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  isRead: boolean;

  @Prop()
  readAt: Date;

  @Prop({ type: MongooseSchema.Types.Mixed })
  metadata: any;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
