"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TourDatesModule = void 0;
const common_1 = require("@nestjs/common");
const tour_dates_service_1 = require("./tour-dates.service");
const tour_dates_controller_1 = require("./tour-dates.controller");
const database_module_1 = require("../../database/database.module");
const admin_module_1 = require("../admin/admin.module");
let TourDatesModule = class TourDatesModule {
};
exports.TourDatesModule = TourDatesModule;
exports.TourDatesModule = TourDatesModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule, admin_module_1.AdminModule],
        providers: [tour_dates_service_1.TourDatesService],
        controllers: [tour_dates_controller_1.TourDatesController, tour_dates_controller_1.AdminTourDatesController],
        exports: [tour_dates_service_1.TourDatesService],
    })
], TourDatesModule);
//# sourceMappingURL=tour-dates.module.js.map