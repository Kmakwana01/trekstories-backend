"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const mongoose_1 = require("@nestjs/mongoose");
const booking_schema_1 = require("../database/schemas/booking.schema");
const tour_schema_1 = require("../database/schemas/tour.schema");
const payment_schema_1 = require("../database/schemas/payment.schema");
const review_schema_1 = require("../database/schemas/review.schema");
const transaction_schema_1 = require("../database/schemas/transaction.schema");
const tour_date_schema_1 = require("../database/schemas/tour-date.schema");
const blog_schema_1 = require("../database/schemas/blog.schema");
const coupon_schema_1 = require("../database/schemas/coupon.schema");
const common_1 = require("@nestjs/common");
async function migrate() {
    const logger = new common_1.Logger('Migration');
    logger.log('Starting Case-Sensitivity Normalization Migration...');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const bookingModel = app.get((0, mongoose_1.getModelToken)(booking_schema_1.Booking.name));
    const tourModel = app.get((0, mongoose_1.getModelToken)(tour_schema_1.Tour.name));
    const paymentModel = app.get((0, mongoose_1.getModelToken)(payment_schema_1.Payment.name));
    const reviewModel = app.get((0, mongoose_1.getModelToken)(review_schema_1.Review.name));
    const transactionModel = app.get((0, mongoose_1.getModelToken)(transaction_schema_1.Transaction.name));
    const tourDateModel = app.get((0, mongoose_1.getModelToken)(tour_date_schema_1.TourDate.name));
    const blogModel = app.get((0, mongoose_1.getModelToken)(blog_schema_1.Blog.name));
    const couponModel = app.get((0, mongoose_1.getModelToken)(coupon_schema_1.Coupon.name));
    logger.log('Normalizing Bookings...');
    const bookings = await bookingModel.find();
    for (const b of bookings) {
        if (b.status)
            b.status = b.status.toUpperCase();
        if (b.paymentType)
            b.paymentType = b.paymentType.toUpperCase();
        if (b.couponCode)
            b.couponCode = b.couponCode.toUpperCase();
        if (b.travelers) {
            b.travelers.forEach((t) => {
                if (t.gender)
                    t.gender = t.gender.toUpperCase();
            });
        }
        await b.save();
    }
    logger.log('Normalizing Tours...');
    const tours = await tourModel.find();
    for (const t of tours) {
        if (t.category)
            t.category = t.category.toUpperCase().replace(/\s+/g, '_');
        if (t.departureOptions) {
            t.departureOptions.forEach((o) => {
                if (o.type)
                    o.type = o.type.toUpperCase().replace(/\s+/g, '_');
            });
        }
        await t.save();
    }
    logger.log('Normalizing Payments...');
    const payments = await paymentModel.find();
    for (const p of payments) {
        if (p.status)
            p.status = p.status.toUpperCase().replace(/\s+/g, '_');
        if (p.method)
            p.method = p.method.toUpperCase().replace(/\s+/g, '_');
        if (p.paymentType) {
            p.method = p.paymentType.toUpperCase().replace(/\s+/g, '_');
            p.paymentType = undefined;
        }
        await p.save();
    }
    logger.log('Normalizing Reviews...');
    const reviews = await reviewModel.find();
    for (const r of reviews) {
        if (r.status)
            r.status = r.status.toUpperCase().replace(/\s+/g, '_');
        await r.save();
    }
    logger.log('Normalizing Transactions...');
    const transactions = await transactionModel.find();
    for (const tr of transactions) {
        if (tr.status)
            tr.status = tr.status.toUpperCase().replace(/\s+/g, '_');
        if (tr.type)
            tr.type = tr.type.toUpperCase().replace(/\s+/g, '_');
        await tr.save();
    }
    logger.log('Normalizing TourDates...');
    const tourDates = await tourDateModel.find();
    for (const td of tourDates) {
        if (td.status)
            td.status = td.status.toUpperCase().replace(/\s+/g, '_');
        await td.save();
    }
    logger.log('Normalizing Blogs...');
    const blogs = await blogModel.find();
    for (const bl of blogs) {
        if (bl.category)
            bl.category = bl.category.toUpperCase().replace(/\s+/g, '_');
        await bl.save();
    }
    logger.log('Normalizing Coupons...');
    const coupons = await couponModel.find();
    for (const c of coupons) {
        if (c.discountType)
            c.discountType = c.discountType.toUpperCase();
        if (c.code)
            c.code = c.code.toUpperCase();
        await c.save();
    }
    logger.log('Migration completed successfully!');
    await app.close();
}
migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
//# sourceMappingURL=normalize-db.js.map