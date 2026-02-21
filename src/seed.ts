import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './database/schemas/user.schema';
import { Tour, TourDocument } from './database/schemas/tour.schema';
import { TourDate, TourDateDocument } from './database/schemas/tour-date.schema';
import { Booking, BookingDocument } from './database/schemas/booking.schema';
import { Payment, PaymentDocument } from './database/schemas/payment.schema';
import { Transaction, TransactionDocument } from './database/schemas/transaction.schema';
import { Review, ReviewDocument } from './database/schemas/review.schema';
import { Coupon, CouponDocument } from './database/schemas/coupon.schema';
import { Blog, BlogDocument } from './database/schemas/blog.schema';
import { Role } from './common/enums/roles.enum';
import * as bcrypt from 'bcryptjs';
import { Logger } from '@nestjs/common';
import slugify from 'slugify';

async function bootstrap() {
    const logger = new Logger('Seeder');
    const app = await NestFactory.createApplicationContext(AppModule);

    const userModel = app.get<Model<any>>(getModelToken(User.name));
    const tourModel = app.get<Model<any>>(getModelToken(Tour.name));
    const tourDateModel = app.get<Model<any>>(getModelToken(TourDate.name));
    const bookingModel = app.get<Model<any>>(getModelToken(Booking.name));
    const paymentModel = app.get<Model<any>>(getModelToken(Payment.name));
    const transactionModel = app.get<Model<any>>(getModelToken(Transaction.name));
    const reviewModel = app.get<Model<any>>(getModelToken('Review'));
    const couponModel = app.get<Model<any>>(getModelToken(Coupon.name));
    const blogModel = app.get<Model<any>>(getModelToken(Blog.name));

    logger.log('Starting database seeding...');

    // 1. Clear existing data
    await Promise.all([
        userModel.deleteMany({}),
        tourModel.deleteMany({}),
        tourDateModel.deleteMany({}),
        bookingModel.deleteMany({}),
        paymentModel.deleteMany({}),
        transactionModel.deleteMany({}),
        reviewModel.deleteMany({}),
        couponModel.deleteMany({}),
        blogModel.deleteMany({}),
    ]);
    logger.log('Existing data cleared.');

    // 2. Create Users
    const salt = await bcrypt.genSalt(10);
    const commonPasswordHash = await bcrypt.hash('password123', salt);

    const admin = await userModel.create({
        name: 'System Admin',
        email: 'admin@test.com',
        phone: '+919876543210',
        passwordHash: commonPasswordHash,
        role: Role.ADMIN,
        isVerified: true,
    });

    const customers = await userModel.insertMany([
        {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+919999999991',
            passwordHash: commonPasswordHash,
            role: Role.CUSTOMER,
            isVerified: true,
            gender: 'male',
            country: 'USA',
        },
        {
            name: 'Priya Sharma',
            email: 'priya@example.com',
            phone: '+919999999992',
            passwordHash: commonPasswordHash,
            role: Role.CUSTOMER,
            isVerified: true,
            gender: 'female',
            country: 'India',
        },
        {
            name: 'Michael Chen',
            email: 'michael@example.com',
            phone: '+919999999993',
            passwordHash: commonPasswordHash,
            role: Role.CUSTOMER,
            isVerified: true,
            gender: 'male',
            country: 'Canada',
        }
    ]);
    logger.log(`Seeded ${customers.length + 1} users.`);

    // 3. Create Tours
    const toursData = [
        {
            title: 'Enchanting Ladakh Adventure',
            description: 'Experience the raw beauty of the Himalayas. Visit Pangong Lake, Khardung La Pass, and ancient monasteries.',
            basePrice: 45000,
            category: 'Adventure',
            location: 'Leh, Ladakh',
            state: 'Ladakh',
            country: 'India',
            highlights: ['Pangong Lake', 'Nubra Valley', 'Khardung La Pass'],
            inclusions: ['Accommodation', 'Internal Transfers', 'Permits', 'Breakfast & Dinner'],
            thumbnailImage: 'https://images.unsplash.com/photo-1581791534721-e599df4417f7?q=80&w=2000&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=2000&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1626084605051-bd1285226c06?q=80&w=2000&auto=format&fit=crop'
            ],
            departureOptions: [
                { fromCity: 'Delhi', toCity: 'Leh', type: 'FLIGHT', totalDays: 7, totalNights: 6, priceAdjustment: 12000 },
                { fromCity: 'Leh', toCity: 'Leh', type: 'AC', totalDays: 7, totalNights: 6, priceAdjustment: 0 }
            ],
            itinerary: [
                { dayNumber: 1, title: 'Arrival in Leh', points: [{ text: 'Pick up from Airport', subPoints: ['Transfer to hotel', 'Full day rest for acclimatization'] }] },
                { dayNumber: 2, title: 'Leh Local Sightseeing', points: [{ text: 'Visit Monasteries', subPoints: ['Shanti Stupa', 'Leh Palace', 'Hall of Fame'] }] }
            ]
        },
        {
            title: 'Goa Coastal Retreat',
            description: 'Relax on the sun-kissed beaches of North Goa. Enjoy water sports, seafood, and vibrant nightlife.',
            basePrice: 15000,
            category: 'Beach',
            location: 'Calangute, Goa',
            state: 'Goa',
            country: 'India',
            highlights: ['Baga Beach', 'Aguada Fort', 'Dudhsagar Falls'],
            inclusions: ['3 Star Hotel', 'Pick-up & Drop', 'Breakfast'],
            thumbnailImage: 'https://images.unsplash.com/photo-1512783558244-97e3a6a9be27?q=80&w=2000&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=2000&auto=format&fit=crop'],
            departureOptions: [
                { fromCity: 'Mumbai', toCity: 'Goa', type: 'AC', totalDays: 4, totalNights: 3, priceAdjustment: 2500 },
                { fromCity: 'Goa', toCity: 'Goa', type: 'NON-AC', totalDays: 4, totalNights: 3, priceAdjustment: 0 }
            ],
            itinerary: [
                { dayNumber: 1, title: 'Beach Day', points: [{ text: 'Explore Baga and Calangute', subPoints: ['Watch sunset', 'Dinner at beach shack'] }] }
            ]
        },
        {
            title: 'Kerala Backwaters Serenity',
            description: 'Cruise through the peaceful backwaters of Alleppey in a traditional houseboat.',
            basePrice: 22000,
            category: 'Leisure',
            location: 'Alleppey, Kerala',
            state: 'Kerala',
            country: 'India',
            highlights: ['Houseboat Stay', 'Vembanad Lake', 'Ayurvedic Massage'],
            inclusions: ['Houseboat Stay', 'All Meals', 'Village Tour'],
            thumbnailImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=2000&auto=format&fit=crop',
            images: ['https://images.unsplash.com/photo-1593181628399-3c35b80985c4?q=80&w=2000&auto=format&fit=crop'],
            departureOptions: [
                { fromCity: 'Cochin', toCity: 'Alleppey', type: 'AC', totalDays: 3, totalNights: 2, priceAdjustment: 0 }
            ],
            itinerary: [
                { dayNumber: 1, title: 'Check-in to Houseboat', points: [{ text: 'Cruise begins', subPoints: ['Lunch on board', 'Relaxing evening'] }] }
            ]
        }
    ];

    const seededTours: any[] = [];
    for (const t of toursData)
    {
        const slug = slugify(t.title, { lower: true, strict: true });
        const tour = await tourModel.create({ ...t, slug });
        seededTours.push(tour);
    }
    logger.log(`Seeded ${seededTours.length} tours.`);

    // 4. Create Tour Dates
    const seededTourDates: any[] = [];
    for (const tour of seededTours)
    {
        const d1 = new Date();
        d1.setDate(d1.getDate() + 30);
        const d2 = new Date();
        d2.setDate(d2.getDate() + 60);

        const dates = await tourDateModel.insertMany([
            {
                tour: tour._id,
                startDate: d1,
                endDate: new Date(d1.getTime() + 5 * 24 * 60 * 60 * 1000),
                totalSeats: 20,
                bookedSeats: 5,
                status: 'upcoming',
            },
            {
                tour: tour._id,
                startDate: d2,
                endDate: new Date(d2.getTime() + 5 * 24 * 60 * 60 * 1000),
                totalSeats: 25,
                bookedSeats: 0,
                status: 'upcoming',
            }
        ]);
        seededTourDates.push(...dates);
    }
    logger.log(`Seeded ${seededTourDates.length} tour dates.`);

    // 5. Create Coupons
    await couponModel.create({
        code: 'WELCOME10',
        discountType: 'percent',
        discountValue: 10,
        minOrderAmount: 5000,
        maxDiscountAmount: 2000,
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        isActive: true,
        maxUsage: 100,
    });
    logger.log('Seeded coupons.');

    // 6. Create Bookings & Payments
    const john: any = customers[0];
    const tourDate: any = seededTourDates[0];
    const tour: any = seededTours[0];

    const booking = await bookingModel.create({
        bookingNumber: 'BK-10001',
        user: john._id,
        tour: tour._id,
        tourDate: tourDate._id,
        pickupOption: tour.departureOptions[0],
        travelers: [
            { fullName: 'John Doe', age: 30, gender: 'male', phone: john.phone, idNumber: 'A1234567' }
        ],
        totalTravelers: 1,
        baseAmount: tour.basePrice,
        taxAmount: Math.round(tour.basePrice as number * 0.05),
        totalAmount: Math.round(tour.basePrice as number * 1.05),
        paidAmount: Math.round(tour.basePrice as number * 1.05),
        pendingAmount: 0,
        status: 'confirmed',
        pricingSummary: 'Seeded booking summary',
        paymentVerifiedAt: new Date(),
    });

    const payment = await paymentModel.create({
        user: john._id,
        booking: booking._id,
        amount: booking.totalAmount,
        paymentType: 'online',
        paymentMethod: 'Razorpay',
        transactionId: 'pay_seeded_001',
        status: 'success',
        paidAt: new Date(),
        verifiedAt: new Date(),
        verifiedBy: admin._id,
    });

    await transactionModel.create({
        user: john._id,
        booking: booking._id,
        payment: payment._id,
        amount: payment.amount,
        type: 'payment',
        status: 'success',
        transactionId: payment.transactionId,
        paymentMethod: payment.paymentMethod,
        processedAt: new Date(),
        description: 'Seeded online payment'
    });
    logger.log('Seeded bookings and payments.');

    // 7. Create Reviews
    await reviewModel.create({
        user: john._id,
        tour: tour._id,
        booking: booking._id,
        rating: 5,
        comment: 'Absolutely amazing trip! Ladakh is truly a paradise. The organization was top notch.',
        isPublished: true,
    });
    logger.log('Seeded reviews.');

    // 8. Create Blogs
    await blogModel.create({
        title: 'Top 10 Things to Pack for Ladakh',
        slug: 'top-10-things-to-pack-for-ladakh',
        content: '<p>Ladakh requires careful packing because of high altitude and changing weather...</p>',
        excerpt: 'Preparation is key for a successful Ladakh trip.',
        author: admin._id,
        category: 'Travel Tips',
        tags: ['Ladakh', 'Packing', 'Adventure'],
        isPublished: true,
        publishedAt: new Date(),
        featuredImage: 'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=2000&auto=format&fit=crop',
    });
    logger.log('Seeded blogs.');

    logger.log('Database seeding completed successfully! 🎉');

    await app.close();
    process.exit(0);
}

bootstrap().catch(err => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
