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
exports.TeamMembersService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const team_member_schema_1 = require("../../database/schemas/team-member.schema");
const pagination_helper_1 = require("../../common/helpers/pagination.helper");
let TeamMembersService = class TeamMembersService {
    teamMemberModel;
    constructor(teamMemberModel) {
        this.teamMemberModel = teamMemberModel;
    }
    async create(createDto, imageUrl) {
        const data = { ...createDto };
        if (imageUrl)
            data.image = imageUrl;
        if (typeof data.socialLinks === 'string') {
            try {
                data.socialLinks = JSON.parse(data.socialLinks);
            }
            catch {
                data.socialLinks = {};
            }
        }
        const member = new this.teamMemberModel(data);
        return member.save();
    }
    async findAllPublic() {
        return this.teamMemberModel
            .find({ isActive: true })
            .sort({ order: 1, createdAt: 1 })
            .lean()
            .exec();
    }
    async findAllAdmin(filters) {
        const { search, isActive, ...paginationQuery } = filters;
        const query = {};
        if (typeof isActive === 'boolean') {
            query.isActive = isActive;
        }
        if (search) {
            const regex = new RegExp(search, 'i');
            query.$or = [
                { name: regex },
                { designation: regex },
                { bio: regex },
            ];
        }
        if (!paginationQuery.sort) {
            paginationQuery.sort = 'order';
            paginationQuery.order = 'asc';
        }
        return (0, pagination_helper_1.paginate)(this.teamMemberModel, query, paginationQuery);
    }
    async findOne(id) {
        const member = await this.teamMemberModel.findById(id).lean().exec();
        if (!member)
            throw new common_1.NotFoundException(`Team member with ID '${id}' not found`);
        return member;
    }
    async update(id, updateDto, imageUrl) {
        const member = await this.teamMemberModel.findById(id);
        if (!member)
            throw new common_1.NotFoundException(`Team member with ID '${id}' not found`);
        const updates = { ...updateDto };
        if (typeof updates.socialLinks === 'string') {
            try {
                updates.socialLinks = JSON.parse(updates.socialLinks);
            }
            catch {
                delete updates.socialLinks;
            }
        }
        if (imageUrl)
            updates.image = imageUrl;
        Object.assign(member, updates);
        return member.save();
    }
    async remove(id) {
        const result = await this.teamMemberModel.findByIdAndDelete(id);
        if (!result)
            throw new common_1.NotFoundException(`Team member with ID '${id}' not found`);
    }
    async toggleActive(id) {
        const member = await this.teamMemberModel.findById(id);
        if (!member)
            throw new common_1.NotFoundException(`Team member with ID '${id}' not found`);
        member.isActive = !member.isActive;
        return member.save();
    }
};
exports.TeamMembersService = TeamMembersService;
exports.TeamMembersService = TeamMembersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(team_member_schema_1.TeamMember.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TeamMembersService);
//# sourceMappingURL=team-members.service.js.map