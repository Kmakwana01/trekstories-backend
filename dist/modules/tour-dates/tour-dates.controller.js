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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminTourDatesController = exports.TourDatesController = void 0;
const common_1 = require("@nestjs/common");
const tour_dates_service_1 = require("./tour-dates.service");
const create_tour_date_dto_1 = require("./dto/create-tour-date.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const admin_log_service_1 = require("../admin/services/admin-log.service");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let TourDatesController = class TourDatesController {
    tourDatesService;
    constructor(tourDatesService) {
        this.tourDatesService = tourDatesService;
    }
    async getUpcomingDates(tourId) {
        return this.tourDatesService.getUpcomingDates(tourId);
    }
    async getTourDatesWithSeats(tourId) {
        return this.tourDatesService.getTourDatesWithSeats(tourId);
    }
};
exports.TourDatesController = TourDatesController;
__decorate([
    (0, common_1.Get)(':tourId'),
    __param(0, (0, common_1.Param)('tourId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TourDatesController.prototype, "getUpcomingDates", null);
__decorate([
    (0, common_1.Get)(':tourId/with-seats'),
    __param(0, (0, common_1.Param)('tourId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TourDatesController.prototype, "getTourDatesWithSeats", null);
exports.TourDatesController = TourDatesController = __decorate([
    (0, common_1.Controller)('tour-dates'),
    __metadata("design:paramtypes", [tour_dates_service_1.TourDatesService])
], TourDatesController);
let AdminTourDatesController = class AdminTourDatesController {
    tourDatesService;
    adminLogService;
    constructor(tourDatesService, adminLogService) {
        this.tourDatesService = tourDatesService;
        this.adminLogService = adminLogService;
    }
    async getTourDates(tourId) {
        return this.tourDatesService.adminGetTourDates(tourId);
    }
    async createTourDate(createTourDateDto, adminId, req) {
        const tourDate = await this.tourDatesService.adminCreateTourDate(createTourDateDto);
        await this.adminLogService.logAction(adminId, 'CREATE_TOUR_DATE', 'TourDates', tourDate._id?.toString(), { tour: createTourDateDto.tour }, req.ip, req.headers['user-agent']);
        return tourDate;
    }
    async updateTourDate(id, updateTourDateDto, adminId, req) {
        const tourDate = await this.tourDatesService.adminUpdateTourDate(id, updateTourDateDto);
        await this.adminLogService.logAction(adminId, 'UPDATE_TOUR_DATE', 'TourDates', id, { fields: Object.keys(updateTourDateDto) }, req.ip, req.headers['user-agent']);
        return tourDate;
    }
    async deleteTourDate(id, adminId, req) {
        await this.tourDatesService.adminDeleteTourDate(id);
        await this.adminLogService.logAction(adminId, 'DELETE_TOUR_DATE', 'TourDates', id, {}, req.ip, req.headers['user-agent']);
        return { message: 'Tour date deleted successfully' };
    }
    async updateStatus(id, status, adminId, req) {
        const tourDate = await this.tourDatesService.updateStatus(id, status);
        await this.adminLogService.logAction(adminId, 'UPDATE_TOUR_DATE_STATUS', 'TourDates', id, { status }, req.ip, req.headers['user-agent']);
        return tourDate;
    }
    async triggerAutoUpdate() {
        return this.tourDatesService.autoUpdateStatuses();
    }
};
exports.AdminTourDatesController = AdminTourDatesController;
__decorate([
    (0, common_1.Get)(':tourId'),
    __param(0, (0, common_1.Param)('tourId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminTourDatesController.prototype, "getTourDates", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tour_date_dto_1.CreateTourDateDto, String, Object]),
    __metadata("design:returntype", Promise)
], AdminTourDatesController.prototype, "createTourDate", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_tour_date_dto_1.UpdateTourDateDto, String, Object]),
    __metadata("design:returntype", Promise)
], AdminTourDatesController.prototype, "updateTourDate", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminTourDatesController.prototype, "deleteTourDate", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('status')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminTourDatesController.prototype, "updateStatus", null);
__decorate([
    (0, common_1.Post)('auto-update-status'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminTourDatesController.prototype, "triggerAutoUpdate", null);
exports.AdminTourDatesController = AdminTourDatesController = __decorate([
    (0, common_1.Controller)('admin/tour-dates'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [tour_dates_service_1.TourDatesService,
        admin_log_service_1.AdminLogService])
], AdminTourDatesController);
//# sourceMappingURL=tour-dates.controller.js.map