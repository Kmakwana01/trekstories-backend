"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./database/schemas/user.schema");
const tour_schema_1 = require("./database/schemas/tour.schema");
const tour_date_schema_1 = require("./database/schemas/tour-date.schema");
const booking_schema_1 = require("./database/schemas/booking.schema");
const transaction_schema_1 = require("./database/schemas/transaction.schema");
const review_schema_1 = require("./database/schemas/review.schema");
const coupon_schema_1 = require("./database/schemas/coupon.schema");
const blog_schema_1 = require("./database/schemas/blog.schema");
const roles_enum_1 = require("./common/enums/roles.enum");
const gender_enum_1 = require("./common/enums/gender.enum");
const tour_category_enum_1 = require("./common/enums/tour-category.enum");
const pickup_type_enum_1 = require("./common/enums/pickup-type.enum");
const tour_date_status_enum_1 = require("./common/enums/tour-date-status.enum");
const booking_status_enum_1 = require("./common/enums/booking-status.enum");
const transaction_enum_1 = require("./common/enums/transaction.enum");
const review_status_enum_1 = require("./common/enums/review-status.enum");
const coupon_enum_1 = require("./common/enums/coupon.enum");
const blog_category_enum_1 = require("./common/enums/blog-category.enum");
const bcrypt = __importStar(require("bcryptjs"));
const common_1 = require("@nestjs/common");
const slugify_1 = __importDefault(require("slugify"));
async function bootstrap() {
    const logger = new common_1.Logger('Seeder');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userModel = app.get((0, mongoose_1.getModelToken)(user_schema_1.User.name));
    const tourModel = app.get((0, mongoose_1.getModelToken)(tour_schema_1.Tour.name));
    const tourDateModel = app.get((0, mongoose_1.getModelToken)(tour_date_schema_1.TourDate.name));
    const bookingModel = app.get((0, mongoose_1.getModelToken)(booking_schema_1.Booking.name));
    const transactionModel = app.get((0, mongoose_1.getModelToken)(transaction_schema_1.Transaction.name));
    const reviewModel = app.get((0, mongoose_1.getModelToken)(review_schema_1.Review.name));
    const couponModel = app.get((0, mongoose_1.getModelToken)(coupon_schema_1.Coupon.name));
    const blogModel = app.get((0, mongoose_1.getModelToken)(blog_schema_1.Blog.name));
    logger.log('Starting comprehensive database seeding...');
    await Promise.all([
        userModel.deleteMany({}),
        tourModel.deleteMany({}),
        tourDateModel.deleteMany({}),
        bookingModel.deleteMany({}),
        transactionModel.deleteMany({}),
        reviewModel.deleteMany({}),
        couponModel.deleteMany({}),
        blogModel.deleteMany({}),
    ]);
    logger.log('Existing data cleared.');
    const salt = await bcrypt.genSalt(10);
    const commonPasswordHash = await bcrypt.hash('password123', salt);
    const admin = await userModel.create({
        name: 'System Admin',
        email: 'admin@test.com',
        phone: '+919876543210',
        passwordHash: commonPasswordHash,
        gender: gender_enum_1.Gender.MALE,
        role: roles_enum_1.Role.ADMIN,
        isVerified: true,
        contactAddress: 'Mumbai, India',
        country: 'India',
        dateOfBirth: new Date('1990-01-01'),
        lastLogin: new Date(),
    });
    const customers = await userModel.insertMany([
        {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+919999999991',
            passwordHash: commonPasswordHash,
            role: roles_enum_1.Role.CUSTOMER,
            isVerified: true,
            gender: gender_enum_1.Gender.MALE,
            country: 'USA',
            dateOfBirth: new Date('1985-06-15'),
            lastLogin: new Date(),
        },
        {
            name: 'Priya Sharma',
            email: 'priya@example.com',
            phone: '+919999999992',
            passwordHash: commonPasswordHash,
            role: roles_enum_1.Role.CUSTOMER,
            isVerified: true,
            gender: gender_enum_1.Gender.FEMALE,
            country: 'India',
            dateOfBirth: new Date('1992-09-21'),
            lastLogin: new Date(),
        },
        {
            name: 'Michael Chen',
            email: 'michael@example.com',
            phone: '+919999999993',
            passwordHash: commonPasswordHash,
            role: roles_enum_1.Role.CUSTOMER,
            isVerified: true,
            gender: gender_enum_1.Gender.MALE,
            country: 'Canada',
            dateOfBirth: new Date('1988-11-03'),
            lastLogin: new Date(),
        },
        {
            name: 'Anita Patel',
            email: 'anita@example.com',
            phone: '+919999999994',
            passwordHash: commonPasswordHash,
            role: roles_enum_1.Role.CUSTOMER,
            isVerified: true,
            gender: gender_enum_1.Gender.FEMALE,
            country: 'UK',
            dateOfBirth: new Date('1995-02-14'),
            lastLogin: new Date(),
        },
        {
            name: 'Carlos Mendez',
            email: 'carlos@example.com',
            phone: '+919999999995',
            passwordHash: commonPasswordHash,
            role: roles_enum_1.Role.CUSTOMER,
            isVerified: true,
            gender: gender_enum_1.Gender.MALE,
            country: 'Spain',
            dateOfBirth: new Date('1982-12-05'),
            lastLogin: new Date(),
        },
    ]);
    logger.log(`Seeded ${customers.length + 1} users.`);
    const toursData = [
        {
            title: 'Enchanting Ladakh Adventure',
            description: 'Experience the raw, breathtaking beauty of the Himalayas. This 7-day journey takes you through Pangong Lake, the mighty Khardung La Pass, ancient gompas, and the stark moonscapes of the Nubra Valley – a trip that redefines the meaning of adventure.',
            basePrice: 45000,
            category: tour_category_enum_1.TourCategory.ADVENTURE,
            location: 'Leh, Ladakh',
            state: 'Ladakh',
            country: 'India',
            duration: '7 Days / 6 Nights',
            minAge: 12,
            maxAge: 65,
            highlights: [
                'Pangong Tso Lake at sunrise',
                'Nubra Valley camel safari',
                'Khardung La Pass (5,359 m)',
                'Thiksey & Hemis Monastery',
            ],
            inclusions: [
                'Hotel + Camp Accommodation',
                'Internal Transfers by Innova',
                'All Permits',
                'Breakfast & Dinner',
            ],
            exclusions: [
                'Airfare to/from Leh',
                'Lunch',
                'Travel Insurance',
                'Personal expenses',
            ],
            faqs: [
                {
                    question: 'Is oxygen cylinder provided?',
                    answer: 'Yes, oxygen cylinders are carried in the backup vehicle.',
                },
            ],
            thumbnailImage: 'https://images.unsplash.com/photo-1581791534721-e599df4417f7?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1626084605051-bd1285226c06?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1535377786556-27d41e66a636?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                {
                    fromCity: 'Delhi',
                    toCity: 'Leh',
                    type: pickup_type_enum_1.PickupType.BOTH_SIDE_FLIGHT,
                    departureTimeAndPlace: '5:00 AM IGI T3',
                    totalDays: 7,
                    totalNights: 6,
                    priceAdjustment: 12000,
                },
                {
                    fromCity: 'Leh',
                    toCity: 'Leh',
                    type: pickup_type_enum_1.PickupType.THREE_TIER_AC_TRAIN,
                    departureTimeAndPlace: '9:00 AM Leh Airport',
                    totalDays: 7,
                    totalNights: 6,
                    priceAdjustment: 0,
                },
            ],
            itinerary: [
                {
                    dayNumber: 1,
                    title: 'Arrival in Leh – Acclimatization',
                    points: [
                        {
                            text: 'Arrive at Kushok Bakula Rimpochee Airport',
                            subPoints: [
                                'Transfer to hotel in Leh',
                                'Complete rest – avoid exertion',
                            ],
                        },
                    ],
                },
                {
                    dayNumber: 2,
                    title: 'Leh Local Sightseeing',
                    points: [
                        {
                            text: 'Visit city landmarks',
                            subPoints: ['Shanti Stupa', 'Leh Palace'],
                        },
                    ],
                },
                {
                    dayNumber: 3,
                    title: 'Leh – Nubra Valley via Khardung La',
                    points: [
                        { text: 'Cross Khardung La', subPoints: ['Arrive Hunder Village'] },
                    ],
                },
                {
                    dayNumber: 4,
                    title: 'Nubra Valley Exploration',
                    points: [
                        {
                            text: 'Diskit Monastery & Murals',
                            subPoints: ['Visit Panamik hot springs'],
                        },
                    ],
                },
                {
                    dayNumber: 5,
                    title: 'Nubra – Pangong Lake',
                    points: [
                        { text: 'Drive to Pangong Tso', subPoints: ['Sunset at the lake'] },
                    ],
                },
                {
                    dayNumber: 6,
                    title: 'Pangong – Leh',
                    points: [
                        {
                            text: 'Morning by the lake',
                            subPoints: ['Return to Leh via Chang La Pass'],
                        },
                    ],
                },
                {
                    dayNumber: 7,
                    title: 'Departure',
                    points: [{ text: 'Transfer to airport', subPoints: ['Tour ends'] }],
                },
            ],
            isFeatured: true,
            isActive: true,
            isDeleted: false,
            deletedAt: undefined,
            reviewCount: 0,
            averageRating: 0,
        },
        {
            title: 'Goa Coastal Bliss',
            description: 'Sun, sand, and soul – immerse yourself in the vibrant culture of North Goa. From water sports at Baga to the historic Aguada Fort, this 4-day getaway is the perfect escape from the ordinary.',
            basePrice: 15000,
            category: tour_category_enum_1.TourCategory.BEACH,
            location: 'Calangute, Goa',
            state: 'Goa',
            country: 'India',
            duration: '4 Days / 3 Nights',
            minAge: 5,
            maxAge: 70,
            highlights: [
                'Baga & Calangute Beach',
                'Aguada Fort & Chapora Fort',
                'Dudhsagar Waterfalls day trip',
                'Spice Plantation tour',
            ],
            inclusions: [
                '3-Star Hotel',
                'Pickup & Drop',
                'Daily Breakfast',
                'Sightseeing by AC cab',
            ],
            exclusions: [
                'Airfare',
                'Lunches & Dinners',
                'Water sports (paid separately)',
                'Entry fees',
            ],
            faqs: [
                {
                    question: 'Are water sports included?',
                    answer: 'No, they are optional and paid separately.',
                },
            ],
            thumbnailImage: 'https://images.unsplash.com/photo-1512783558244-97e3a6a9be27?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                {
                    fromCity: 'Mumbai',
                    toCity: 'Goa',
                    type: pickup_type_enum_1.PickupType.THREE_TIER_AC_TRAIN,
                    departureTimeAndPlace: '9:00 PM Borivali',
                    totalDays: 4,
                    totalNights: 3,
                    priceAdjustment: 2500,
                },
                {
                    fromCity: 'Goa',
                    toCity: 'Goa',
                    type: pickup_type_enum_1.PickupType.NON_AC_TRAIN,
                    departureTimeAndPlace: '12:00 PM Goa Airport',
                    totalDays: 4,
                    totalNights: 3,
                    priceAdjustment: 0,
                },
            ],
            itinerary: [
                {
                    dayNumber: 1,
                    title: 'Arrival & North Goa Beaches',
                    points: [
                        {
                            text: 'Check-in, Baga & Calangute',
                            subPoints: ['Sunset at Baga'],
                        },
                    ],
                },
                {
                    dayNumber: 2,
                    title: 'Fort Trail',
                    points: [
                        { text: 'Aguada & Chapora Forts', subPoints: ['Anjuna market'] },
                    ],
                },
                {
                    dayNumber: 3,
                    title: 'Dudhsagar & Spice Plantation',
                    points: [
                        { text: 'Day excursion to Dudhsagar', subPoints: ['Jeep safari'] },
                    ],
                },
                {
                    dayNumber: 4,
                    title: 'Departure',
                    points: [
                        {
                            text: 'Morning at leisure, check-out',
                            subPoints: ['Drop to station'],
                        },
                    ],
                },
            ],
            isFeatured: true,
            isActive: true,
            isDeleted: false,
            deletedAt: undefined,
            reviewCount: 0,
            averageRating: 0,
        },
        {
            title: 'Kerala Backwaters Serenity',
            description: 'Cruise through the emerald backwaters of Alleppey on a traditional kettuvallam houseboat. Watch the countryside glide by, savour authentic Kerala cuisine, and rejuvenate with an Ayurvedic massage.',
            basePrice: 22000,
            category: tour_category_enum_1.TourCategory.LEISURE,
            location: 'Alleppey, Kerala',
            state: 'Kerala',
            country: 'India',
            duration: '3 Days / 2 Nights',
            minAge: 0,
            maxAge: 85,
            highlights: [
                'Houseboat Overnight Stay',
                'Vembanad Lake',
                'Traditional Kerala Cuisine',
                'Ayurvedic Massage',
            ],
            inclusions: [
                'Premium Houseboat',
                'All Meals on Board',
                'Village Canoe Tour',
                'Cochin Airport Transfers',
            ],
            exclusions: ['Airfare', 'Alcohol', 'Tips', 'Personal shopping'],
            faqs: [
                {
                    question: 'Is the houseboat AC?',
                    answer: 'Yes, AC operates in the bedrooms from 9 PM to 6 AM.',
                },
            ],
            thumbnailImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1593181628399-3c35b80985c4?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1613997456065-0cdf03c70e7a?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                {
                    fromCity: 'Cochin',
                    toCity: 'Alleppey',
                    type: pickup_type_enum_1.PickupType.BOTH_SIDE_FLIGHT,
                    departureTimeAndPlace: '10:00 AM Cochin Airport',
                    totalDays: 3,
                    totalNights: 2,
                    priceAdjustment: 0,
                },
            ],
            itinerary: [
                {
                    dayNumber: 1,
                    title: 'Check-in & Cruise Begins',
                    points: [
                        {
                            text: 'Board the houseboat at noon',
                            subPoints: ['Welcome drink & lunch on board'],
                        },
                    ],
                },
                {
                    dayNumber: 2,
                    title: 'Village Life & Massage',
                    points: [
                        {
                            text: 'Early morning canoe ride',
                            subPoints: ['Ayurvedic massage session'],
                        },
                    ],
                },
                {
                    dayNumber: 3,
                    title: 'Disembark & Departure',
                    points: [
                        { text: 'Morning tea cruise', subPoints: ['Check-out by 09:00'] },
                    ],
                },
            ],
            isFeatured: false,
            isActive: true,
            isDeleted: false,
            deletedAt: undefined,
            reviewCount: 0,
            averageRating: 0,
        },
        {
            title: 'Royal Rajasthan Heritage Circuit',
            description: 'Traverse the golden sands and royal palaces of Rajasthan. From the pink city of Jaipur to the blue city of Jodhpur and the romantic city of Udaipur – this 10-day odyssey is pure royalty.',
            basePrice: 38000,
            category: tour_category_enum_1.TourCategory.CULTURAL,
            location: 'Jaipur, Rajasthan',
            state: 'Rajasthan',
            country: 'India',
            duration: '10 Days / 9 Nights',
            minAge: 8,
            maxAge: 75,
            highlights: [
                'Amber Fort, Jaipur',
                'Mehrangarh Fort, Jodhpur',
                'Lake Pichola, Udaipur',
                'Camel Safari, Jaisalmer',
            ],
            inclusions: [
                '4-Star Heritage Hotels',
                'AC Tempo Traveller',
                'All Breakfasts',
                'Guided Fort Tours',
            ],
            exclusions: [
                'Airfare',
                'Lunches & Dinners',
                'Entry fees at monuments',
                'Personal expenses',
            ],
            faqs: [
                {
                    question: 'Is the camel safari safe for kids?',
                    answer: 'Yes, guides will safely lead the camels.',
                },
            ],
            thumbnailImage: 'https://images.unsplash.com/photo-1557754897-ca12c5049d83?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                {
                    fromCity: 'Delhi',
                    toCity: 'Jaipur',
                    type: pickup_type_enum_1.PickupType.THREE_TIER_AC_TRAIN,
                    departureTimeAndPlace: '06:00 AM Delhi ISBT',
                    totalDays: 10,
                    totalNights: 9,
                    priceAdjustment: 2500,
                },
            ],
            itinerary: [
                {
                    dayNumber: 1,
                    title: 'Arrive Jaipur',
                    points: [
                        {
                            text: 'Check-in & orientation walk',
                            subPoints: ['Visit Hawa Mahal'],
                        },
                    ],
                },
                {
                    dayNumber: 2,
                    title: 'Jaipur Sightseeing',
                    points: [
                        { text: 'Amber Fort & City Palace', subPoints: ['Elephant ride'] },
                    ],
                },
                {
                    dayNumber: 3,
                    title: 'Jaipur – Jodhpur',
                    points: [
                        {
                            text: 'Drive to Jodhpur',
                            subPoints: ['Check-in to heritage haveli'],
                        },
                    ],
                },
                {
                    dayNumber: 4,
                    title: 'Jodhpur Blue City',
                    points: [{ text: 'Mehrangarh Fort', subPoints: ['Old city tour'] }],
                },
                {
                    dayNumber: 5,
                    title: 'Jodhpur – Jaisalmer',
                    points: [{ text: 'Drive to Jaisalmer', subPoints: ['Golden Fort'] }],
                },
                {
                    dayNumber: 6,
                    title: 'Jaisalmer Desert',
                    points: [{ text: 'Sam Sand Dunes', subPoints: ['Camel safari'] }],
                },
                {
                    dayNumber: 7,
                    title: 'Jaisalmer – Udaipur',
                    points: [{ text: 'Long drive day', subPoints: ['Ranakpur'] }],
                },
                {
                    dayNumber: 8,
                    title: 'Udaipur City of Lakes',
                    points: [
                        { text: 'City Palace', subPoints: ['Lake Pichola boat ride'] },
                    ],
                },
                {
                    dayNumber: 9,
                    title: 'Udaipur Leisure',
                    points: [
                        { text: 'Local shopping', subPoints: ['Saheliyon ki Bari'] },
                    ],
                },
                {
                    dayNumber: 10,
                    title: 'Departure',
                    points: [
                        { text: 'Drop to Udaipur Airport', subPoints: ['Tour concludes'] },
                    ],
                },
            ],
            isFeatured: true,
            isActive: true,
            isDeleted: false,
            deletedAt: undefined,
            reviewCount: 0,
            averageRating: 0,
        },
        {
            title: 'Spiti Valley Unexplored',
            description: 'Journey to one of the most remote and stunning cold deserts on Earth. Spiti Valley – with its arid landscape, fossil trails, and centuries-old monasteries – is for the true explorer.',
            basePrice: 35000,
            category: tour_category_enum_1.TourCategory.ADVENTURE,
            location: 'Kaza, Spiti Valley',
            state: 'Himachal Pradesh',
            country: 'India',
            duration: '9 Days / 8 Nights',
            minAge: 14,
            maxAge: 60,
            highlights: [
                'Key Monastery',
                'Chandratal Lake',
                'Kibber Village (highest motorable)',
                'Fossil Trail at Langza',
            ],
            inclusions: [
                'Guesthouses & Camps',
                'All Meals',
                '4WD SUV Transfers',
                'Expert Mountain Guide',
            ],
            exclusions: [
                'Airfare to Chandigarh',
                'Travel & Medical Insurance',
                'Personal gear',
                'Tips',
            ],
            faqs: [
                {
                    question: 'Is oxygen needed?',
                    answer: 'We carry emergency oxygen, but gradual acclimatization is key.',
                },
            ],
            thumbnailImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                {
                    fromCity: 'Chandigarh',
                    toCity: 'Kaza',
                    type: pickup_type_enum_1.PickupType.NON_AC_TRAIN,
                    departureTimeAndPlace: '5:00 AM Chandigarh Station',
                    totalDays: 9,
                    totalNights: 8,
                    priceAdjustment: 0,
                },
            ],
            itinerary: [
                {
                    dayNumber: 1,
                    title: 'Chandigarh – Narkanda',
                    points: [
                        {
                            text: 'Drive through foothils',
                            subPoints: ['Overnight at Narkanda'],
                        },
                    ],
                },
                {
                    dayNumber: 2,
                    title: 'Narkanda – Sangla',
                    points: [{ text: 'Kinnaur Valley', subPoints: ['Kamru Fort'] }],
                },
                {
                    dayNumber: 3,
                    title: 'Sangla – Chitkul – Kaza',
                    points: [{ text: 'Chitkul village', subPoints: ['Arrive Kaza'] }],
                },
                {
                    dayNumber: 4,
                    title: 'Key & Kibber',
                    points: [{ text: 'Key Monastery', subPoints: ['Chicham Bridge'] }],
                },
                {
                    dayNumber: 5,
                    title: 'Langza & Komic',
                    points: [
                        {
                            text: 'Fossil village',
                            subPoints: ['Highest inhabited village'],
                        },
                    ],
                },
                {
                    dayNumber: 6,
                    title: 'Pin Valley National Park',
                    points: [
                        { text: 'Snow leopard habitat', subPoints: ['Mudh village'] },
                    ],
                },
                {
                    dayNumber: 7,
                    title: 'Kaza – Chandratal Lake',
                    points: [{ text: 'Moon Lake', subPoints: ['Camp by the lake'] }],
                },
                {
                    dayNumber: 8,
                    title: 'Chandratal – Manali',
                    points: [
                        { text: 'Cross Rohtang Pass', subPoints: ['Arrive Manali'] },
                    ],
                },
                {
                    dayNumber: 9,
                    title: 'Departure from Manali',
                    points: [
                        { text: 'Morning leisure', subPoints: ['Drop to bus stand'] },
                    ],
                },
            ],
            isFeatured: false,
            isActive: true,
            isDeleted: false,
            deletedAt: undefined,
            reviewCount: 0,
            averageRating: 0,
        },
        {
            title: 'Andaman Island Escape',
            description: 'Crystal-clear waters, pristine coral reefs, and powder-white beaches – the Andaman Islands are a tropical paradise waiting to be explored. Snorkel with sea turtles, kayak through mangroves, and watch bioluminescent plankton.',
            basePrice: 28000,
            category: tour_category_enum_1.TourCategory.BEACH,
            location: 'Port Blair, Andaman',
            state: 'Andaman & Nicobar Islands',
            country: 'India',
            duration: '6 Days / 5 Nights',
            minAge: 5,
            maxAge: 70,
            highlights: [
                'Radhanagar Beach',
                'Scuba Diving at Neil Island',
                'Cellular Jail',
                'Bioluminescent Beach',
            ],
            inclusions: [
                'Beach Resorts & Guesthouses',
                'Ferry Tickets',
                'Breakfasts',
                'Snorkelling Gear',
            ],
            exclusions: [
                'Airfare to Port Blair',
                'Scuba Diving fees',
                'Lunches & Dinners',
                'Entry fees',
            ],
            faqs: [
                {
                    question: 'Do I need to know swimming for scuba?',
                    answer: 'No, non-swimmers can do DSD (Discover Scuba Diving).',
                },
            ],
            thumbnailImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1505881402582-c5bc11054f91?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                {
                    fromCity: 'Port Blair',
                    toCity: 'Port Blair',
                    type: pickup_type_enum_1.PickupType.NON_AC_TRAIN,
                    departureTimeAndPlace: '1:00 PM Port Blair Jetty',
                    totalDays: 6,
                    totalNights: 5,
                    priceAdjustment: 0,
                },
            ],
            itinerary: [
                {
                    dayNumber: 1,
                    title: 'Arrive Port Blair',
                    points: [{ text: 'Cellular Jail', subPoints: ['Hotel check-in'] }],
                },
                {
                    dayNumber: 2,
                    title: 'Port Blair Local',
                    points: [
                        { text: 'Ross Island', subPoints: ['North Bay snorkelling'] },
                    ],
                },
                {
                    dayNumber: 3,
                    title: 'Havelock Island',
                    points: [
                        {
                            text: 'Ferry to Havelock',
                            subPoints: ['Radhanagar Beach sunset'],
                        },
                    ],
                },
                {
                    dayNumber: 4,
                    title: 'Havelock Adventure',
                    points: [
                        {
                            text: 'Scuba diving (optional)',
                            subPoints: ['Bioluminescent beach'],
                        },
                    ],
                },
                {
                    dayNumber: 5,
                    title: 'Neil Island',
                    points: [
                        { text: 'Ferry to Neil Island', subPoints: ['Natural Bridge'] },
                    ],
                },
                {
                    dayNumber: 6,
                    title: 'Departure',
                    points: [
                        { text: 'Return to Port Blair', subPoints: ['Drop to airport'] },
                    ],
                },
            ],
            isFeatured: true,
            isActive: true,
            isDeleted: false,
            deletedAt: undefined,
            reviewCount: 0,
            averageRating: 0,
        },
        {
            title: 'Coorg Coffee & Mist',
            description: "Nestled in the Western Ghats, Coorg (Kodagu) is Karnataka's most scenic hill station. Wake up to fog-kissed coffee estates, trek to Abbey Falls, and taste authentic Kodava cuisine.",
            basePrice: 12000,
            category: tour_category_enum_1.TourCategory.NATURE,
            location: 'Madikeri, Coorg',
            state: 'Karnataka',
            country: 'India',
            duration: '3 Days / 2 Nights',
            minAge: 2,
            maxAge: 85,
            highlights: [
                'Abbey Falls',
                "Raja's Seat sunset",
                'Coffee Estate Walk',
                'Dubare Elephant Camp',
            ],
            inclusions: [
                'Homestay on Coffee Estate',
                'Breakfast & Dinner',
                'Sightseeing by cab',
                'Coffee tasting session',
            ],
            exclusions: [
                'Travel to Madikeri',
                'Lunches',
                'Elephant ride fees',
                'Personal purchases',
            ],
            faqs: [
                {
                    question: 'Is the homestay inside an estate?',
                    answer: 'Yes, nestled deep within a functioning coffee plantation.',
                },
            ],
            thumbnailImage: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                {
                    fromCity: 'Bangalore',
                    toCity: 'Madikeri',
                    type: pickup_type_enum_1.PickupType.THREE_TIER_AC_TRAIN,
                    departureTimeAndPlace: '06:00 AM Majestic Bus Stand',
                    totalDays: 3,
                    totalNights: 2,
                    priceAdjustment: 1200,
                },
            ],
            itinerary: [
                {
                    dayNumber: 1,
                    title: 'Arrive & Explore Madikeri',
                    points: [
                        { text: "Raja's Seat & Abbey Falls", subPoints: ['Madikeri Fort'] },
                    ],
                },
                {
                    dayNumber: 2,
                    title: 'Coffee Estate & Dubare',
                    points: [
                        {
                            text: 'Morning estate walk',
                            subPoints: ['Dubare Elephant Camp'],
                        },
                    ],
                },
                {
                    dayNumber: 3,
                    title: 'Iruppu Falls & Departure',
                    points: [
                        {
                            text: 'Visit Iruppu Falls',
                            subPoints: ['Return to Bangalore by evening'],
                        },
                    ],
                },
            ],
            isFeatured: false,
            isActive: true,
            isDeleted: false,
            deletedAt: undefined,
            reviewCount: 0,
            averageRating: 0,
        },
        {
            title: 'Varanasi – The Eternal City',
            description: "One of the world's oldest living cities, Varanasi offers a profound spiritual journey. Witness the Ganga Aarti, sail on the sacred Ganges at dawn, and experience the timeless ghats of Kashi.",
            basePrice: 18000,
            category: tour_category_enum_1.TourCategory.SPIRITUAL,
            location: 'Varanasi, Uttar Pradesh',
            state: 'Uttar Pradesh',
            country: 'India',
            duration: '4 Days / 3 Nights',
            minAge: 5,
            maxAge: 90,
            highlights: [
                'Ganga Aarti at Dashashwamedh Ghat',
                'Dawn boat ride',
                'Sarnath Buddhist Circuit',
                'Old City Lane Walk',
            ],
            inclusions: [
                'Heritage Hotel near Ghats',
                'Boat Rides',
                'Guided Walks',
                'Breakfasts',
            ],
            exclusions: [
                'Airfare/Train',
                'Lunch & Dinner',
                'Puja materials',
                'Personal expenses',
            ],
            faqs: [
                {
                    question: 'Is hotel near the ghats?',
                    answer: 'Yes, just a 5-minute walk to Dashashwamedh Ghat.',
                },
            ],
            thumbnailImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1590123600223-e03e74c6dc31?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                {
                    fromCity: 'Varanasi',
                    toCity: 'Varanasi',
                    type: pickup_type_enum_1.PickupType.THREE_TIER_AC_TRAIN,
                    departureTimeAndPlace: '12:00 PM Varanasi Airport/Station',
                    totalDays: 4,
                    totalNights: 3,
                    priceAdjustment: 0,
                },
            ],
            itinerary: [
                {
                    dayNumber: 1,
                    title: 'Arrive & Ganga Aarti',
                    points: [
                        {
                            text: 'Evening Dashashwamedh Aarti',
                            subPoints: ['Orientation walk'],
                        },
                    ],
                },
                {
                    dayNumber: 2,
                    title: 'Dawn Boat Ride & Ghats',
                    points: [
                        {
                            text: '5:00 AM sunrise boat ride',
                            subPoints: ['Sarnath excursion afternoon'],
                        },
                    ],
                },
                {
                    dayNumber: 3,
                    title: 'Old City Walk & Bazaar',
                    points: [
                        { text: 'Vishwanath Gali', subPoints: ['Banaras chaat lunch'] },
                    ],
                },
                {
                    dayNumber: 4,
                    title: 'Morning Yoga & Departure',
                    points: [
                        {
                            text: 'Ghat-side yoga session',
                            subPoints: ['Transfer to airport'],
                        },
                    ],
                },
            ],
            isFeatured: false,
            isActive: false,
            isDeleted: false,
            deletedAt: undefined,
            reviewCount: 0,
            averageRating: 0,
        },
    ];
    const seededTours = [];
    for (const t of toursData) {
        const slug = (0, slugify_1.default)(t.title, { lower: true, strict: true });
        const tour = await tourModel.create({ ...t, slug });
        seededTours.push(tour);
    }
    logger.log(`Seeded ${seededTours.length} tours.`);
    const datePatterns = [
        {
            startOffset: -40,
            status: tour_date_status_enum_1.TourDateStatus.COMPLETED,
            totalSeats: 20,
            bookedSeats: 20,
        },
        {
            startOffset: -10,
            status: tour_date_status_enum_1.TourDateStatus.CANCELLED,
            totalSeats: 18,
            bookedSeats: 0,
        },
        {
            startOffset: 15,
            status: tour_date_status_enum_1.TourDateStatus.UPCOMING,
            totalSeats: 20,
            bookedSeats: 14,
        },
        {
            startOffset: 30,
            status: tour_date_status_enum_1.TourDateStatus.UPCOMING,
            totalSeats: 25,
            bookedSeats: 3,
        },
        {
            startOffset: 60,
            status: tour_date_status_enum_1.TourDateStatus.UPCOMING,
            totalSeats: 25,
            bookedSeats: 0,
        },
        {
            startOffset: 120,
            status: tour_date_status_enum_1.TourDateStatus.UPCOMING,
            totalSeats: 30,
            bookedSeats: 0,
        },
    ];
    const daysFromNow = (n) => {
        const d = new Date();
        d.setDate(d.getDate() + n);
        return d;
    };
    const addDays = (date, n) => new Date(date.getTime() + n * 86_400_000);
    const seededTourDates = [];
    for (const tour of seededTours) {
        const duration = (tour.departureOptions[0]?.totalDays ?? 5) - 1;
        for (const p of datePatterns) {
            const start = daysFromNow(p.startOffset);
            const tdate = await tourDateModel.create({
                tour: tour._id,
                startDate: start,
                endDate: addDays(start, duration),
                totalSeats: p.totalSeats,
                bookedSeats: p.bookedSeats,
                status: p.status,
                priceOverride: p.startOffset < 0
                    ? undefined
                    : p.startOffset <= 20
                        ? tour.basePrice * 0.9
                        : undefined,
            });
            seededTourDates.push(tdate);
        }
    }
    logger.log(`Seeded ${seededTourDates.length} tour dates.`);
    await couponModel.insertMany([
        {
            code: 'WELCOME10',
            description: '10% off for new users',
            discountType: coupon_enum_1.CouponType.PERCENT,
            discountValue: 10,
            minOrderAmount: 5000,
            maxDiscountAmount: 2000,
            expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
            isActive: true,
            maxUsage: 100,
            usedCount: 15,
        },
        {
            code: 'SUMMERFLAT500',
            description: 'Rs 500 off on all tours',
            discountType: coupon_enum_1.CouponType.FLAT,
            discountValue: 500,
            minOrderAmount: 2000,
            expiryDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
            isActive: true,
            maxUsage: 500,
            usedCount: 22,
        },
    ]);
    logger.log('Seeded coupons.');
    const c1 = customers[0];
    const c2 = customers[1];
    const c3 = customers[2];
    const tour1 = seededTours[0];
    const date1 = seededTourDates.find((d) => d.tour.toString() === tour1._id.toString() &&
        d.status === tour_date_status_enum_1.TourDateStatus.UPCOMING);
    const b1 = await bookingModel.create({
        bookingNumber: 'BK-100001',
        user: c1._id,
        tour: tour1._id,
        tourDate: date1?._id,
        pickupOption: tour1.departureOptions[0],
        travelers: [
            {
                fullName: 'John Doe',
                age: 39,
                gender: gender_enum_1.Gender.MALE,
                phone: c1.phone,
                idNumber: 'AD100',
            },
            {
                fullName: 'Jane Doe',
                age: 36,
                gender: gender_enum_1.Gender.FEMALE,
                phone: c1.phone,
                idNumber: 'AD101',
            },
        ],
        totalTravelers: 2,
        baseAmount: 90000,
        discountAmount: 2000,
        couponCode: 'WELCOME10',
        totalAmount: 92400,
        taxAmount: 4400,
        taxRate: 5,
        perPersonPrice: 45000,
        paidAmount: 92400,
        pendingAmount: 0,
        paymentType: booking_status_enum_1.PaymentType.ONLINE,
        status: booking_status_enum_1.BookingStatus.CONFIRMED,
        pricingSummary: 'Seeded pricing',
        paymentVerifiedAt: new Date(),
    });
    await transactionModel.create({
        user: c1._id,
        booking: b1._id,
        amount: b1.totalAmount,
        type: transaction_enum_1.TransactionType.ONLINE_RECEIPT,
        status: transaction_enum_1.TransactionStatus.SUCCESS,
        transactionId: 'TXN-001',
        paymentMethod: 'Credit Card',
        processedAt: new Date(),
        description: 'Seeded online payment',
    });
    const tour2 = seededTours[2];
    const date2 = seededTourDates.find((d) => d.tour.toString() === tour2._id.toString() &&
        d.status === tour_date_status_enum_1.TourDateStatus.COMPLETED);
    const b2 = await bookingModel.create({
        bookingNumber: 'BK-200002',
        user: c2._id,
        tour: tour2._id,
        tourDate: date2?._id,
        pickupOption: tour2.departureOptions[0],
        travelers: [
            {
                fullName: 'Priya Sharma',
                age: 32,
                gender: gender_enum_1.Gender.FEMALE,
                phone: c2.phone,
                idNumber: 'PR221',
            },
        ],
        totalTravelers: 1,
        baseAmount: 22000,
        discountAmount: 0,
        totalAmount: 23100,
        taxAmount: 1100,
        taxRate: 5,
        perPersonPrice: 22000,
        paidAmount: 23100,
        pendingAmount: 0,
        paymentType: booking_status_enum_1.PaymentType.ONLINE,
        status: booking_status_enum_1.BookingStatus.COMPLETED,
        pricingSummary: 'Seeded completed',
        paymentVerifiedAt: new Date(),
    });
    await transactionModel.create({
        user: c2._id,
        booking: b2._id,
        amount: b2.totalAmount,
        type: transaction_enum_1.TransactionType.ONLINE_RECEIPT,
        status: transaction_enum_1.TransactionStatus.SUCCESS,
        transactionId: 'TXN-002',
        paymentMethod: 'UPI',
        processedAt: new Date(),
        description: 'Seeded online payment',
    });
    logger.log('Seeded bookings, payments, and transactions.');
    await reviewModel.insertMany([
        {
            user: c2._id,
            tour: tour2._id,
            booking: b2._id,
            rating: 5,
            comment: 'Absolutely amazing houseboat trip! The staff was wonderful.',
            status: review_status_enum_1.ReviewStatus.APPROVED,
        },
        {
            user: c1._id,
            tour: tour1._id,
            booking: b1._id,
            rating: 4,
            comment: 'I havent gone yet, but the booking process was extremely smooth.',
            status: review_status_enum_1.ReviewStatus.PENDING,
        },
    ]);
    tour2.reviewCount = 1;
    tour2.averageRating = 5;
    await tour2.save();
    logger.log('Seeded reviews.');
    await blogModel.create({
        title: 'Top 10 Things to Pack for Ladakh',
        slug: 'top-10-things-to-pack-for-ladakh',
        content: `<h2>Why Packing Smart Matters in Ladakh</h2><p>Ladakh sits at over 3,500 metres above sea level. The air is thin, the UV index is brutal, and temperatures can swing 25°C between day and night. Here's exactly what you need.</p><ol><li><strong>Thermal inner wear</strong> – Merino wool is king.</li><li><strong>Heavy down jacket</strong> – Even in June, nights dip below 5°C.</li><li><strong>Sunscreen SPF 50+</strong> – Protect yourself.</li></ol>`,
        excerpt: 'High altitude, extreme weather, and limited shops – packing right can make or break your Ladakh adventure.',
        category: blog_category_enum_1.BlogCategory.TRAVEL_TIPS,
        tags: ['Ladakh', 'Packing', 'Adventure'],
        featuredImage: 'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=1600&auto=format&fit=crop',
        isPublished: true,
        author: admin._id,
    }, {
        title: 'Best Time to Visit Goa: Month-by-Month Guide',
        slug: 'best-time-to-visit-goa-month-by-month',
        excerpt: 'From peak season crowds to monsoon magic, here is the definitive guide on when to visit Goa.',
        content: `<h2>Goa All Year Round</h2><p>Most tourists flock between November and February when the skies are clear and the sea is calm. But savvy travellers know that the monsoon season transforms Goa into a lush, uncrowded paradise.</p>`,
        category: blog_category_enum_1.BlogCategory.DESTINATION_GUIDE,
        tags: ['Goa', 'Beach', 'Travel Planning'],
        featuredImage: 'https://images.unsplash.com/photo-1512783558244-97e3a6a9be27?q=80&w=1600&auto=format&fit=crop',
        isPublished: true,
        author: admin._id,
    }, {
        title: 'Solo Travel in India: Safety & Hidden Gems',
        slug: 'solo-travel-india-safety',
        excerpt: 'India can feel overwhelming for first-time solo travellers. Here is how to navigate it with confidence.',
        content: `<h2>Safety Basics</h2><p>Share your itinerary with someone at home. Use UPI-based apps like Google Pay to avoid carrying large amounts of cash. Stick to reputable hostels.</p>`,
        category: blog_category_enum_1.BlogCategory.SOLO_TRAVEL,
        tags: ['Solo Travel', 'India', 'Safety'],
        featuredImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1600&auto=format&fit=crop',
        isPublished: true,
        author: admin._id,
    }, {
        title: 'Spiti Valley Road Trip: 2025 Itinerary',
        slug: 'spiti-valley-road-trip-2025',
        excerpt: 'Frozen rivers, ancient monasteries, and roads that touch the sky.',
        content: `<h2>The Route</h2><p>The classic Spiti circuit is done as a loop: Shimla → Sangla → Chitkul → Tabo → Kaza → Chandratal → Manali.</p>`,
        category: blog_category_enum_1.BlogCategory.ROAD_TRIPS,
        tags: ['Spiti', 'Road Trip', 'Himachal Pradesh'],
        featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop',
        isPublished: false,
        author: admin._id,
    });
    logger.log('Seeded blogs.');
    logger.log('================================================================');
    logger.log('✅ Comprehensive Database Seeding Completed Successfully! 🎉');
    logger.log('1 Admin created.');
    logger.log('5 Customers created.');
    logger.log('8 Tours (7 Active, 1 Draft) created.');
    logger.log('48 Tour Dates generated.');
    logger.log('2 Coupons generated.');
    logger.log('2 Bookings & Transactions generated.');
    logger.log('4 Blog Posts generated.');
    logger.log('================================================================');
    logger.log('Admin Email: admin@test.com');
    logger.log('Admin / Customer Password: password123');
    logger.log('================================================================');
    await app.close();
    process.exit(0);
}
bootstrap().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map