"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformInterceptor = void 0;
const common_1 = require("@nestjs/common");
const operators_1 = require("rxjs/operators");
let TransformInterceptor = class TransformInterceptor {
    intercept(context, next) {
        return next.handle().pipe((0, operators_1.map)((data) => {
            if (data && data.success !== undefined && data.data !== undefined) {
                return data;
            }
            const ctx = context.switchToHttp();
            const response = ctx.getResponse();
            const statusCode = response.statusCode;
            let responseData = data;
            let meta = undefined;
            if (data && data.data && data.total !== undefined) {
                responseData = data.data;
                const { data: _, ...rest } = data;
                meta = rest;
            }
            let message = 'Operation successful';
            let finalData = responseData;
            if (data && data.message) {
                message = data.message;
                if (typeof responseData === 'object' && responseData !== null) {
                    const rawData = typeof responseData.toObject === 'function'
                        ? responseData.toObject()
                        : { ...responseData };
                    if ('message' in rawData) {
                        const { message: _, ...rest } = rawData;
                        finalData = rest;
                    }
                    else {
                        finalData = rawData;
                    }
                }
            }
            return {
                success: true,
                statusCode,
                message,
                data: finalData,
                meta,
            };
        }));
    }
};
exports.TransformInterceptor = TransformInterceptor;
exports.TransformInterceptor = TransformInterceptor = __decorate([
    (0, common_1.Injectable)()
], TransformInterceptor);
//# sourceMappingURL=transform.interceptor.js.map