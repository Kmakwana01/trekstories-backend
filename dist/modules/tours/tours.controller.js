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
exports.ToursController = void 0;
const common_1 = require("@nestjs/common");
const tours_service_1 = require("./tours.service");
const tour_filters_dto_1 = require("./dto/tour-filters.dto");
const pagination_helper_1 = require("../../common/helpers/pagination.helper");
let ToursController = class ToursController {
    toursService;
    constructor(toursService) {
        this.toursService = toursService;
    }
    async getAllTours(filters) {
        return this.toursService.getAllTours(filters);
    }
    async getFilterOptions() {
        return this.toursService.getFilterOptions();
    }
    async getByState(state, pagination) {
        return this.toursService.getByState(state, pagination);
    }
    async getTourBySlug(slug) {
        return this.toursService.getTourBySlug(slug);
    }
    async getTourDates(id) {
        return this.toursService.getTourDates(id);
    }
};
exports.ToursController = ToursController;
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UsePipes)(new common_1.ValidationPipe({ transform: true })),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [tour_filters_dto_1.TourFiltersDto]),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "getAllTours", null);
__decorate([
    (0, common_1.Get)('filter-options'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "getFilterOptions", null);
__decorate([
    (0, common_1.Get)('state/:state'),
    __param(0, (0, common_1.Param)('state')),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, pagination_helper_1.PaginationQuery]),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "getByState", null);
__decorate([
    (0, common_1.Get)(':slug'),
    __param(0, (0, common_1.Param)('slug')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "getTourBySlug", null);
__decorate([
    (0, common_1.Get)(':id/dates'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ToursController.prototype, "getTourDates", null);
exports.ToursController = ToursController = __decorate([
    (0, common_1.Controller)('tours'),
    __metadata("design:paramtypes", [tours_service_1.ToursService])
], ToursController);
//# sourceMappingURL=tours.controller.js.map