
import { Prop, Schema as SchemaField, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
@SchemaField({ timestamps: true })
export class Blog {
    @Prop({ required: true, unique: true, trim: true })
    title: string;

    @Prop({ required: true, unique: true, index: true, trim: true })
    slug: string;

    @Prop({ required: true })
    content: string; // HTML or Markdown

    @Prop({ required: true })
    excerpt: string;

    @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
    author: MongooseSchema.Types.ObjectId;

    @Prop()
    featuredImage: string;

    @Prop({ required: true, index: true })
    category: string;

    @Prop({ type: [String], index: true })
    tags: string[];

    @Prop({ default: false, index: true })
    isPublished: boolean;

    @Prop()
    publishedAt: Date;

    @Prop({ default: 0 })
    viewCount: number;
}
export type BlogDocument = Blog & Document;
export const BlogSchema = SchemaFactory.createForClass(Blog);
// Add text index for search
BlogSchema.index({ title: 'text', content: 'text', category: 'text', tags: 'text' });
