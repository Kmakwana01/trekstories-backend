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
exports.HomeController = void 0;
const common_1 = require("@nestjs/common");
const home_service_1 = require("./home.service");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
let HomeController = class HomeController {
    homeService;
    constructor(homeService) {
        this.homeService = homeService;
    }
    async getHomeData() {
        return this.homeService.getHomeData();
    }
    async getFeaturedTours() {
        return this.homeService.getFeaturedTours();
    }
    async getUpcomingDepartures() {
        return this.homeService.getUpcomingDepartures();
    }
    async getActiveOffers() {
        return this.homeService.getActiveOffers();
    }
    async getLatestBlogs() {
        return this.homeService.getLatestBlogs();
    }
    async getToursByState() {
        return this.homeService.getToursByState();
    }
    async getToursByStateName(state, page, limit) {
        return this.homeService.getToursByStateName(state, parseInt(page) || 1, parseInt(limit) || 10);
    }
    async getRecentlyViewed(user) {
        return this.homeService.getRecentlyViewedTours(user._id.toString());
    }
};
exports.HomeController = HomeController;
__decorate([
    (0, common_1.Get)('home-data'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "getHomeData", null);
__decorate([
    (0, common_1.Get)('featured-tours'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "getFeaturedTours", null);
__decorate([
    (0, common_1.Get)('upcoming-departures'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "getUpcomingDepartures", null);
__decorate([
    (0, common_1.Get)('offers'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "getActiveOffers", null);
__decorate([
    (0, common_1.Get)('blogs'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "getLatestBlogs", null);
__decorate([
    (0, common_1.Get)('tours-by-state'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "getToursByState", null);
__decorate([
    (0, common_1.Get)('tours-by-state/:state'),
    __param(0, (0, common_1.Param)('state')),
    __param(1, (0, common_1.Query)('page')),
    __param(2, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "getToursByStateName", null);
__decorate([
    (0, common_1.Get)('recently-viewed'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], HomeController.prototype, "getRecentlyViewed", null);
exports.HomeController = HomeController = __decorate([
    (0, common_1.Controller)('home'),
    __metadata("design:paramtypes", [home_service_1.HomeService])
], HomeController);
//# sourceMappingURL=home.controller.js.map