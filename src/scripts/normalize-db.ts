import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Booking } from '../database/schemas/booking.schema';
import { Tour } from '../database/schemas/tour.schema';
import { Payment } from '../database/schemas/payment.schema';
import { Review } from '../database/schemas/review.schema';
import { Transaction } from '../database/schemas/transaction.schema';
import { TourDate } from '../database/schemas/tour-date.schema';
import { Blog } from '../database/schemas/blog.schema';
import { Coupon } from '../database/schemas/coupon.schema';
import { Logger } from '@nestjs/common';

async function migrate() {
    const logger = new Logger('Migration');
    logger.log('Starting Case-Sensitivity Normalization Migration...');

    const app = await NestFactory.createApplicationContext(AppModule);

    const bookingModel = app.get<Model<any>>(getModelToken(Booking.name));
    const tourModel = app.get<Model<any>>(getModelToken(Tour.name));
    const paymentModel = app.get<Model<any>>(getModelToken(Payment.name));
    const reviewModel = app.get<Model<any>>(getModelToken(Review.name));
    const transactionModel = app.get<Model<any>>(getModelToken(Transaction.name));
    const tourDateModel = app.get<Model<any>>(getModelToken(TourDate.name));
    const blogModel = app.get<Model<any>>(getModelToken(Blog.name));
    const couponModel = app.get<Model<any>>(getModelToken(Coupon.name));

    // 1. Normalize Bookings
    logger.log('Normalizing Bookings...');
    const bookings = await bookingModel.find();
    for (const b of bookings)
    {
        if (b.status) b.status = b.status.toUpperCase();
        if (b.paymentType) b.paymentType = b.paymentType.toUpperCase();
        if (b.couponCode) b.couponCode = b.couponCode.toUpperCase();
        if (b.travelers)
        {
            b.travelers.forEach((t: any) => {
                if (t.gender) t.gender = t.gender.toUpperCase();
            });
        }
        await b.save();
    }

    // 2. Normalize Tours
    logger.log('Normalizing Tours...');
    const tours = await tourModel.find();
    for (const t of tours)
    {
        if (t.category) t.category = t.category.toUpperCase().replace(/\s+/g, '_');
        if (t.departureOptions)
        {
            t.departureOptions.forEach((o: any) => {
                if (o.type) o.type = o.type.toUpperCase().replace(/\s+/g, '_');
            });
        }
        await t.save();
    }

    // 3. Normalize Payments
    logger.log('Normalizing Payments...');
    const payments = await paymentModel.find();
    for (const p of payments)
    {
        if (p.status) p.status = p.status.toUpperCase().replace(/\s+/g, '_');
        if (p.method) p.method = p.method.toUpperCase().replace(/\s+/g, '_');
        // Support legacy 'paymentType' field if migration happened after schema change
        if ((p as any).paymentType)
        {
            p.method = (p as any).paymentType.toUpperCase().replace(/\s+/g, '_');
            (p as any).paymentType = undefined;
        }
        await p.save();
    }

    // 4. Normalize Reviews
    logger.log('Normalizing Reviews...');
    const reviews = await reviewModel.find();
    for (const r of reviews)
    {
        if (r.status) r.status = r.status.toUpperCase().replace(/\s+/g, '_');
        await r.save();
    }

    // 5. Normalize Transactions
    logger.log('Normalizing Transactions...');
    const transactions = await transactionModel.find();
    for (const tr of transactions)
    {
        if (tr.status) tr.status = tr.status.toUpperCase().replace(/\s+/g, '_');
        if (tr.type) tr.type = tr.type.toUpperCase().replace(/\s+/g, '_');
        await tr.save();
    }

    // 6. Normalize TourDates
    logger.log('Normalizing TourDates...');
    const tourDates = await tourDateModel.find();
    for (const td of tourDates)
    {
        if (td.status) td.status = td.status.toUpperCase().replace(/\s+/g, '_');
        await td.save();
    }

    // 7. Normalize Blogs
    logger.log('Normalizing Blogs...');
    const blogs = await blogModel.find();
    for (const bl of blogs)
    {
        if (bl.category) bl.category = bl.category.toUpperCase().replace(/\s+/g, '_');
        await bl.save();
    }

    // 8. Normalize Coupons
    logger.log('Normalizing Coupons...');
    const coupons = await couponModel.find();
    for (const c of coupons)
    {
        if (c.discountType) c.discountType = c.discountType.toUpperCase();
        if (c.code) c.code = c.code.toUpperCase();
        await c.save();
    }

    logger.log('Migration completed successfully!');
    await app.close();
}

migrate().catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
});
