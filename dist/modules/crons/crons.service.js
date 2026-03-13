"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var CronsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CronsService = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const tour_dates_service_1 = require("../tour-dates/tour-dates.service");
const bookings_service_1 = require("../bookings/bookings.service");
const notifications_service_1 = require("../notifications/notifications.service");
const reports_service_1 = require("../admin/services/reports.service");
let CronsService = CronsService_1 = class CronsService {
    tourDatesService;
    bookingsService;
    notificationsService;
    reportsService;
    logger = new common_1.Logger(CronsService_1.name);
    constructor(tourDatesService, bookingsService, notificationsService, reportsService) {
        this.tourDatesService = tourDatesService;
        this.bookingsService = bookingsService;
        this.notificationsService = notificationsService;
        this.reportsService = reportsService;
    }
    async handleDailyStatuses() {
        this.logger.log('Running daily tour date status update...');
        try {
            const result = await this.tourDatesService.autoUpdateStatuses();
            this.logger.log(`Tour date update result: ${result}`);
        }
        catch (err) {
            this.logger.error('Failed to update tour date statuses', err);
        }
    }
};
exports.CronsService = CronsService;
__decorate([
    (0, schedule_1.Cron)(schedule_1.CronExpression.EVERY_DAY_AT_MIDNIGHT),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CronsService.prototype, "handleDailyStatuses", null);
exports.CronsService = CronsService = CronsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tour_dates_service_1.TourDatesService,
        bookings_service_1.BookingsService,
        notifications_service_1.NotificationsService,
        reports_service_1.ReportsService])
], CronsService);
//# sourceMappingURL=crons.service.js.map