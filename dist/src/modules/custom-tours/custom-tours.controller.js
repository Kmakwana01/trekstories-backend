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
exports.CustomToursController = void 0;
const common_1 = require("@nestjs/common");
const custom_tours_service_1 = require("./custom-tours.service");
const create_custom_tour_request_dto_1 = require("./dto/create-custom-tour-request.dto");
let CustomToursController = class CustomToursController {
    service;
    constructor(service) {
        this.service = service;
    }
    async submitRequest(dto) {
        const result = await this.service.create(dto);
        return {
            success: true,
            message: 'Your custom tour request has been received! We will contact you shortly.',
            data: { id: result._id },
        };
    }
};
exports.CustomToursController = CustomToursController;
__decorate([
    (0, common_1.Post)('request'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_custom_tour_request_dto_1.CreateCustomTourRequestDto]),
    __metadata("design:returntype", Promise)
], CustomToursController.prototype, "submitRequest", null);
exports.CustomToursController = CustomToursController = __decorate([
    (0, common_1.Controller)('custom-tours'),
    __metadata("design:paramtypes", [custom_tours_service_1.CustomToursService])
], CustomToursController);
//# sourceMappingURL=custom-tours.controller.js.map