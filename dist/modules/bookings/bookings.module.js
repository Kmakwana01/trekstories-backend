"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const bookings_service_1 = require("./bookings.service");
const bookings_controller_1 = require("./bookings.controller");
const admin_bookings_controller_1 = require("./admin-bookings.controller");
const booking_schema_1 = require("../../database/schemas/booking.schema");
const tour_schema_1 = require("../../database/schemas/tour.schema");
const tour_date_schema_1 = require("../../database/schemas/tour-date.schema");
const coupons_module_1 = require("../coupons/coupons.module");
const notifications_module_1 = require("../notifications/notifications.module");
const admin_module_1 = require("../admin/admin.module");
const settings_module_1 = require("../settings/settings.module");
const transactions_module_1 = require("../transactions/transactions.module");
let BookingsModule = class BookingsModule {
};
exports.BookingsModule = BookingsModule;
exports.BookingsModule = BookingsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema },
                { name: tour_schema_1.Tour.name, schema: tour_schema_1.TourSchema },
                { name: tour_date_schema_1.TourDate.name, schema: tour_date_schema_1.TourDateSchema },
            ]),
            coupons_module_1.CouponsModule,
            notifications_module_1.NotificationsModule,
            admin_module_1.AdminModule,
            settings_module_1.SettingsModule,
            (0, common_1.forwardRef)(() => transactions_module_1.TransactionsModule),
        ],
        providers: [bookings_service_1.BookingsService],
        controllers: [bookings_controller_1.BookingsController, admin_bookings_controller_1.AdminBookingsController],
        exports: [bookings_service_1.BookingsService],
    })
], BookingsModule);
//# sourceMappingURL=bookings.module.js.map