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
exports.CustomToursService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const custom_tour_request_schema_1 = require("./schemas/custom-tour-request.schema");
let CustomToursService = class CustomToursService {
    model;
    constructor(model) {
        this.model = model;
    }
    async create(dto) {
        const doc = await this.model.create(dto);
        return doc;
    }
    async findAll(filter) {
        const { status, search, page = 1, limit = 15 } = filter;
        const query = {};
        if (status)
            query.status = status;
        if (search) {
            const re = new RegExp(search, 'i');
            query.$or = [{ name: re }, { email: re }, { phone: re }, { destination: re }];
        }
        const skip = (page - 1) * limit;
        const [items, total] = await Promise.all([
            this.model.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
            this.model.countDocuments(query),
        ]);
        return {
            items,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    }
    async findOne(id) {
        const doc = await this.model.findById(id).lean();
        if (!doc)
            throw new common_1.NotFoundException('Custom tour request not found');
        return doc;
    }
    async updateStatus(id, dto) {
        const doc = await this.model.findByIdAndUpdate(id, { status: dto.status, ...(dto.adminNotes !== undefined && { adminNotes: dto.adminNotes }) }, { new: true }).lean();
        if (!doc)
            throw new common_1.NotFoundException('Custom tour request not found');
        return doc;
    }
    async getStats() {
        const [total, newCount, contacted, closed] = await Promise.all([
            this.model.countDocuments(),
            this.model.countDocuments({ status: 'NEW' }),
            this.model.countDocuments({ status: 'CONTACTED' }),
            this.model.countDocuments({ status: 'CLOSED' }),
        ]);
        return { total, new: newCount, contacted, closed };
    }
};
exports.CustomToursService = CustomToursService;
exports.CustomToursService = CustomToursService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(custom_tour_request_schema_1.CustomTourRequest.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CustomToursService);
//# sourceMappingURL=custom-tours.service.js.map