import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
      this.logger.error(
        `Internal Server Error on ${request.url}`,
        exception instanceof Error
          ? exception.stack
          : JSON.stringify(exception),
      );
    }

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
