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
exports.AdminToursController = void 0;
const common_1 = require("@nestjs/common");
const tours_service_1 = require("./tours.service");
const create_tour_dto_1 = require("./dto/create-tour.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const pagination_helper_1 = require("../../common/helpers/pagination.helper");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const admin_log_service_1 = require("../admin/services/admin-log.service");
const image_upload_service_1 = require("../../common/services/image-upload.service");
const form_data_parser_interceptor_1 = require("../../common/interceptors/form-data-parser.interceptor");
const tourMulterOptions = {
    storage: (0, multer_1.memoryStorage)(),
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp|pdf)$/)) {
            return cb(new Error('Only image files and PDFs are allowed!'), false);
        }
        cb(null, true);
    },
};
let AdminToursController = class AdminToursController {
    toursService;
    adminLogService;
    imageUploadService;
    constructor(toursService, adminLogService, imageUploadService) {
        this.toursService = toursService;
        this.adminLogService = adminLogService;
        this.imageUploadService = imageUploadService;
    }
    async getTours(pagination) {
        return this.toursService.adminGetTours(pagination);
    }
    async createTour(createTourDto, files, adminId, req) {
        console.log('--- REQ.BODY IN CONTROLLER ---');
        console.log(req.body);
        console.log('--- DTO IN CONTROLLER ---');
        console.log(createTourDto);
        let imageUrls = [];
        if (files?.images) {
            imageUrls = await this.imageUploadService.uploadImages(files.images);
        }
        let thumbnailUrl;
        if (files?.thumbnailImage?.[0]) {
            thumbnailUrl = await this.imageUploadService.uploadImage(files.thumbnailImage[0]);
        }
        let brochureUrl;
        if (files?.brochure?.[0]) {
            brochureUrl = await this.imageUploadService.uploadImage(files.brochure[0]);
        }
        const tour = await this.toursService.adminCreateTour(createTourDto, imageUrls, thumbnailUrl, brochureUrl);
        await this.adminLogService.logAction(adminId, 'CREATE_TOUR', 'Tours', tour._id?.toString(), { title: tour.title }, req.ip, req.headers['user-agent']);
        return tour;
    }
    async getTourById(id) {
        return this.toursService.adminGetTourById(id);
    }
    async updateTour(id, updateTourDto, files, adminId, req) {
        console.log(updateTourDto);
        let imageUrls = [];
        if (files?.images) {
            imageUrls = await this.imageUploadService.uploadImages(files.images);
        }
        let thumbnailUrl;
        if (files?.thumbnailImage?.[0]) {
            thumbnailUrl = await this.imageUploadService.uploadImage(files.thumbnailImage[0]);
        }
        let brochureUrl;
        if (files?.brochure?.[0]) {
            brochureUrl = await this.imageUploadService.uploadImage(files.brochure[0]);
        }
        const tour = await this.toursService.adminUpdateTour(id, updateTourDto, imageUrls, thumbnailUrl, brochureUrl);
        await this.adminLogService.logAction(adminId, 'UPDATE_TOUR', 'Tours', id, { fields: Object.keys(updateTourDto) }, req.ip, req.headers['user-agent']);
        return tour;
    }
    async deleteTour(id, adminId, req) {
        await this.toursService.adminSoftDelete(id);
        await this.adminLogService.logAction(adminId, 'DELETE_TOUR', 'Tours', id, {}, req.ip, req.headers['user-agent']);
        return { message: 'Tour deleted (soft delete) successfully' };
    }
    async toggleStatus(id, adminId, req) {
        const tour = await this.toursService.toggleStatus(id);
        await this.adminLogService.logAction(adminId, 'TOGGLE_TOUR_STATUS', 'Tours', id, { isActive: tour.isActive }, req.ip, req.headers['user-agent']);
        return tour;
    }
    async toggleFeatured(id, adminId, req) {
        const tour = await this.toursService.toggleFeatured(id);
        await this.adminLogService.logAction(adminId, 'TOGGLE_TOUR_FEATURED', 'Tours', id, { isFeatured: tour.isFeatured }, req.ip, req.headers['user-agent']);
        return tour;
    }
    async deleteImage(id, imageUrl, adminId, req) {
        await this.toursService.removeImage(id, imageUrl);
        await this.adminLogService.logAction(adminId, 'DELETE_TOUR_IMAGE', 'Tours', id, { imageUrl }, req.ip, req.headers['user-agent']);
        return { message: 'Image removed successfully' };
    }
};
exports.AdminToursController = AdminToursController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [pagination_helper_1.PaginationQuery]),
    __metadata("design:returntype", Promise)
], AdminToursController.prototype, "getTours", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'images', maxCount: 10 },
        { name: 'thumbnailImage', maxCount: 1 },
        { name: 'brochure', maxCount: 1 },
    ], tourMulterOptions), form_data_parser_interceptor_1.FormDataParserInterceptor),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFiles)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_tour_dto_1.CreateTourDto, Object, String, Object]),
    __metadata("design:returntype", Promise)
], AdminToursController.prototype, "createTour", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminToursController.prototype, "getTourById", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'images', maxCount: 10 },
        { name: 'thumbnailImage', maxCount: 1 },
        { name: 'brochure', maxCount: 1 },
    ], tourMulterOptions), form_data_parser_interceptor_1.FormDataParserInterceptor),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFiles)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, create_tour_dto_1.UpdateTourDto, Object, String, Object]),
    __metadata("design:returntype", Promise)
], AdminToursController.prototype, "updateTour", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminToursController.prototype, "deleteTour", null);
__decorate([
    (0, common_1.Patch)(':id/status'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminToursController.prototype, "toggleStatus", null);
__decorate([
    (0, common_1.Patch)(':id/featured'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminToursController.prototype, "toggleFeatured", null);
__decorate([
    (0, common_1.Delete)(':id/images'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('imageUrl')),
    __param(2, (0, current_user_decorator_1.CurrentUser)('_id')),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Object]),
    __metadata("design:returntype", Promise)
], AdminToursController.prototype, "deleteImage", null);
exports.AdminToursController = AdminToursController = __decorate([
    (0, common_1.Controller)('admin/tours'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [tours_service_1.ToursService,
        admin_log_service_1.AdminLogService,
        image_upload_service_1.ImageUploadService])
], AdminToursController);
//# sourceMappingURL=admin-tours.controller.js.map