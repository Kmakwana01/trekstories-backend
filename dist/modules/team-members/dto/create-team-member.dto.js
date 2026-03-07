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
exports.CreateTeamMemberDto = exports.SocialLinksDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class SocialLinksDto {
    facebook;
    instagram;
    twitter;
    linkedin;
    youtube;
}
exports.SocialLinksDto = SocialLinksDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'Facebook URL must be valid' }),
    __metadata("design:type", String)
], SocialLinksDto.prototype, "facebook", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'Instagram URL must be valid' }),
    __metadata("design:type", String)
], SocialLinksDto.prototype, "instagram", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'Twitter URL must be valid' }),
    __metadata("design:type", String)
], SocialLinksDto.prototype, "twitter", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'LinkedIn URL must be valid' }),
    __metadata("design:type", String)
], SocialLinksDto.prototype, "linkedin", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUrl)({}, { message: 'YouTube URL must be valid' }),
    __metadata("design:type", String)
], SocialLinksDto.prototype, "youtube", void 0);
class CreateTeamMemberDto {
    name;
    designation;
    bio;
    image;
    socialLinks;
    order;
    isActive;
}
exports.CreateTeamMemberDto = CreateTeamMemberDto;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTeamMemberDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTeamMemberDto.prototype, "designation", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTeamMemberDto.prototype, "bio", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateTeamMemberDto.prototype, "image", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        let parsed = value;
        if (typeof value === 'string') {
            try {
                parsed = JSON.parse(value);
            }
            catch {
                parsed = {};
            }
        }
        return (0, class_transformer_1.plainToInstance)(SocialLinksDto, parsed);
    }),
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.ValidateNested)(),
    __metadata("design:type", SocialLinksDto)
], CreateTeamMemberDto.prototype, "socialLinks", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Number),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateTeamMemberDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Transform)(({ value }) => {
        if (value === 'true')
            return true;
        if (value === 'false')
            return false;
        return value;
    }),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateTeamMemberDto.prototype, "isActive", void 0);
//# sourceMappingURL=create-team-member.dto.js.map