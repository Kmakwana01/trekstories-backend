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
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const path_1 = require("path");
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const logger_middleware_1 = require("./common/middleware/logger.middleware");
const admin_ip_middleware_1 = require("./common/middleware/admin-ip.middleware");
const serve_static_1 = require("@nestjs/serve-static");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const bull_1 = require("@nestjs/bull");
const mailer_1 = require("@nestjs-modules/mailer");
const handlebars_adapter_1 = require("@nestjs-modules/mailer/dist/adapters/handlebars.adapter");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_2 = require("@nestjs/config");
const configuration_1 = __importDefault(require("./config/configuration"));
const database_module_1 = require("./database/database.module");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const tours_module_1 = require("./modules/tours/tours.module");
const tour_dates_module_1 = require("./modules/tour-dates/tour-dates.module");
const wishlist_module_1 = require("./modules/wishlist/wishlist.module");
const bookings_module_1 = require("./modules/bookings/bookings.module");
const transactions_module_1 = require("./modules/transactions/transactions.module");
const blogs_module_1 = require("./modules/blogs/blogs.module");
const reviews_module_1 = require("./modules/reviews/reviews.module");
const coupons_module_1 = require("./modules/coupons/coupons.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const home_module_1 = require("./modules/home/home.module");
const admin_module_1 = require("./modules/admin/admin.module");
const crons_module_1 = require("./modules/crons/crons.module");
const settings_module_1 = require("./modules/settings/settings.module");
const team_members_module_1 = require("./modules/team-members/team-members.module");
const cache_manager_1 = require("@nestjs/cache-manager");
const redisStore = __importStar(require("cache-manager-ioredis"));
const common_module_1 = require("./common/common.module");
const refunds_module_1 = require("./modules/refunds/refunds.module");
const custom_tours_module_1 = require("./modules/custom-tours/custom-tours.module");
let AppModule = class AppModule {
    configure(consumer) {
        consumer.apply(logger_middleware_1.LoggerMiddleware).forRoutes('*');
        consumer.apply(admin_ip_middleware_1.AdminIpMiddleware).forRoutes('*');
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
                load: [configuration_1.default],
            }),
            common_module_1.CommonModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: (0, path_1.join)(__dirname, '..', 'uploads'),
                serveRoot: '/uploads',
            }),
            throttler_1.ThrottlerModule.forRoot([
                {
                    ttl: 60000,
                    limit: 30,
                },
            ]),
            schedule_1.ScheduleModule.forRoot(),
            database_module_1.DatabaseModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            tours_module_1.ToursModule,
            tour_dates_module_1.TourDatesModule,
            wishlist_module_1.WishlistModule,
            bookings_module_1.BookingsModule,
            transactions_module_1.TransactionsModule,
            blogs_module_1.BlogsModule,
            reviews_module_1.ReviewsModule,
            coupons_module_1.CouponsModule,
            notifications_module_1.NotificationsModule,
            home_module_1.HomeModule,
            admin_module_1.AdminModule,
            crons_module_1.CronsModule,
            settings_module_1.SettingsModule,
            team_members_module_1.TeamMembersModule,
            cache_manager_1.CacheModule.registerAsync({
                isGlobal: true,
                inject: [config_2.ConfigService],
                useFactory: (config) => ({
                    store: redisStore,
                    host: config.get('redis.host'),
                    port: config.get('redis.port'),
                    ttl: 600,
                }),
            }),
            bull_1.BullModule.forRootAsync({
                inject: [config_2.ConfigService],
                useFactory: (config) => ({
                    redis: {
                        host: config.get('redis.host'),
                        port: config.get('redis.port'),
                    },
                }),
            }),
            mailer_1.MailerModule.forRootAsync({
                inject: [config_2.ConfigService],
                useFactory: (config) => ({
                    transport: {
                        host: config.get('mail.host'),
                        port: config.get('mail.port'),
                        secure: config.get('mail.secure'),
                        auth: {
                            user: config.get('mail.user'),
                            pass: config.get('mail.pass'),
                        },
                    },
                    defaults: {
                        from: '"Travel App" <noreply@travelapp.com>',
                    },
                    template: {
                        dir: (0, path_1.join)(__dirname, 'modules/notifications/templates'),
                        adapter: new handlebars_adapter_1.HandlebarsAdapter(),
                        options: {
                            strict: true,
                        },
                    },
                }),
            }),
            refunds_module_1.RefundsModule,
            custom_tours_module_1.CustomToursModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map