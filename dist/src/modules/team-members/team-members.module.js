"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamMembersModule = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const team_members_service_1 = require("./team-members.service");
const team_members_controller_1 = require("./team-members.controller");
const admin_team_members_controller_1 = require("./admin-team-members.controller");
const team_member_schema_1 = require("../../database/schemas/team-member.schema");
const admin_module_1 = require("../admin/admin.module");
let TeamMembersModule = class TeamMembersModule {
};
exports.TeamMembersModule = TeamMembersModule;
exports.TeamMembersModule = TeamMembersModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([
                { name: team_member_schema_1.TeamMember.name, schema: team_member_schema_1.TeamMemberSchema },
            ]),
            admin_module_1.AdminModule,
        ],
        controllers: [team_members_controller_1.TeamMembersController, admin_team_members_controller_1.AdminTeamMembersController],
        providers: [team_members_service_1.TeamMembersService],
        exports: [team_members_service_1.TeamMembersService],
    })
], TeamMembersModule);
//# sourceMappingURL=team-members.module.js.map