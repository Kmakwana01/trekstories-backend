import { Model } from 'mongoose';
export declare function generateSlug(text: string): string;
export declare function generateUniqueSlug(model: Model<any>, text: string, field?: string): Promise<string>;
