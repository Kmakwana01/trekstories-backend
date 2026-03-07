import { Prop, Schema as SchemaField, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export class SocialLinks {
    facebook?: string;
    instagram?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
}

@SchemaField({ timestamps: true })
export class TeamMember {
    @Prop({ required: true, trim: true })
    name: string;

    @Prop({ required: true, trim: true })
    designation: string;

    @Prop({ trim: true })
    bio: string;

    @Prop()
    image: string;

    @Prop({ type: Object, default: {} })
    socialLinks: SocialLinks;

    @Prop({ default: 0, index: true })
    order: number;

    @Prop({ default: true, index: true })
    isActive: boolean;
}

export type TeamMemberDocument = TeamMember & Document;
export const TeamMemberSchema = SchemaFactory.createForClass(TeamMember);
// Index for ordering active members
TeamMemberSchema.index({ isActive: 1, order: 1 });
