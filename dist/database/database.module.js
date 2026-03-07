"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DatabaseModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const config_1 = require("@nestjs/config");
const user_schema_1 = require("./schemas/user.schema");
const tour_schema_1 = require("./schemas/tour.schema");
const tour_date_schema_1 = require("./schemas/tour-date.schema");
const booking_schema_1 = require("./schemas/booking.schema");
const payment_schema_1 = require("./schemas/payment.schema");
const transaction_schema_1 = require("./schemas/transaction.schema");
const blog_schema_1 = require("./schemas/blog.schema");
const review_schema_1 = require("./schemas/review.schema");
const coupon_schema_1 = require("./schemas/coupon.schema");
const notification_schema_1 = require("./schemas/notification.schema");
const admin_log_schema_1 = require("./schemas/admin-log.schema");
const setting_schema_1 = require("./schemas/setting.schema");
let DatabaseModule = class DatabaseModule {
};
exports.DatabaseModule = DatabaseModule;
exports.DatabaseModule = DatabaseModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forRootAsync({
                inject: [config_1.ConfigService],
                useFactory: async (configService) => ({
                    uri: configService.get('database.uri'),
                }),
            }),
            mongoose_1.MongooseModule.forFeature([
                { name: 'User', schema: user_schema_1.UserSchema },
                { name: 'Tour', schema: tour_schema_1.TourSchema },
                { name: 'TourDate', schema: tour_date_schema_1.TourDateSchema },
                { name: 'Booking', schema: booking_schema_1.BookingSchema },
                { name: 'Payment', schema: payment_schema_1.PaymentSchema },
                { name: 'Transaction', schema: transaction_schema_1.TransactionSchema },
                { name: 'Blog', schema: blog_schema_1.BlogSchema },
                { name: 'Review', schema: review_schema_1.ReviewSchema },
                { name: 'Coupon', schema: coupon_schema_1.CouponSchema },
                { name: 'Notification', schema: notification_schema_1.NotificationSchema },
                { name: 'AdminLog', schema: admin_log_schema_1.AdminLogSchema },
                { name: 'Setting', schema: setting_schema_1.SettingSchema },
            ]),
        ],
        exports: [mongoose_1.MongooseModule],
    })
], DatabaseModule);
//# sourceMappingURL=database.module.js.map