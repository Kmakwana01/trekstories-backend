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
exports.WishlistService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("../../database/schemas/user.schema");
const tour_schema_1 = require("../../database/schemas/tour.schema");
let WishlistService = class WishlistService {
    userModel;
    tourModel;
    constructor(userModel, tourModel) {
        this.userModel = userModel;
        this.tourModel = tourModel;
    }
    async addToWishlist(userId, tourId) {
        const tour = await this.tourModel.findById(tourId);
        if (!tour || !tour.isActive) {
            throw new common_1.NotFoundException('Tour not found or is inactive');
        }
        const user = await this.userModel
            .findByIdAndUpdate(userId, { $addToSet: { wishlist: tourId } }, { returnDocument: 'after' })
            .populate('wishlist')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async removeFromWishlist(userId, tourId) {
        const user = await this.userModel
            .findByIdAndUpdate(userId, { $pull: { wishlist: tourId } }, { returnDocument: 'after' })
            .populate('wishlist')
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
    async getWishlist(userId) {
        const user = await this.userModel
            .findById(userId)
            .populate({
            path: 'wishlist',
            select: 'title slug thumbnailImage basePrice averageRating state location category',
        })
            .exec();
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user.wishlist;
    }
    async toggleWishlist(userId, tourId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        const tourExists = user.wishlist.some((id) => id.toString() === tourId);
        if (tourExists) {
            const updatedUser = await this.removeFromWishlist(userId, tourId);
            return { added: false, user: updatedUser };
        }
        else {
            const updatedUser = await this.addToWishlist(userId, tourId);
            return { added: true, user: updatedUser };
        }
    }
};
exports.WishlistService = WishlistService;
exports.WishlistService = WishlistService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __param(1, (0, mongoose_1.InjectModel)(tour_schema_1.Tour.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        mongoose_2.Model])
], WishlistService);
//# sourceMappingURL=wishlist.service.js.map