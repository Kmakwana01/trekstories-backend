"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomToursModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const custom_tours_controller_1 = require("./custom-tours.controller");
const custom_tours_service_1 = require("./custom-tours.service");
const custom_tour_schema_1 = require("./schemas/custom-tour.schema");
let CustomToursModule = class CustomToursModule {
};
exports.CustomToursModule = CustomToursModule;
exports.CustomToursModule = CustomToursModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: custom_tour_schema_1.CustomTour.name, schema: custom_tour_schema_1.CustomTourSchema }]),
        ],
        controllers: [custom_tours_controller_1.CustomToursController],
        providers: [custom_tours_service_1.CustomToursService],
        exports: [custom_tours_service_1.CustomToursService],
    })
], CustomToursModule);
//# sourceMappingURL=custom-tours.module.js.map