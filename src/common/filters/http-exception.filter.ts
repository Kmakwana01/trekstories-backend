import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();
        const request = ctx.getRequest<Request>();

        const status =
            exception instanceof HttpException
                ? exception.getStatus()
                : HttpStatus.INTERNAL_SERVER_ERROR;

        const exceptionResponse: any =
            exception instanceof HttpException
                ? exception.getResponse()
                : { message: 'Internal server error' };

        const message =
            typeof exceptionResponse === 'string'
                ? exceptionResponse
                : exceptionResponse.message;

        const errors =
            typeof exceptionResponse === 'object' && exceptionResponse.errors
                ? exceptionResponse.errors
                : Array.isArray(message)
                    ? message
                    : undefined;

        const finalMessage =
            typeof message === 'string'
                ? message
                : Array.isArray(message)
                    ? message[0]
                    : 'Error occurred';

        response.status(status).json({
            success: false,
            statusCode: status,
            message: finalMessage,
            errors,
            path: request.url,
            timestamp: new Date().toISOString(),
        });
    }
}
