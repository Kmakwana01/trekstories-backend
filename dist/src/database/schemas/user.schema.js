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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSchema = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const roles_enum_1 = require("../../common/enums/roles.enum");
const gender_enum_1 = require("../../common/enums/gender.enum");
let SavedTraveler = class SavedTraveler {
    fullName;
    age;
    gender;
    idNumber;
};
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SavedTraveler.prototype, "fullName", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Number)
], SavedTraveler.prototype, "age", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(gender_enum_1.Gender),
        uppercase: true,
        trim: true,
    }),
    __metadata("design:type", String)
], SavedTraveler.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], SavedTraveler.prototype, "idNumber", void 0);
SavedTraveler = __decorate([
    (0, mongoose_1.Schema)()
], SavedTraveler);
const SavedTravelerSchema = mongoose_1.SchemaFactory.createForClass(SavedTraveler);
let User = class User {
    name;
    email;
    phone;
    avatar;
    passwordHash;
    gender;
    dateOfBirth;
    country;
    contactAddress;
    role;
    isVerified;
    isBlocked;
    otp;
    otpExpiry;
    resetToken;
    resetTokenExpiry;
    lastLogin;
    refreshTokenHash;
    wishlist;
    savedTravelers;
    internalNotes;
    adminNotes;
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], User.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, unique: true }),
    __metadata("design:type", String)
], User.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ unique: true, sparse: true }),
    __metadata("design:type", String)
], User.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "avatar", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "passwordHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(gender_enum_1.Gender),
        uppercase: true,
        trim: true,
    }),
    __metadata("design:type", String)
], User.prototype, "gender", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "dateOfBirth", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "country", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "contactAddress", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: Object.values(roles_enum_1.Role),
        default: roles_enum_1.Role.CUSTOMER,
        uppercase: true,
        trim: true,
        index: true,
    }),
    __metadata("design:type", String)
], User.prototype, "role", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true, index: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isVerified", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: false, index: true }),
    __metadata("design:type", Boolean)
], User.prototype, "isBlocked", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "otp", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "otpExpiry", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "resetToken", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "resetTokenExpiry", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", Date)
], User.prototype, "lastLogin", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "refreshTokenHash", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [{ type: mongoose_2.Schema.Types.ObjectId, ref: 'Tour' }] }),
    __metadata("design:type", Array)
], User.prototype, "wishlist", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [SavedTravelerSchema] }),
    __metadata("design:type", Array)
], User.prototype, "savedTravelers", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], User.prototype, "internalNotes", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: [
            {
                note: String,
                createdAt: { type: Date, default: Date.now },
                adminId: { type: mongoose_2.Schema.Types.ObjectId, ref: 'User' },
            },
        ],
        default: [],
    }),
    __metadata("design:type", Array)
], User.prototype, "adminNotes", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], User);
exports.UserSchema = mongoose_1.SchemaFactory.createForClass(User);
//# sourceMappingURL=user.schema.js.map