"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WishlistModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const wishlist_service_1 = require("./wishlist.service");
const wishlist_controller_1 = require("./wishlist.controller");
const user_schema_1 = require("../../database/schemas/user.schema");
const tour_schema_1 = require("../../database/schemas/tour.schema");
let WishlistModule = class WishlistModule {
};
exports.WishlistModule = WishlistModule;
exports.WishlistModule = WishlistModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: user_schema_1.User.name, schema: user_schema_1.UserSchema },
                { name: tour_schema_1.Tour.name, schema: tour_schema_1.TourSchema },
            ]),
        ],
        providers: [wishlist_service_1.WishlistService],
        controllers: [wishlist_controller_1.WishlistController],
        exports: [wishlist_service_1.WishlistService],
    })
], WishlistModule);
//# sourceMappingURL=wishlist.module.js.map