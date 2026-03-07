"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const bcrypt = __importStar(require("bcryptjs"));
const user_schema_1 = require("../../database/schemas/user.schema");
const pagination_helper_1 = require("../../common/helpers/pagination.helper");
const date_util_1 = require("../../utils/date.util");
const booking_status_enum_1 = require("../../common/enums/booking-status.enum");
let UsersService = class UsersService {
    userModel;
    bookingModel;
    reviewModel;
    notificationModel;
    constructor(userModel, bookingModel, reviewModel, notificationModel) {
        this.userModel = userModel;
        this.bookingModel = bookingModel;
        this.reviewModel = reviewModel;
        this.notificationModel = notificationModel;
    }
    async getProfile(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.sanitizeUser(user);
    }
    async updateProfile(userId, updateProfileDto) {
        const user = await this.userModel.findByIdAndUpdate(userId, { $set: updateProfileDto }, { returnDocument: 'after', runValidators: true });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return this.sanitizeUser(user);
    }
    async changePassword(userId, changePasswordDto) {
        const { oldPassword, newPassword } = changePasswordDto;
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const isMatch = await bcrypt.compare(oldPassword, user.passwordHash);
        if (!isMatch) {
            throw new common_1.BadRequestException('Invalid old password');
        }
        const salt = await bcrypt.genSalt(10);
        user.passwordHash = await bcrypt.hash(newPassword, salt);
        await user.save();
        return { message: 'Password changed successfully' };
    }
    async getSavedTravelers(userId) {
        const user = await this.userModel.findById(userId).select('savedTravelers');
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user.savedTravelers;
    }
    async addSavedTraveler(userId, travelerDto) {
        const user = await this.userModel.findByIdAndUpdate(userId, { $push: { savedTravelers: travelerDto } }, { returnDocument: 'after' });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user.savedTravelers;
    }
    async removeSavedTraveler(userId, travelerId) {
        const user = await this.userModel.findByIdAndUpdate(userId, { $pull: { savedTravelers: { _id: travelerId } } }, { returnDocument: 'after' });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user.savedTravelers;
    }
    async getMyBookings(userId, paginationQuery) {
        return (0, pagination_helper_1.paginate)(this.bookingModel, { user: new mongoose_2.Types.ObjectId(userId) }, paginationQuery);
    }
    async getDashboardSummary(userId) {
        const uid = new mongoose_2.Types.ObjectId(userId);
        const user = await this.userModel.findById(userId).select('wishlist').lean();
        const wishlistCount = user?.wishlist?.length || 0;
        const [allBookings, recentNotifications, reviewsCount] = await Promise.all([
            this.bookingModel.find({ user: uid })
                .populate('tour', 'title slug thumbnailImage location images')
                .populate('tourDate', 'startDate endDate date')
                .sort({ createdAt: -1 })
                .lean(),
            this.notificationModel.find({ user: uid })
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
            this.reviewModel.countDocuments({ user: uid })
        ]);
        const totalBookingsCount = allBookings.length;
        const completedTripsCount = allBookings.filter(b => b.status === booking_status_enum_1.BookingStatus.COMPLETED).length;
        const recentBookings = allBookings.slice(0, 5);
        const now = date_util_1.DateUtil.nowUTC();
        const upcomingBookings = allBookings.filter(b => {
            const stat = b.status;
            const d = b.tourDate;
            const dateToCompare = d?.startDate || d?.date || b.createdAt;
            return (stat === booking_status_enum_1.BookingStatus.CONFIRMED || stat === booking_status_enum_1.BookingStatus.PENDING) && date_util_1.DateUtil.startOfDayIST(dateToCompare) >= date_util_1.DateUtil.startOfDayIST(now);
        }).sort((a, b) => {
            const dA = a.tourDate;
            const dB = b.tourDate;
            const dateA = new Date(dA?.startDate || dA?.date || a.createdAt).getTime();
            const dateB = new Date(dB?.startDate || dB?.date || b.createdAt).getTime();
            return dateA - dateB;
        });
        const upcomingBooking = upcomingBookings.length > 0 ? upcomingBookings[0] : (recentBookings.length > 0 ? recentBookings[0] : null);
        return {
            upcomingBooking,
            recentBookings,
            recentNotifications,
            stats: {
                totalBookingsCount,
                completedTripsCount,
                reviewsCount,
                wishlistCount
            }
        };
    }
    sanitizeUser(user) {
        const obj = user.toObject();
        delete obj.passwordHash;
        delete obj.refreshTokenHash;
        delete obj.otp;
        delete obj.otpExpiry;
        delete obj.resetToken;
        delete obj.resetTokenExpiry;
        return obj;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)('Booking')),
    __param(2, (0, mongoose_1.InjectModel)('Review')),
    __param(3, (0, mongoose_1.InjectModel)('Notification')),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model,
        mongoose_2.Model])
], UsersService);
//# sourceMappingURL=users.service.js.map