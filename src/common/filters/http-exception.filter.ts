/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AppLogger } from 'src/shared/logger/app-logger.service';
import { BusinessError } from '../errors/business.error';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let errorResponse = {
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Internal server error',
      details: null,
    };

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      errorResponse =
        typeof res === 'string'
          ? {
              code: 'HTTP_EXCEPTION',
              message: res,
              details: null,
            }
          : (res as any);
    }

    if (exception instanceof BusinessError) {
      status = HttpStatus.BAD_REQUEST;
      errorResponse = {
        code: exception.code,
        message: exception.message,
        details: exception.details ?? null,
      };
    }

    this.logger.error(
      errorResponse.message,
      exception instanceof Error ? exception.stack : undefined,
      {
        source: 'GlobalExceptionFilter',
        requestId: (request as any).requestId,
        path: request.url,
        method: request.method,
        statusCode: status,
      },
    );

    response.status(status).json({
      success: false,
      error: errorResponse,
      meta: {
        requestId: (request as any).requestId,
        timestamp: new Date().toISOString(),
      },
    });
  }
}
