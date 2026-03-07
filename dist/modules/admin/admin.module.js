"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const admin_log_service_1 = require("./services/admin-log.service");
const admin_dashboard_service_1 = require("./services/admin-dashboard.service");
const admin_crm_service_1 = require("./services/admin-crm.service");
const reports_service_1 = require("./services/reports.service");
const admin_dashboard_controller_1 = require("./controllers/admin-dashboard.controller");
const admin_users_controller_1 = require("./controllers/admin-users.controller");
const admin_reports_controller_1 = require("./controllers/admin-reports.controller");
const admin_logs_controller_1 = require("./controllers/admin-logs.controller");
const booking_schema_1 = require("../../database/schemas/booking.schema");
const user_schema_1 = require("../../database/schemas/user.schema");
const tour_schema_1 = require("../../database/schemas/tour.schema");
const review_schema_1 = require("../../database/schemas/review.schema");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: booking_schema_1.Booking.name, schema: booking_schema_1.BookingSchema },
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: tour_schema_1.Tour.name, schema: tour_schema_1.TourSchema },
                { name: review_schema_1.Review.name, schema: review_schema_1.ReviewSchema },
            ]),
        ],
        providers: [admin_log_service_1.AdminLogService, admin_dashboard_service_1.AdminDashboardService, admin_crm_service_1.AdminCrmService, reports_service_1.ReportsService],
        controllers: [admin_dashboard_controller_1.AdminDashboardController, admin_users_controller_1.AdminUsersController, admin_reports_controller_1.AdminReportsController, admin_logs_controller_1.AdminLogsController],
        exports: [admin_log_service_1.AdminLogService, reports_service_1.ReportsService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map