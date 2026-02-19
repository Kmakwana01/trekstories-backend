import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BlogDocument = Blog & Document;

@Schema({ timestamps: true })
export class Blog {
    @Prop({ required: true })
    title: string;

    @Prop({ required: true, unique: true })
    slug: string;

    @Prop({ required: true })
    content: string;

    @Prop()
    excerpt: string;

    @Prop()
    featuredImage: string;

    @Prop()
    category: string;

    @Prop([String])
    tags: string[];

    @Prop()
    seoTitle: string;

    @Prop()
    seoDescription: string;

    @Prop({ default: false })
    isPublished: boolean;

    @Prop()
    publishedAt: Date;

    @Prop({ default: 0 })
    viewCount: number;
}

export const BlogSchema = SchemaFactory.createForClass(Blog);
