"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./database/schemas/user.schema");
const roles_enum_1 = require("./common/enums/roles.enum");
const bcrypt = __importStar(require("bcryptjs"));
const common_1 = require("@nestjs/common");
async function bootstrap() {
    const logger = new common_1.Logger('SeedAdmin');
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userModel = app.get((0, mongoose_1.getModelToken)(user_schema_1.User.name));
    const adminEmail = 'info@trekstories.in';
    const adminPass = 'Shivansh@1212';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPass, salt);
    const existingAdmin = await userModel.findOne({ email: adminEmail });
    if (existingAdmin) {
        existingAdmin.role = roles_enum_1.Role.ADMIN;
        existingAdmin.isVerified = true;
        existingAdmin.passwordHash = passwordHash;
        await existingAdmin.save();
        logger.log('Admin user updated successfully.');
    }
    else {
        await userModel.create({
            name: 'System Admin',
            email: adminEmail,
            passwordHash: passwordHash,
            role: roles_enum_1.Role.ADMIN,
            isVerified: true,
            phone: '+910000000000',
        });
        logger.log('Admin user created successfully.');
    }
    logger.log('Email: ' + adminEmail);
    logger.log('Password: ' + adminPass);
    await app.close();
    process.exit(0);
}
bootstrap();
//# sourceMappingURL=seed-admin.js.map