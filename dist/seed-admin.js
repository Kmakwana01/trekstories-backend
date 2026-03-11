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
const seed_module_1 = require("./seed.module");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./database/schemas/user.schema");
const roles_enum_1 = require("./common/enums/roles.enum");
const bcrypt = __importStar(require("bcryptjs"));
const common_1 = require("@nestjs/common");
const gender_enum_1 = require("./common/enums/gender.enum");
async function bootstrap() {
    const logger = new common_1.Logger('SeedAdmin');
    const app = await core_1.NestFactory.createApplicationContext(seed_module_1.SeedModule);
    const userModel = app.get((0, mongoose_1.getModelToken)(user_schema_1.User.name));
    const adminEmail = 'shivanshholidays27@gmail.com';
    const adminPass = 'Shivansh@1212';
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(adminPass, salt);
    const existingAdmin = await userModel.findOne({ email: adminEmail });
    if (existingAdmin) {
        existingAdmin.role = roles_enum_1.Role.ADMIN;
        existingAdmin.isVerified = true;
        existingAdmin.passwordHash = passwordHash;
        existingAdmin.gender = 'MALE';
        existingAdmin.country = 'India';
        existingAdmin.contactAddress = '123 Admin St, New Delhi';
        existingAdmin.name = 'System Admin';
        existingAdmin.phone = '+919999999999';
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
            phone: '+919909899025',
            gender: gender_enum_1.Gender.MALE,
            dateOfBirth: new Date('1990-01-01'),
            country: 'India',
            contactAddress: 'Office No 426, 4th Floor, Star Plaza Phulchhab Chowk, Rajkot, Gujarat, India - 360001',
            lastLogin: new Date(),
        });
        logger.log('Admin user created successfully.');
    }
    logger.log('----------------------------------------');
    logger.log(`Email: ${adminEmail}`);
    logger.log(`Password: ${adminPass}`);
    logger.log('Use these credentials to log into the Admin Panel.');
    logger.log('----------------------------------------');
    await app.close();
    process.exit(0);
}
bootstrap();
//# sourceMappingURL=seed-admin.js.map