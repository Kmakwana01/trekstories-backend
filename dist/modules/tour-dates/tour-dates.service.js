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
exports.TourDatesService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const tour_date_schema_1 = require("../../database/schemas/tour-date.schema");
const date_util_1 = require("../../utils/date.util");
const tour_date_status_enum_1 = require("../../common/enums/tour-date-status.enum");
let TourDatesService = class TourDatesService {
    tourDateModel;
    constructor(tourDateModel) {
        this.tourDateModel = tourDateModel;
    }
    async getUpcomingDates(tourId) {
        const query = {
            tour: tourId,
            status: tour_date_status_enum_1.TourDateStatus.UPCOMING,
            startDate: { $gt: date_util_1.DateUtil.startOfDayIST(date_util_1.DateUtil.nowIST().toDate()) },
        };
        return this.tourDateModel.find(query).sort({ startDate: 1 }).exec();
    }
    async getTourDatesWithSeats(tourId) {
        const query = {
            tour: tourId,
            status: { $in: [tour_date_status_enum_1.TourDateStatus.UPCOMING, tour_date_status_enum_1.TourDateStatus.FULL] },
            startDate: { $gt: date_util_1.DateUtil.startOfDayIST(date_util_1.DateUtil.nowIST().toDate()) },
        };
        const dates = await this.tourDateModel
            .find(query)
            .sort({ startDate: 1 })
            .exec();
        return dates.map((d) => {
            const doc = d.toObject();
            return {
                ...doc,
                availableSeats: doc.totalSeats - doc.bookedSeats,
            };
        });
    }
    async adminCreateTourDate(createTourDateDto) {
        const { startDate, endDate } = createTourDateDto;
        if (date_util_1.DateUtil.parseISTToUTC(startDate) >= date_util_1.DateUtil.parseISTToUTC(endDate)) {
            throw new common_1.BadRequestException('Start date must be before end date');
        }
        const newDate = new this.tourDateModel({
            ...createTourDateDto,
            startDate: date_util_1.DateUtil.parseISTToUTC(startDate),
            endDate: date_util_1.DateUtil.parseISTToUTC(endDate),
        });
        return newDate.save();
    }
    async adminGetTourDates(tourId) {
        const query = { tour: tourId };
        return this.tourDateModel.find(query).sort({ startDate: 1 }).exec();
    }
    async adminUpdateTourDate(id, updateTourDateDto) {
        const updateData = { ...updateTourDateDto };
        if (updateData.startDate)
            updateData.startDate = date_util_1.DateUtil.parseISTToUTC(updateData.startDate);
        if (updateData.endDate)
            updateData.endDate = date_util_1.DateUtil.parseISTToUTC(updateData.endDate);
        const updatedDate = await this.tourDateModel
            .findByIdAndUpdate(id, updateData, { returnDocument: 'after' })
            .exec();
        if (!updatedDate) {
            throw new common_1.NotFoundException(`Tour date with ID ${id} not found`);
        }
        return updatedDate;
    }
    async adminDeleteTourDate(id) {
        const query = { _id: id };
        const result = await this.tourDateModel.findOneAndDelete(query).exec();
        if (!result) {
            throw new common_1.NotFoundException(`Tour date with ID ${id} not found`);
        }
    }
    async updateStatus(id, status) {
        const query = { _id: id };
        const updatedDate = await this.tourDateModel
            .findOneAndUpdate(query, { status }, { returnDocument: 'after' })
            .exec();
        if (!updatedDate) {
            throw new common_1.NotFoundException(`Tour date with ID ${id} not found`);
        }
        return updatedDate;
    }
    async autoUpdateStatuses() {
        const today = date_util_1.DateUtil.startOfDayIST(date_util_1.DateUtil.nowIST().toDate());
        const completedResult = await this.tourDateModel.updateMany({
            status: tour_date_status_enum_1.TourDateStatus.UPCOMING,
            endDate: { $lt: today },
        }, { status: tour_date_status_enum_1.TourDateStatus.COMPLETED });
        const fullResult = await this.tourDateModel.updateMany({
            status: tour_date_status_enum_1.TourDateStatus.UPCOMING,
            $expr: { $lte: ['$totalSeats', '$bookedSeats'] },
        }, { status: tour_date_status_enum_1.TourDateStatus.FULL });
        return `Updated ${completedResult.modifiedCount} to completed and ${fullResult.modifiedCount} to full.`;
    }
};
exports.TourDatesService = TourDatesService;
exports.TourDatesService = TourDatesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(tour_date_schema_1.TourDate.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TourDatesService);
//# sourceMappingURL=tour-dates.service.js.map