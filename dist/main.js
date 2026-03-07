"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const transform_interceptor_1 = require("./common/interceptors/transform.interceptor");
const http_exception_filter_1 = require("./common/filters/http-exception.filter");
const config_1 = require("@nestjs/config");
const helmet_1 = __importDefault(require("helmet"));
const swagger_1 = require("@nestjs/swagger");
const nest_winston_1 = require("nest-winston");
const winston_config_1 = require("./common/logger/winston.config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: nest_winston_1.WinstonModule.createLogger(winston_config_1.winstonConfig),
    });
    app.use((0, helmet_1.default)());
    app.use(helmet_1.default.crossOriginResourcePolicy({ policy: 'cross-origin' }));
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'https://trekstories.in',
            'https://www.trekstories.in',
            'https://travel-frontend-m1bhuxejy-shivanshholidays27-4685s-projects.vercel.app'
        ],
        methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
        credentials: true,
    });
    app.setGlobalPrefix('api');
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Travel App API')
        .setDescription('Travel Booking Platform API documentation')
        .setVersion('1.0')
        .addBearerAuth()
        .build();
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
    }));
    app.useGlobalInterceptors(new transform_interceptor_1.TransformInterceptor());
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    const port = configService.get('port') || 3000;
    await app.listen(port, '0.0.0.0');
    console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
//# sourceMappingURL=main.js.map