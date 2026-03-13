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
exports.AdminCustomToursController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const custom_tours_service_1 = require("./custom-tours.service");
const filter_custom_tour_request_dto_1 = require("./dto/filter-custom-tour-request.dto");
let AdminCustomToursController = class AdminCustomToursController {
    service;
    constructor(service) {
        this.service = service;
    }
    async getStats() {
        return this.service.getStats();
    }
    async getAll(filter) {
        return this.service.findAll(filter);
    }
    async getOne(id) {
        return this.service.findOne(id);
    }
    async updateStatus(id, dto) {
        return this.service.updateStatus(id, dto);
    }
};
exports.AdminCustomToursController = AdminCustomToursController;
__decorate([
    (0, common_1.Get)('stats'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCustomToursController.prototype, "getStats", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_custom_tour_request_dto_1.FilterCustomTourRequestDto]),
    __metadata("design:returntype", Promise)
], AdminCustomToursController.prototype, "getAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCustomToursController.prototype, "getOne", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, filter_custom_tour_request_dto_1.UpdateCustomTourStatusDto]),
    __metadata("design:returntype", Promise)
], AdminCustomToursController.prototype, "updateStatus", null);
exports.AdminCustomToursController = AdminCustomToursController = __decorate([
    (0, common_1.Controller)('admin/custom-tours'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [custom_tours_service_1.CustomToursService])
], AdminCustomToursController);
//# sourceMappingURL=admin-custom-tours.controller.js.map