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
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const users_service_1 = require("./users.service");
const update_profile_dto_1 = require("./dto/update-profile.dto");
const change_password_dto_1 = require("./dto/change-password.dto");
const saved_traveler_dto_1 = require("./dto/saved-traveler.dto");
const pagination_helper_1 = require("../../common/helpers/pagination.helper");
const image_upload_service_1 = require("../../common/services/image-upload.service");
let UsersController = class UsersController {
    usersService;
    imageUploadService;
    constructor(usersService, imageUploadService) {
        this.usersService = usersService;
        this.imageUploadService = imageUploadService;
    }
    async getProfile(user) {
        return this.usersService.getProfile(user._id);
    }
    async updateProfile(user, updateProfileDto, file) {
        if (file) {
            updateProfileDto.avatar = await this.imageUploadService.uploadImage(file);
        }
        delete updateProfileDto.avatarFile;
        const updateData = { ...updateProfileDto };
        return this.usersService.updateProfile(user._id, updateData);
    }
    async changePassword(user, changePasswordDto) {
        return this.usersService.changePassword(user._id, changePasswordDto);
    }
    async getTravelers(user) {
        return this.usersService.getSavedTravelers(user._id);
    }
    async addTraveler(user, travelerDto) {
        return this.usersService.addSavedTraveler(user._id, travelerDto);
    }
    async removeTraveler(user, id) {
        return this.usersService.removeSavedTraveler(user._id, id);
    }
    async getMyBookings(user, paginationQuery) {
        return this.usersService.getMyBookings(user._id, paginationQuery);
    }
    async getDashboardSummary(user) {
        return this.usersService.getDashboardSummary(user._id);
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Get)('profile'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Patch)('profile'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('avatarFile', {
        storage: (0, multer_1.memoryStorage)(),
        fileFilter: (req, file, cb) => {
            if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        },
    })),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_profile_dto_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, common_1.Patch)('change-password'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, common_1.Get)('travelers'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getTravelers", null);
__decorate([
    (0, common_1.Post)('travelers'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, saved_traveler_dto_1.SavedTravelerDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "addTraveler", null);
__decorate([
    (0, common_1.Delete)('travelers/:id'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "removeTraveler", null);
__decorate([
    (0, common_1.Get)('my-bookings'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __param(1, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, pagination_helper_1.PaginationQuery]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMyBookings", null);
__decorate([
    (0, common_1.Get)('dashboard-summary'),
    __param(0, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getDashboardSummary", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.CUSTOMER, roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        image_upload_service_1.ImageUploadService])
], UsersController);
//# sourceMappingURL=users.controller.js.map