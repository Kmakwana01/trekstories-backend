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
exports.CustomTourSchema = exports.CustomTour = exports.CustomTourStatus = void 0;
const mongoose_1 = require("@nestjs/mongoose");
var CustomTourStatus;
(function (CustomTourStatus) {
    CustomTourStatus["PENDING"] = "PENDING";
    CustomTourStatus["CONTACTED"] = "CONTACTED";
    CustomTourStatus["RESOLVED"] = "RESOLVED";
    CustomTourStatus["CLOSED"] = "CLOSED";
})(CustomTourStatus || (exports.CustomTourStatus = CustomTourStatus = {}));
let CustomTour = class CustomTour {
    name;
    email;
    phone;
    destination;
    duration;
    travelDate;
    groupSize;
    message;
    status;
    adminNotes;
};
exports.CustomTour = CustomTour;
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomTour.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomTour.prototype, "email", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomTour.prototype, "phone", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true }),
    __metadata("design:type", String)
], CustomTour.prototype, "destination", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], CustomTour.prototype, "duration", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Date)
], CustomTour.prototype, "travelDate", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", Number)
], CustomTour.prototype, "groupSize", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], CustomTour.prototype, "message", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: CustomTourStatus, default: CustomTourStatus.PENDING }),
    __metadata("design:type", String)
], CustomTour.prototype, "status", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: false }),
    __metadata("design:type", String)
], CustomTour.prototype, "adminNotes", void 0);
exports.CustomTour = CustomTour = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], CustomTour);
exports.CustomTourSchema = mongoose_1.SchemaFactory.createForClass(CustomTour);
//# sourceMappingURL=custom-tour.schema.js.map