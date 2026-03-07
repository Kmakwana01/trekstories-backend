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
exports.AdminReportsController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../../common/guards/roles.guard");
const roles_decorator_1 = require("../../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../../common/enums/roles.enum");
const reports_service_1 = require("../services/reports.service");
const date_util_1 = require("../../../utils/date.util");
let AdminReportsController = class AdminReportsController {
    reportsService;
    constructor(reportsService) {
        this.reportsService = reportsService;
    }
    async getRevenueCSV(startDate, endDate, res) {
        const start = startDate ? date_util_1.DateUtil.startOfDayIST(startDate) : date_util_1.DateUtil.nowIST().subtract(30, 'day').startOf('day').utc().toDate();
        const end = endDate ? date_util_1.DateUtil.endOfDayIST(endDate) : date_util_1.DateUtil.nowUTC();
        const csv = await this.reportsService.generateRevenueCSV(start, end);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=revenue-report.csv');
        res.send(csv);
    }
    async getRevenuePDF(startDate, endDate, res) {
        const start = startDate ? date_util_1.DateUtil.startOfDayIST(startDate) : date_util_1.DateUtil.nowIST().subtract(30, 'day').startOf('day').utc().toDate();
        const end = endDate ? date_util_1.DateUtil.endOfDayIST(endDate) : date_util_1.DateUtil.nowUTC();
        const buffer = await this.reportsService.generateRevenuePDF(start, end);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=revenue-report.pdf');
        res.send(buffer);
    }
    async getBookingCSV(startDate, endDate, res) {
        const start = startDate ? date_util_1.DateUtil.startOfDayIST(startDate) : date_util_1.DateUtil.nowIST().subtract(30, 'day').startOf('day').utc().toDate();
        const end = endDate ? date_util_1.DateUtil.endOfDayIST(endDate) : date_util_1.DateUtil.nowUTC();
        const csv = await this.reportsService.generateBookingCSV(start, end);
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=booking-report.csv');
        res.send(csv);
    }
};
exports.AdminReportsController = AdminReportsController;
__decorate([
    (0, common_1.Get)('revenue/csv'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminReportsController.prototype, "getRevenueCSV", null);
__decorate([
    (0, common_1.Get)('revenue/pdf'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminReportsController.prototype, "getRevenuePDF", null);
__decorate([
    (0, common_1.Get)('bookings/csv'),
    __param(0, (0, common_1.Query)('startDate')),
    __param(1, (0, common_1.Query)('endDate')),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminReportsController.prototype, "getBookingCSV", null);
exports.AdminReportsController = AdminReportsController = __decorate([
    (0, common_1.Controller)('admin/reports'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [reports_service_1.ReportsService])
], AdminReportsController);
//# sourceMappingURL=admin-reports.controller.js.map