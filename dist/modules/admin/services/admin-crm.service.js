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
exports.AdminCrmService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../../database/schemas/user.schema");
const booking_schema_1 = require("../../../database/schemas/booking.schema");
const pagination_helper_1 = require("../../../common/helpers/pagination.helper");
const admin_log_service_1 = require("./admin-log.service");
const roles_enum_1 = require("../../../common/enums/roles.enum");
let AdminCrmService = class AdminCrmService {
    userModel;
    bookingModel;
    adminLogService;
    constructor(userModel, bookingModel, adminLogService) {
        this.userModel = userModel;
        this.bookingModel = bookingModel;
        this.adminLogService = adminLogService;
    }
    async getAllUsers(filters, paginationQuery) {
        const query = { role: roles_enum_1.Role.CUSTOMER };
        if (filters.isVerified !== undefined)
            query.isVerified = filters.isVerified === 'true';
        if (filters.isBlocked !== undefined)
            query.isBlocked = filters.isBlocked === 'true';
        if (filters.search) {
            query.$or = [
                { name: new RegExp(filters.search, 'i') },
                { email: new RegExp(filters.search, 'i') },
                { phone: new RegExp(filters.search, 'i') },
            ];
        }
        if (!paginationQuery.order)
            paginationQuery.order = 'desc';
        return (0, pagination_helper_1.paginate)(this.userModel, query, paginationQuery);
    }
    async getUserById(id) {
        const user = await this.userModel
            .findById(id)
            .select('-passwordHash -otp -otpExpiry')
            .populate('wishlist', 'title slug thumbnailImage')
            .lean()
            .exec();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const bookings = await this.bookingModel
            .find({ user: new mongoose_2.Types.ObjectId(id) })
            .sort({ createdAt: -1 })
            .lean()
            .exec();
        const bookingCount = bookings.length;
        const totalSpent = bookings
            .filter((b) => b.status?.toUpperCase() !== 'CANCELLED')
            .reduce((sum, b) => sum + (b.paidAmount || 0), 0);
        user.address = user.contactAddress
            ? {
                street: user.contactAddress,
                city: user.country || 'Unknown',
                country: user.country || 'Unknown',
            }
            : null;
        user.bookings = bookings;
        if (user.internalNotes &&
            (!user.adminNotes || user.adminNotes.length === 0)) {
            user.adminNotes = [
                { note: user.internalNotes, createdAt: user.updatedAt },
            ];
        }
        return {
            user,
            totalBookings: bookingCount,
            totalSpent,
            bookings,
        };
    }
    async blockUser(id, adminId, reason, ip, userAgent) {
        const user = await this.userModel
            .findByIdAndUpdate(id, { isBlocked: true }, { returnDocument: 'after' })
            .exec();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.adminLogService.logAction(adminId, 'BLOCK_USER', 'users', id, { reason }, ip, userAgent);
        return user;
    }
    async unblockUser(id, adminId, ip, userAgent) {
        const user = await this.userModel
            .findByIdAndUpdate(id, { isBlocked: false }, { returnDocument: 'after' })
            .exec();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        await this.adminLogService.logAction(adminId, 'UNBLOCK_USER', 'users', id, null, ip, userAgent);
        return user;
    }
    async addUserNote(id, note) {
        const user = await this.userModel
            .findByIdAndUpdate(id, {
            $push: {
                adminNotes: {
                    note,
                    createdAt: new Date(),
                },
            },
        }, { returnDocument: 'after' })
            .exec();
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
};
exports.AdminCrmService = AdminCrmService;
exports.AdminCrmService = AdminCrmService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(booking_schema_1.Booking.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        admin_log_service_1.AdminLogService])
], AdminCrmService);
//# sourceMappingURL=admin-crm.service.js.map