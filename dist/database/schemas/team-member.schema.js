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
exports.TeamMemberSchema = exports.TeamMember = exports.SocialLinks = void 0;
const mongoose_1 = require("@nestjs/mongoose");
class SocialLinks {
    facebook;
    instagram;
    twitter;
    linkedin;
    youtube;
}
exports.SocialLinks = SocialLinks;
let TeamMember = class TeamMember {
    name;
    designation;
    bio;
    image;
    socialLinks;
    order;
    isActive;
};
exports.TeamMember = TeamMember;
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "name", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, trim: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "designation", void 0);
__decorate([
    (0, mongoose_1.Prop)({ trim: true }),
    __metadata("design:type", String)
], TeamMember.prototype, "bio", void 0);
__decorate([
    (0, mongoose_1.Prop)(),
    __metadata("design:type", String)
], TeamMember.prototype, "image", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: Object, default: {} }),
    __metadata("design:type", SocialLinks)
], TeamMember.prototype, "socialLinks", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: 0, index: true }),
    __metadata("design:type", Number)
], TeamMember.prototype, "order", void 0);
__decorate([
    (0, mongoose_1.Prop)({ default: true, index: true }),
    __metadata("design:type", Boolean)
], TeamMember.prototype, "isActive", void 0);
exports.TeamMember = TeamMember = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], TeamMember);
exports.TeamMemberSchema = mongoose_1.SchemaFactory.createForClass(TeamMember);
exports.TeamMemberSchema.index({ isActive: 1, order: 1 });
//# sourceMappingURL=team-member.schema.js.map