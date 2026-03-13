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
exports.AdminBlogsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const blogs_service_1 = require("./blogs.service");
const create_blog_dto_1 = require("./dto/create-blog.dto");
const update_blog_dto_1 = require("./dto/update-blog.dto");
const filter_blog_dto_1 = require("./dto/filter-blog.dto");
const jwt_auth_guard_1 = require("../../common/guards/jwt-auth.guard");
const roles_guard_1 = require("../../common/guards/roles.guard");
const roles_decorator_1 = require("../../common/decorators/roles.decorator");
const current_user_decorator_1 = require("../../common/decorators/current-user.decorator");
const roles_enum_1 = require("../../common/enums/roles.enum");
const admin_log_service_1 = require("../admin/services/admin-log.service");
const image_upload_service_1 = require("../../common/services/image-upload.service");
const blogMulter = {
    storage: (0, multer_1.memoryStorage)(),
    fileFilter: (req, file, cb) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|webp)$/)) {
            return cb(new Error('Only image files are allowed'), false);
        }
        cb(null, true);
    },
};
let AdminBlogsController = class AdminBlogsController {
    blogsService;
    adminLogService;
    imageUploadService;
    constructor(blogsService, adminLogService, imageUploadService) {
        this.blogsService = blogsService;
        this.adminLogService = adminLogService;
        this.imageUploadService = imageUploadService;
    }
    async create(createBlogDto, file, user, req) {
        let featuredImageUrl;
        if (file) {
            featuredImageUrl = await this.imageUploadService.uploadImage(file);
        }
        const blog = await this.blogsService.create(createBlogDto, user._id.toString(), featuredImageUrl);
        await this.adminLogService.logAction(user._id.toString(), 'CREATE_BLOG', 'Blogs', blog._id?.toString(), { title: createBlogDto.title }, req.ip, req.headers['user-agent']);
        return blog;
    }
    findAll(filterBlogDto) {
        return this.blogsService.findAllAdmin(filterBlogDto);
    }
    findOne(id) {
        return this.blogsService.findOneByIdAdmin(id);
    }
    async update(id, updateBlogDto, file, user, req) {
        let featuredImageUrl;
        if (file) {
            featuredImageUrl = await this.imageUploadService.uploadImage(file);
        }
        const blog = await this.blogsService.update(id, updateBlogDto, featuredImageUrl);
        await this.adminLogService.logAction(user._id.toString(), 'UPDATE_BLOG', 'Blogs', id, { fields: Object.keys(updateBlogDto) }, req.ip, req.headers['user-agent']);
        return blog;
    }
    async remove(id, user, req) {
        await this.blogsService.remove(id);
        await this.adminLogService.logAction(user._id.toString(), 'DELETE_BLOG', 'Blogs', id, {}, req.ip, req.headers['user-agent']);
        return { message: 'Blog deleted successfully' };
    }
    async publish(id, user, req) {
        const blog = await this.blogsService.publish(id);
        await this.adminLogService.logAction(user._id.toString(), 'PUBLISH_BLOG', 'Blogs', id, {}, req.ip, req.headers['user-agent']);
        return blog;
    }
    async unpublish(id, user, req) {
        const blog = await this.blogsService.unpublish(id);
        await this.adminLogService.logAction(user._id.toString(), 'UNPUBLISH_BLOG', 'Blogs', id, {}, req.ip, req.headers['user-agent']);
        return blog;
    }
};
exports.AdminBlogsController = AdminBlogsController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('featuredImage', blogMulter)),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __param(3, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_blog_dto_1.CreateBlogDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminBlogsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filter_blog_dto_1.FilterBlogDto]),
    __metadata("design:returntype", void 0)
], AdminBlogsController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], AdminBlogsController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('featuredImage', blogMulter)),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __param(3, (0, current_user_decorator_1.CurrentUser)()),
    __param(4, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_blog_dto_1.UpdateBlogDto, Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminBlogsController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminBlogsController.prototype, "remove", null);
__decorate([
    (0, common_1.Patch)(':id/publish'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminBlogsController.prototype, "publish", null);
__decorate([
    (0, common_1.Patch)(':id/unpublish'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __param(2, (0, common_1.Req)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object, Object]),
    __metadata("design:returntype", Promise)
], AdminBlogsController.prototype, "unpublish", null);
exports.AdminBlogsController = AdminBlogsController = __decorate([
    (0, common_1.Controller)('admin/blogs'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(roles_enum_1.Role.ADMIN),
    __metadata("design:paramtypes", [blogs_service_1.BlogsService,
        admin_log_service_1.AdminLogService,
        image_upload_service_1.ImageUploadService])
], AdminBlogsController);
//# sourceMappingURL=admin-blogs.controller.js.map