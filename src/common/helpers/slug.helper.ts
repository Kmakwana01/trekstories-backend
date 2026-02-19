import { Model } from 'mongoose';

export function generateSlug(text: string): string {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-') // Replace spaces with -
        .replace(/[^\w\-]+/g, '') // Remove all non-word chars
        .replace(/\-\-+/g, '-') // Replace multiple - with single -
        .replace(/^-+/, '') // Trim - from start of text
        .replace(/-+$/, ''); // Trim - from end of text
}

export async function generateUniqueSlug(
    model: Model<any>,
    text: string,
    field: string = 'slug',
): Promise<string> {
    let slug = generateSlug(text);
    let uniqueSlug = slug;
    let counter = 1;

    while (await model.findOne({ [field]: uniqueSlug }).exec())
    {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }

    return uniqueSlug;
}
