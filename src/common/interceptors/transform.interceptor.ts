import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    success: boolean;
    statusCode: number;
    message: string;
    data: T;
    meta?: any;
}

@Injectable()
export class TransformInterceptor<T>
    implements NestInterceptor<T, Response<T>> {
    intercept(
        context: ExecutionContext,
        next: CallHandler,
    ): Observable<Response<T>> {
        return next.handle().pipe(
            map(data => {
                // Handle cases where data is already in expected format
                if (data && data.success !== undefined && data.data !== undefined)
                {
                    return data;
                }

                const ctx = context.switchToHttp();
                const response = ctx.getResponse();
                const statusCode = response.statusCode;

                // Check if data has meta (pagination)
                let responseData = data;
                let meta = undefined;

                if (data && data.data && data.total !== undefined)
                {
                    responseData = data.data;
                    const { data: _, ...rest } = data;
                    meta = rest;
                }

                // Determine message and potentially strip it from data if it exists there
                let message = 'Operation successful';
                let finalData = responseData;

                if (data && data.message)
                {
                    message = data.message;
                    // If data is an object and contains message, we might want to keep it or strip it.
                    // User complained about "double message", so we strip it from data if we move it to root.
                    if (typeof responseData === 'object' && responseData !== null && 'message' in responseData)
                    {
                        const { message: _, ...rest } = responseData as any;
                        finalData = rest;
                    }
                }

                return {
                    success: true,
                    statusCode,
                    message,
                    data: finalData,
                    meta,
                };
            }),
        );
    }
}
