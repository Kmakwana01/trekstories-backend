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
exports.CustomTourRequestSchema = exports.CustomTourRequest = exports.CustomTourStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var CustomTourStatus;
(function (CustomTourStatus) {
    CustomTourStatus["NEW"] = "NEW";
    CustomTourStatus["CONTACTED"] = "CONTACTED";
    CustomTourStatus["CLOSED"] = "CLOSED";
})(CustomTourStatus || (exports.CustomTourStatus = CustomTourStatus = {}));
let CustomTourRequest = class CustomTourRequest {
    name;
    email;
    phone;
    destination;
    travelDates;
    groupSize;
    budget;
    tourType;
    message;
    status;
    adminNotes;
};
exports.CustomTourRequest = CustomTourRequest;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], CustomTourRequest.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true, lowercase: true }),
    __metadata("design:type", String)
], CustomTourRequest.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], CustomTourRequest.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], CustomTourRequest.prototype, "destination", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, default: '' }),
    __metadata("design:type", String)
], CustomTourRequest.prototype, "travelDates", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 1, min: 1 }),
    __metadata("design:type", Number)
], CustomTourRequest.prototype, "groupSize", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, default: '' }),
    __metadata("design:type", String)
], CustomTourRequest.prototype, "budget", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, default: '' }),
    __metadata("design:type", String)
], CustomTourRequest.prototype, "tourType", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], CustomTourRequest.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({
        type: String,
        enum: CustomTourStatus,
        default: CustomTourStatus.NEW,
    }),
    __metadata("design:type", String)
], CustomTourRequest.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true, default: '' }),
    __metadata("design:type", String)
], CustomTourRequest.prototype, "adminNotes", void 0);
exports.CustomTourRequest = CustomTourRequest = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CustomTourRequest);
exports.CustomTourRequestSchema = mongoose_1.SchemaFactory.createForClass(CustomTourRequest);
//# sourceMappingURL=custom-tour-request.schema.js.map