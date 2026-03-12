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
const custom_tour_schema_1 = require("./schemas/custom-tour.schema");
let CustomToursService = class CustomToursService {
    customTourModel;
    constructor(customTourModel) {
        this.customTourModel = customTourModel;
    }
    async create(createCustomTourDto) {
        const createdCustomTour = new this.customTourModel(createCustomTourDto);
        return createdCustomTour.save();
    }
    async findAll(query = {}) {
        const page = parseInt(query.page) || 1;
        const limit = parseInt(query.limit) || 10;
        const skip = (page - 1) * limit;
        const filter = {};
        if (query.status) {
            filter.status = query.status;
        }
        const [data, total] = await Promise.all([
            this.customTourModel.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).exec(),
            this.customTourModel.countDocuments(filter),
        ]);
        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const customTour = await this.customTourModel.findById(id).exec();
        if (!customTour) {
            throw new common_1.NotFoundException(`Custom tour request #${id} not found`);
        }
        return customTour;
    }
    async update(id, updateCustomTourDto) {
        const updatedCustomTour = await this.customTourModel
            .findByIdAndUpdate(id, updateCustomTourDto, { new: true })
            .exec();
        if (!updatedCustomTour) {
            throw new common_1.NotFoundException(`Custom tour request #${id} not found`);
        }
        return updatedCustomTour;
    }
    async remove(id) {
        const result = await this.customTourModel.findByIdAndDelete(id).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Custom tour request #${id} not found`);
        }
    }
};
exports.CustomToursService = CustomToursService;
exports.CustomToursService = CustomToursService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(custom_tour_schema_1.CustomTour.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], CustomToursService);
//# sourceMappingURL=custom-tours.service.js.map