"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateSlug = generateSlug;
exports.generateUniqueSlug = generateUniqueSlug;
function generateSlug(text) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');
}
async function generateUniqueSlug(model, text, field = 'slug') {
    let slug = generateSlug(text);
    let uniqueSlug = slug;
    let counter = 1;
    while (await model.findOne({ [field]: uniqueSlug }).exec()) {
        uniqueSlug = `${slug}-${counter}`;
        counter++;
    }
    return uniqueSlug;
}
//# sourceMappingURL=slug.helper.js.map