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
const payment_schema_1 = require("./database/schemas/payment.schema");
const transaction_schema_1 = require("./database/schemas/transaction.schema");
const coupon_schema_1 = require("./database/schemas/coupon.schema");
const blog_schema_1 = require("./database/schemas/blog.schema");
const roles_enum_1 = require("./common/enums/roles.enum");
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
    const paymentModel = app.get((0, mongoose_1.getModelToken)(payment_schema_1.Payment.name));
    const transactionModel = app.get((0, mongoose_1.getModelToken)(transaction_schema_1.Transaction.name));
    const reviewModel = app.get((0, mongoose_1.getModelToken)('Review'));
    const couponModel = app.get((0, mongoose_1.getModelToken)(coupon_schema_1.Coupon.name));
    const blogModel = app.get((0, mongoose_1.getModelToken)(blog_schema_1.Blog.name));
    logger.log('Starting database seeding...');
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
    const salt = await bcrypt.genSalt(10);
    const commonPasswordHash = await bcrypt.hash('password123', salt);
    const admin = await userModel.create({
        name: 'System Admin',
        email: 'admin@test.com',
        phone: '+919876543210',
        passwordHash: commonPasswordHash,
        role: roles_enum_1.Role.ADMIN,
        isVerified: true,
    });
    const customers = await userModel.insertMany([
        {
            name: 'John Doe',
            email: 'john@example.com',
            phone: '+919999999991',
            passwordHash: commonPasswordHash,
            role: roles_enum_1.Role.CUSTOMER,
            isVerified: true,
            gender: 'male',
            country: 'USA',
        },
        {
            name: 'Priya Sharma',
            email: 'priya@example.com',
            phone: '+919999999992',
            passwordHash: commonPasswordHash,
            role: roles_enum_1.Role.CUSTOMER,
            isVerified: true,
            gender: 'female',
            country: 'India',
        },
        {
            name: 'Michael Chen',
            email: 'michael@example.com',
            phone: '+919999999993',
            passwordHash: commonPasswordHash,
            role: roles_enum_1.Role.CUSTOMER,
            isVerified: true,
            gender: 'male',
            country: 'Canada',
        }
    ]);
    logger.log(`Seeded ${customers.length + 1} users.`);
    const toursData = [
        {
            title: 'Enchanting Ladakh Adventure',
            description: 'Experience the raw, breathtaking beauty of the Himalayas. This 7-day journey takes you through Pangong Lake, the mighty Khardung La Pass, ancient gompas, and the stark moonscapes of the Nubra Valley – a trip that redefines the meaning of adventure.',
            basePrice: 45000,
            category: 'Adventure',
            location: 'Leh, Ladakh',
            state: 'Ladakh',
            country: 'India',
            duration: '7 Days / 6 Nights',
            maxGroupSize: 20,
            difficultyLevel: 'moderate',
            highlights: [
                'Pangong Tso Lake at sunrise',
                'Nubra Valley camel safari',
                'Khardung La Pass (5,359 m)',
                'Thiksey & Hemis Monastery',
            ],
            inclusions: ['Hotel + Camp Accommodation', 'Internal Transfers by Innova', 'All Permits', 'Breakfast & Dinner'],
            exclusions: ['Airfare to/from Leh', 'Lunch', 'Travel Insurance', 'Personal expenses'],
            thumbnailImage: 'https://images.unsplash.com/photo-1581791534721-e599df4417f7?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1626084605051-bd1285226c06?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1535377786556-27d41e66a636?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                { fromCity: 'Delhi', toCity: 'Leh', type: 'FLIGHT', totalDays: 7, totalNights: 6, priceAdjustment: 12000 },
                { fromCity: 'Leh', toCity: 'Leh', type: 'AC', totalDays: 7, totalNights: 6, priceAdjustment: 0 },
            ],
            itinerary: [
                {
                    dayNumber: 1,
                    title: 'Arrival in Leh – Acclimatization',
                    points: [
                        {
                            text: 'Arrive at Kushok Bakula Rimpochee Airport',
                            subPoints: ['Transfer to hotel in Leh', 'Complete rest – avoid exertion', 'Briefing by tour manager'],
                        },
                    ],
                },
                {
                    dayNumber: 2,
                    title: 'Leh Local Sightseeing',
                    points: [
                        {
                            text: 'Visit city landmarks',
                            subPoints: ['Shanti Stupa', 'Leh Palace', 'Hall of Fame Museum', 'Leh Market walk'],
                        },
                    ],
                },
                {
                    dayNumber: 3,
                    title: 'Leh – Nubra Valley via Khardung La',
                    points: [
                        {
                            text: 'Cross Khardung La (5,359 m)',
                            subPoints: ["Stop at the world's highest motorable road", 'Arrive Hunder Village', 'Bactrian camel safari at sand dunes'],
                        },
                    ],
                },
                {
                    dayNumber: 4,
                    title: 'Nubra Valley Exploration',
                    points: [
                        {
                            text: 'Diskit Monastery & Murals',
                            subPoints: ['50-foot Maitreya Buddha statue', 'Visit Panamik hot springs'],
                        },
                    ],
                },
                {
                    dayNumber: 5,
                    title: 'Nubra – Pangong Lake',
                    points: [
                        {
                            text: 'Drive to Pangong Tso via Shyok route',
                            subPoints: ['Arrive by afternoon', 'Sunset at the lake', 'Camp stay on the banks'],
                        },
                    ],
                },
                {
                    dayNumber: 6,
                    title: 'Pangong – Leh',
                    points: [
                        {
                            text: 'Morning by the lake',
                            subPoints: ['Sunrise photography', 'Return to Leh via Chang La Pass'],
                        },
                    ],
                },
                {
                    dayNumber: 7,
                    title: 'Departure',
                    points: [
                        {
                            text: 'Transfer to airport / bus stand',
                            subPoints: ['Tour ends with beautiful memories'],
                        },
                    ],
                },
            ],
            isFeatured: true,
            isActive: true,
            averageRating: 4.8,
            totalReviews: 0,
        },
        {
            title: 'Goa Coastal Bliss',
            description: 'Sun, sand, and soul – immerse yourself in the vibrant culture of North Goa. From water sports at Baga to the historic Aguada Fort, this 4-day getaway is the perfect escape from the ordinary.',
            basePrice: 15000,
            category: 'Beach',
            location: 'Calangute, Goa',
            state: 'Goa',
            country: 'India',
            duration: '4 Days / 3 Nights',
            maxGroupSize: 30,
            difficultyLevel: 'easy',
            highlights: [
                'Baga & Calangute Beach',
                'Aguada Fort & Chapora Fort',
                'Dudhsagar Waterfalls day trip',
                'Spice Plantation tour',
            ],
            inclusions: ['3-Star Hotel', 'Pickup & Drop', 'Daily Breakfast', 'Sightseeing by AC cab'],
            exclusions: ['Airfare', 'Lunches & Dinners', 'Water sports (paid separately)', 'Entry fees'],
            thumbnailImage: 'https://images.unsplash.com/photo-1512783558244-97e3a6a9be27?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                { fromCity: 'Mumbai', toCity: 'Goa', type: 'AC', totalDays: 4, totalNights: 3, priceAdjustment: 2500 },
                { fromCity: 'Pune', toCity: 'Goa', type: 'AC', totalDays: 4, totalNights: 3, priceAdjustment: 1800 },
                { fromCity: 'Goa', toCity: 'Goa', type: 'NON-AC', totalDays: 4, totalNights: 3, priceAdjustment: 0 },
            ],
            itinerary: [
                {
                    dayNumber: 1,
                    title: 'Arrival & North Goa Beaches',
                    points: [{ text: 'Check-in, Baga & Calangute', subPoints: ['Sunset at Baga', 'Dinner at beach shack'] }],
                },
                {
                    dayNumber: 2,
                    title: 'Fort Trail',
                    points: [{ text: 'Aguada & Chapora Forts', subPoints: ['Anjuna market', 'Curlies beach café'] }],
                },
                {
                    dayNumber: 3,
                    title: 'Dudhsagar & Spice Plantation',
                    points: [{ text: 'Day excursion to Dudhsagar', subPoints: ['Jeep safari', 'Spice plantation lunch'] }],
                },
                {
                    dayNumber: 4,
                    title: 'Departure',
                    points: [{ text: 'Morning at leisure, check-out', subPoints: ['Drop to station/airport'] }],
                },
            ],
            isFeatured: true,
            isActive: true,
            averageRating: 4.5,
            totalReviews: 0,
        },
        {
            title: 'Kerala Backwaters Serenity',
            description: 'Cruise through the emerald backwaters of Alleppey on a traditional kettuvallam houseboat. Watch the countryside glide by, savour authentic Kerala cuisine, and rejuvenate with an Ayurvedic massage.',
            basePrice: 22000,
            category: 'Leisure',
            location: 'Alleppey, Kerala',
            state: 'Kerala',
            country: 'India',
            duration: '3 Days / 2 Nights',
            maxGroupSize: 12,
            difficultyLevel: 'easy',
            highlights: ['Houseboat Overnight Stay', 'Vembanad Lake', 'Traditional Kerala Cuisine', 'Ayurvedic Massage'],
            inclusions: ['Premium Houseboat', 'All Meals on Board', 'Village Canoe Tour', 'Cochin Airport Transfers'],
            exclusions: ['Airfare', 'Alcohol', 'Tips', 'Personal shopping'],
            thumbnailImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1593181628399-3c35b80985c4?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1613997456065-0cdf03c70e7a?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                { fromCity: 'Cochin', toCity: 'Alleppey', type: 'AC', totalDays: 3, totalNights: 2, priceAdjustment: 0 },
                { fromCity: 'Trivandrum', toCity: 'Alleppey', type: 'AC', totalDays: 3, totalNights: 2, priceAdjustment: 1500 },
            ],
            itinerary: [
                {
                    dayNumber: 1,
                    title: 'Check-in & Cruise Begins',
                    points: [{ text: 'Board the houseboat at noon', subPoints: ['Welcome drink & lunch on board', 'Afternoon cruise through narrow canals'] }],
                },
                {
                    dayNumber: 2,
                    title: 'Village Life & Massage',
                    points: [{ text: 'Early morning canoe ride', subPoints: ['Visit local toddy shop', 'Ayurvedic massage session', 'Sunset from the roof deck'] }],
                },
                {
                    dayNumber: 3,
                    title: 'Disembark & Departure',
                    points: [{ text: 'Morning tea cruise', subPoints: ['Check-out by 09:00', 'Transfer to Cochin Airport'] }],
                },
            ],
            isFeatured: false,
            isActive: true,
            averageRating: 4.7,
            totalReviews: 0,
        },
        {
            title: 'Royal Rajasthan Heritage Circuit',
            description: 'Traverse the golden sands and royal palaces of Rajasthan. From the pink city of Jaipur to the blue city of Jodhpur and the romantic city of Udaipur – this 10-day odyssey is pure royalty.',
            basePrice: 38000,
            category: 'Cultural',
            location: 'Jaipur, Rajasthan',
            state: 'Rajasthan',
            country: 'India',
            duration: '10 Days / 9 Nights',
            maxGroupSize: 24,
            difficultyLevel: 'easy',
            highlights: ['Amber Fort, Jaipur', 'Mehrangarh Fort, Jodhpur', 'Lake Pichola, Udaipur', 'Camel Safari, Jaisalmer'],
            inclusions: ['4-Star Heritage Hotels', 'AC Tempo Traveller', 'All Breakfasts', 'Guided Fort Tours'],
            exclusions: ['Airfare', 'Lunches & Dinners', 'Entry fees at monuments', 'Personal expenses'],
            thumbnailImage: 'https://images.unsplash.com/photo-1557754897-ca12c5049d83?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1587474260584-136574528ed5?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                { fromCity: 'Delhi', toCity: 'Jaipur', type: 'FLIGHT', totalDays: 10, totalNights: 9, priceAdjustment: 8000 },
                { fromCity: 'Delhi', toCity: 'Jaipur', type: 'AC', totalDays: 10, totalNights: 9, priceAdjustment: 2500 },
            ],
            itinerary: [
                { dayNumber: 1, title: 'Arrive Jaipur', points: [{ text: 'Check-in & orientation walk', subPoints: ['Visit Hawa Mahal exterior at dusk'] }] },
                { dayNumber: 2, title: 'Jaipur Sightseeing', points: [{ text: 'Amber Fort & City Palace', subPoints: ['Elephant ride at Amber', 'Jantar Mantar'] }] },
                { dayNumber: 3, title: 'Jaipur – Jodhpur', points: [{ text: 'Drive to Jodhpur (6 hrs)', subPoints: ['Check-in to heritage haveli'] }] },
                { dayNumber: 4, title: 'Jodhpur Blue City', points: [{ text: 'Mehrangarh Fort & Jaswant Thada', subPoints: ['Old city walking tour', 'Blue-painted houses of Brahmpuri'] }] },
                { dayNumber: 5, title: 'Jodhpur – Jaisalmer', points: [{ text: 'Drive to Jaisalmer (3 hrs)', subPoints: ['Golden Fort darshan'] }] },
                { dayNumber: 6, title: 'Jaisalmer Desert', points: [{ text: 'Sam Sand Dunes', subPoints: ['Camel safari', 'Cultural performance & dinner under stars'] }] },
                { dayNumber: 7, title: 'Jaisalmer – Udaipur', points: [{ text: 'Long drive day', subPoints: ['Stop at Ranakpur Jain Temples'] }] },
                { dayNumber: 8, title: 'Udaipur City of Lakes', points: [{ text: 'City Palace & Lake Pichola', subPoints: ['Boat ride at sunset', 'Bagore ki Haveli show'] }] },
                { dayNumber: 9, title: 'Udaipur Leisure', points: [{ text: 'Local shopping & spa', subPoints: ['Saheliyon ki Bari gardens'] }] },
                { dayNumber: 10, title: 'Departure', points: [{ text: 'Drop to Udaipur Airport / Station', subPoints: ['Tour concludes'] }] },
            ],
            isFeatured: true,
            isActive: true,
            averageRating: 4.6,
            totalReviews: 0,
        },
        {
            title: 'Spiti Valley Unexplored',
            description: 'Journey to one of the most remote and stunning cold deserts on Earth. Spiti Valley – with its arid landscape, fossil trails, and centuries-old monasteries – is for the true explorer.',
            basePrice: 35000,
            category: 'Adventure',
            location: 'Kaza, Spiti Valley',
            state: 'Himachal Pradesh',
            country: 'India',
            duration: '9 Days / 8 Nights',
            maxGroupSize: 16,
            difficultyLevel: 'challenging',
            highlights: ['Key Monastery', 'Chandratal Lake', 'Kibber Village (highest motorable village)', 'Fossil Trail at Langza'],
            inclusions: ['Guesthouses & Camps', 'All Meals', '4WD SUV Transfers', 'Expert Mountain Guide'],
            exclusions: ['Airfare to Chandigarh', 'Travel & Medical Insurance', 'Personal gear', 'Tips'],
            thumbnailImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1508193638397-1c4234db14d8?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1520175480921-4edfa2983e0f?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                { fromCity: 'Chandigarh', toCity: 'Kaza', type: 'NON-AC', totalDays: 9, totalNights: 8, priceAdjustment: 0 },
                { fromCity: 'Manali', toCity: 'Kaza', type: 'NON-AC', totalDays: 9, totalNights: 8, priceAdjustment: -3000 },
            ],
            itinerary: [
                { dayNumber: 1, title: 'Chandigarh – Narkanda', points: [{ text: 'Drive through Himachal foothills', subPoints: ['Overnight at Narkanda'] }] },
                { dayNumber: 2, title: 'Narkanda – Sangla', points: [{ text: 'Kinnaur Valley entry', subPoints: ['Kamru Fort visit'] }] },
                { dayNumber: 3, title: 'Sangla – Chitkul – Kaza', points: [{ text: 'Chitkul: India\'s last village', subPoints: ['Cross Spiti border', 'Arrive Kaza'] }] },
                { dayNumber: 4, title: 'Key & Kibber', points: [{ text: 'Key Monastery', subPoints: ['4,166 m altitude', 'Kibber & Chicham Bridge'] }] },
                { dayNumber: 5, title: 'Langza & Komic', points: [{ text: 'Fossil village Langza', subPoints: ['Komic – highest inhabited village with a monastery'] }] },
                { dayNumber: 6, title: 'Pin Valley National Park', points: [{ text: 'Snow leopard habitat', subPoints: ['Mudh village', 'Wildflower meadows'] }] },
                { dayNumber: 7, title: 'Kaza – Chandratal Lake', points: [{ text: 'Moon Lake at 4,300 m', subPoints: ['Camp by the turquoise lake', 'Stargazing'] }] },
                { dayNumber: 8, title: 'Chandratal – Manali', points: [{ text: 'Cross Rohtang Pass', subPoints: ['Arrive Manali by evening'] }] },
                { dayNumber: 9, title: 'Departure from Manali', points: [{ text: 'Morning leisure', subPoints: ['Drop to bus stand / Bhuntar Airport'] }] },
            ],
            isFeatured: false,
            isActive: true,
            averageRating: 4.9,
            totalReviews: 0,
        },
        {
            title: 'Andaman Island Escape',
            description: 'Crystal-clear waters, pristine coral reefs, and powder-white beaches – the Andaman Islands are a tropical paradise waiting to be explored. Snorkel with sea turtles, kayak through mangroves, and watch bioluminescent plankton.',
            basePrice: 28000,
            category: 'Beach',
            location: 'Port Blair, Andaman',
            state: 'Andaman & Nicobar Islands',
            country: 'India',
            duration: '6 Days / 5 Nights',
            maxGroupSize: 20,
            difficultyLevel: 'easy',
            highlights: ['Radhanagar Beach (Asia\'s Best)', 'Scuba Diving at Neil Island', 'Cellular Jail Sound & Light Show', 'Bioluminescent Beach'],
            inclusions: ['Beach Resorts & Guesthouses', 'Ferry Tickets (Port Blair ↔ Havelock ↔ Neil)', 'Breakfasts', 'Snorkelling Gear'],
            exclusions: ['Airfare to Port Blair', 'Scuba Diving fees', 'Lunches & Dinners', 'Entry fees'],
            thumbnailImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1505881402582-c5bc11054f91?q=80&w=1600&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                { fromCity: 'Port Blair', toCity: 'Port Blair', type: 'NON-AC', totalDays: 6, totalNights: 5, priceAdjustment: 0 },
                { fromCity: 'Chennai', toCity: 'Port Blair', type: 'FLIGHT', totalDays: 6, totalNights: 5, priceAdjustment: 9500 },
            ],
            itinerary: [
                { dayNumber: 1, title: 'Arrive Port Blair', points: [{ text: 'Cellular Jail evening show', subPoints: ['Hotel check-in'] }] },
                { dayNumber: 2, title: 'Port Blair Local', points: [{ text: 'Ross Island & North Bay', subPoints: ['Snorkelling at North Bay'] }] },
                { dayNumber: 3, title: 'Havelock Island', points: [{ text: 'Ferry to Havelock', subPoints: ['Radhanagar Beach sunset'] }] },
                { dayNumber: 4, title: 'Havelock Adventure', points: [{ text: 'Scuba diving (optional)', subPoints: ['Elephant Beach snorkelling', 'Bioluminescent beach at night'] }] },
                { dayNumber: 5, title: 'Neil Island', points: [{ text: 'Ferry to Neil Island', subPoints: ['Natural Bridge', 'Bharatpur Beach'] }] },
                { dayNumber: 6, title: 'Departure', points: [{ text: 'Return to Port Blair by ferry', subPoints: ['Drop to airport'] }] },
            ],
            isFeatured: true,
            isActive: true,
            averageRating: 4.7,
            totalReviews: 0,
        },
        {
            title: 'Coorg Coffee & Mist',
            description: 'Nestled in the Western Ghats, Coorg (Kodagu) is Karnataka\'s most scenic hill station. Wake up to fog-kissed coffee estates, trek to Abbey Falls, and taste authentic Kodava cuisine.',
            basePrice: 12000,
            category: 'Nature',
            location: 'Madikeri, Coorg',
            state: 'Karnataka',
            country: 'India',
            duration: '3 Days / 2 Nights',
            maxGroupSize: 20,
            difficultyLevel: 'easy',
            highlights: ['Abbey Falls', 'Raja\'s Seat sunset', 'Coffee Estate Walk', 'Dubare Elephant Camp'],
            inclusions: ['Homestay on Coffee Estate', 'Breakfast & Dinner', 'Sightseeing by cab', 'Coffee tasting session'],
            exclusions: ['Travel to Madikeri', 'Lunches', 'Elephant ride fees', 'Personal purchases'],
            thumbnailImage: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1611273426858-450d8e3c9fce?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                { fromCity: 'Bangalore', toCity: 'Madikeri', type: 'AC', totalDays: 3, totalNights: 2, priceAdjustment: 1200 },
                { fromCity: 'Mysore', toCity: 'Madikeri', type: 'AC', totalDays: 3, totalNights: 2, priceAdjustment: 800 },
            ],
            itinerary: [
                { dayNumber: 1, title: 'Arrive & Explore Madikeri', points: [{ text: 'Raja\'s Seat & Abbey Falls', subPoints: ['Madikeri Fort', 'Evening coffee session'] }] },
                { dayNumber: 2, title: 'Coffee Estate & Dubare', points: [{ text: 'Morning estate walk', subPoints: ['Dubare Elephant Camp', 'Nagarhole National Park drive-by'] }] },
                { dayNumber: 3, title: 'Iruppu Falls & Departure', points: [{ text: 'Visit Iruppu Falls', subPoints: ['Return to Bangalore by evening'] }] },
            ],
            isFeatured: false,
            isActive: true,
            averageRating: 4.4,
            totalReviews: 0,
        },
        {
            title: 'Varanasi – The Eternal City',
            description: 'One of the world\'s oldest living cities, Varanasi offers a profound spiritual journey. Witness the Ganga Aarti, sail on the sacred Ganges at dawn, and experience the timeless ghats of Kashi.',
            basePrice: 18000,
            category: 'Spiritual',
            location: 'Varanasi, Uttar Pradesh',
            state: 'Uttar Pradesh',
            country: 'India',
            duration: '4 Days / 3 Nights',
            maxGroupSize: 25,
            difficultyLevel: 'easy',
            highlights: ['Ganga Aarti at Dashashwamedh Ghat', 'Dawn boat ride', 'Sarnath Buddhist Circuit', 'Old City Lane Walk'],
            inclusions: ['Heritage Hotel near Ghats', 'Boat Rides', 'Guided Walks', 'Breakfasts'],
            exclusions: ['Airfare/Train', 'Lunch & Dinner', 'Puja materials', 'Personal expenses'],
            thumbnailImage: 'https://images.unsplash.com/photo-1561361513-2d000a50f0dc?q=80&w=1600&auto=format&fit=crop',
            images: [
                'https://images.unsplash.com/photo-1590123600223-e03e74c6dc31?q=80&w=1600&auto=format&fit=crop',
            ],
            departureOptions: [
                { fromCity: 'Delhi', toCity: 'Varanasi', type: 'FLIGHT', totalDays: 4, totalNights: 3, priceAdjustment: 6000 },
                { fromCity: 'Varanasi', toCity: 'Varanasi', type: 'AC', totalDays: 4, totalNights: 3, priceAdjustment: 0 },
            ],
            itinerary: [
                { dayNumber: 1, title: 'Arrive & Ganga Aarti', points: [{ text: 'Evening Dashashwamedh Aarti', subPoints: ['Arrive in time for the ceremony', 'Orientation walk'] }] },
                { dayNumber: 2, title: 'Dawn Boat Ride & Ghats', points: [{ text: '5:00 AM sunrise boat ride', subPoints: ['Manikarnika Ghat', 'Asi Ghat', 'Sarnath excursion afternoon'] }] },
                { dayNumber: 3, title: 'Old City Walk & Bazaar', points: [{ text: 'Vishwanath Gali', subPoints: ['Silk weaving workshop', 'Banaras chaat lunch'] }] },
                { dayNumber: 4, title: 'Morning Yoga & Departure', points: [{ text: 'Ghat-side yoga session', subPoints: ['Transfer to airport / railway station'] }] },
            ],
            isFeatured: false,
            isActive: false,
            averageRating: 0,
            totalReviews: 0,
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
        { startOffset: -40, status: 'completed', totalSeats: 20, bookedSeats: 20 },
        { startOffset: -10, status: 'completed', totalSeats: 18, bookedSeats: 15 },
        { startOffset: 30, status: 'upcoming', totalSeats: 20, bookedSeats: 7 },
        { startOffset: 60, status: 'upcoming', totalSeats: 25, bookedSeats: 3 },
        { startOffset: 120, status: 'upcoming', totalSeats: 25, bookedSeats: 0 },
    ];
    const daysFromNow = (n) => {
        const d = new Date();
        d.setDate(d.getDate() + n);
        return d;
    };
    const daysAgo = (n) => daysFromNow(-n);
    const addDays = (date, n) => new Date(date.getTime() + n * 86_400_000);
    logger.log('Seeding tour dates…');
    const seededTourDates = [];
    for (const tour of seededTours) {
        const duration = (tour.departureOptions?.[0]?.totalDays ?? 5) - 1;
        const dates = await tourDateModel.insertMany(datePatterns.map(p => {
            const start = daysFromNow(p.startOffset);
            return {
                tour: tour._id,
                startDate: start,
                endDate: addDays(start, duration),
                totalSeats: p.totalSeats,
                bookedSeats: p.bookedSeats,
                status: p.status,
                priceOverride: p.startOffset < 0 ? null : p.startOffset <= 45 ? tour.basePrice * 0.9 : null,
            };
        }));
        seededTourDates.push(...dates);
    }
    logger.log(`Seeded ${seededTourDates.length} tour dates.`);
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
    const john = customers[0];
    const tourDate = seededTourDates[0];
    const tour = seededTours[0];
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
        taxAmount: Math.round(tour.basePrice * 0.05),
        totalAmount: Math.round(tour.basePrice * 1.05),
        paidAmount: Math.round(tour.basePrice * 1.05),
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
    await reviewModel.create({
        user: john._id,
        tour: tour._id,
        booking: booking._id,
        rating: 5,
        comment: 'Absolutely amazing trip! Ladakh is truly a paradise. The organization was top notch.',
        isPublished: true,
    });
    logger.log('Seeded reviews.');
    await blogModel.create({
        title: 'Top 10 Things to Pack for Ladakh',
        slug: 'top-10-things-to-pack-for-ladakh',
        content: `<h2>Why Packing Smart Matters in Ladakh</h2><p>Ladakh sits at over 3,500 metres above sea level. The air is thin, the UV index is brutal, and temperatures can swing 25°C between day and night. Here's exactly what you need.</p><ol><li><strong>Thermal inner wear (2 sets minimum)</strong> – Merino wool is king.</li><li><strong>Heavy down jacket</strong> – Even in June, nights dip below 5°C.</li><li><strong>Sunscreen SPF 50+ and UV sunglasses</strong> – The UV at altitude will burn you in minutes.</li><li><strong>AMS medication (Diamox)</strong> – Consult your doctor before travel.</li><li><strong>Reusable water bottle with filter</strong> – Staying hydrated fights altitude sickness.</li><li><strong>Headlamp with extra batteries</strong> – Power cuts are frequent in remote areas.</li><li><strong>Portable power bank</strong> – Cold kills battery life fast.</li><li><strong>Quick-dry towel</strong> – Hotels in remote areas may not provide them.</li><li><strong>Sturdy trekking shoes</strong> – Trails are rocky and unpredictable.</li><li><strong>Offline maps (Maps.me or Google Offline)</strong> – Mobile data is sparse beyond Leh.</li></ol>`,
        excerpt: 'High altitude, extreme weather, and limited shops – packing right can make or break your Ladakh adventure.',
        category: 'Travel Tips',
        tags: ['Ladakh', 'Packing', 'Adventure', 'Himalaya'],
        featuredImage: 'https://images.unsplash.com/photo-1544085311-11a028465b03?q=80&w=1600&auto=format&fit=crop',
        isPublished: true,
        author: admin._id,
    }, {
        title: 'Best Time to Visit Goa: Month-by-Month Guide',
        slug: 'best-time-to-visit-goa-month-by-month',
        excerpt: 'From peak season crowds to monsoon magic, here is the definitive guide on when to visit Goa.',
        content: `<h2>Goa All Year Round</h2><p>Goa is one of the few destinations in India that offers something different every season. Most tourists flock between November and February when the skies are clear and the sea is calm. But savvy travellers know that the monsoon season (June–September) transforms Goa into a lush, uncrowded paradise with 50% lower hotel rates.</p><h3>November – February (Peak Season)</h3><p>Perfect weather, 28–32°C, all water sports available. Book 3 months in advance. Christmas and New Year see 3x price surges.</p><h3>March – May (Shoulder)</h3><p>Hot and humid but beaches are quieter. Great for budget travel. Some beach shacks begin closing.</p><h3>June – September (Monsoon)</h3><p>Dramatic green landscape, thundering waterfalls at Dudhsagar. Most beaches close for swimming but the raw beauty is unparalleled. Offbeat pubs and cafes remain open year-round.</p>`,
        category: 'Destination Guide',
        tags: ['Goa', 'Beach', 'Travel Planning', 'Monsoon'],
        featuredImage: 'https://images.unsplash.com/photo-1512783558244-97e3a6a9be27?q=80&w=1600&auto=format&fit=crop',
        isPublished: true,
        author: admin._id,
        readTime: 7,
    }, {
        title: 'A First-Timer\'s Complete Guide to Kerala Houseboats',
        slug: 'complete-guide-kerala-houseboats',
        excerpt: 'Everything you need to know before booking a kettuvallam – from the best routes to what to expect on board.',
        content: `<h2>What is a Kettuvallam?</h2><p>A kettuvallam is a traditional rice barge, now converted into a floating guesthouse with 1–4 bedrooms, a living area, a kitchen, and sometimes even a sundeck with loungers. They are primarily found in Alleppey (Alappuzha) and are the most popular way to experience the backwaters of Kerala.</p><h2>Choosing Your Route</h2><p>The classic Alleppey–Kumarakom circuit takes about 8 hours and passes through open lakes, narrow canals, and tiny villages. The Kollam–Alleppey 2-day route is for those who want a deeper, more isolated experience.</p><h2>What's Included</h2><p>Most houseboats include all meals (cooked fresh by your onboard cook), AC bedrooms, and a guide. Insist on a boat with solar panels – they're more eco-friendly and surprisingly common now.</p><h2>Tips</h2><ul><li>Book direct with the boat owner via government-listed operators for better prices.</li><li>Opt for a premium houseboat if budget allows – the difference in quality is significant.</li><li>Bring mosquito repellent. The evenings can get buggy.</li></ul>`,
        category: 'Travel Tips',
        tags: ['Kerala', 'Houseboat', 'Backwaters', 'Leisure'],
        featuredImage: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?q=80&w=1600&auto=format&fit=crop',
        isPublished: true,
        author: admin._id,
        readTime: 9,
    }, {
        title: 'Solo Travel in India: Safety, Planning & Hidden Gems',
        slug: 'solo-travel-india-safety-planning-hidden-gems',
        excerpt: 'India can feel overwhelming for first-time solo travellers. Here is how to navigate it with confidence.',
        content: `<h2>Why India is Worth It</h2><p>India's sheer diversity – 28 states, 22 official languages, every terrain from desert to glacier – makes it one of the most rewarding solo travel destinations on Earth. The key is planning with a flexible framework.</p><h2>Safety Basics</h2><p>Register on your country's travel advisory portal. Share your itinerary with someone at home. Use UPI-based apps like Google Pay or Paytm to avoid carrying large amounts of cash. Stick to reputable hostels – brands like Zostel and The Hosteller have reliable, social environments.</p><h2>Hidden Gems for 2025</h2><ul><li><strong>Tawang, Arunachal Pradesh</strong> – Buddhist monasteries, yak herders, zero tourists.</li><li><strong>Rann of Kutch, Gujarat</strong> – The white salt desert at full moon is otherworldly.</li><li><strong>Majuli Island, Assam</strong> – World's largest river island, accessible by ferry only.</li><li><strong>Ziro Valley, Arunachal Pradesh</strong> – UNESCO tentative-listed tribal landscape.</li></ul>`,
        category: 'Solo Travel',
        tags: ['Solo Travel', 'India', 'Safety', 'Hidden Gems'],
        featuredImage: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?q=80&w=1600&auto=format&fit=crop',
        isPublished: true,
        author: admin._id,
        readTime: 11,
    }, {
        title: 'Spiti Valley Road Trip: The Ultimate 2025 Itinerary',
        slug: 'spiti-valley-road-trip-2025-itinerary',
        excerpt: 'Frozen rivers, ancient monasteries, and roads that touch the sky – Spiti is India\'s last great road trip.',
        content: `<h2>The Route</h2><p>The classic Spiti circuit is done as a loop: Shimla → Sangla → Chitkul → Tabo → Kaza → Chandratal → Manali, or in reverse. Most travellers prefer starting from Shimla (milder roads) and exiting via Manali (more dramatic mountain passes).</p><h2>Road Conditions</h2><p>The Hindustan-Tibet Highway (NH-5) from Shimla is tarmac until Pooh. Beyond that, expect gravel, river crossings, and stretches that are washed out annually by monsoons. The Manali–Kaza route via Rohtang and Kunzum Pass is open only from June to October.</p><h2>Vehicle Choice</h2><p>Rent a Mahindra Thar, Bolero, or Fortuner if self-driving. If joining a group tour, confirm the vehicle type. A flat tyre kit, extra fuel can, and emergency toolkit are non-negotiable.</p>`,
        category: 'Road Trips',
        tags: ['Spiti', 'Road Trip', 'Himachal Pradesh', 'Adventure'],
        featuredImage: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1600&auto=format&fit=crop',
        isPublished: false,
        author: admin._id,
        readTime: 13,
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
//# sourceMappingURL=seed.js.map