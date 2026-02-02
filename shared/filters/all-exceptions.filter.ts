import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AppLogger } from '../logger/app-logger.service';
import { ClsService } from 'nestjs-cls';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(
    private readonly logger: AppLogger,
    private readonly cls: ClsService,
  ) {
    this.logger.setContext('ExceptionFilter');
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();

    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const correlationId = this.cls.get<string>('correlationId');
    const requestId = this.cls.get<string>('requestId');

    // Log error với full context
    this.logger.error(
      `Exception occurred: ${message}`,
      exception instanceof Error ? exception.stack : '',
      {
        statusCode: status,
        path: request.url,
        method: request.method,
        errorName: exception instanceof Error ? exception.name : 'Unknown',
      },
    );

    // Response với correlation ID để client có thể trace
    response.status(status).json({
      statusCode: status,
      message,
      correlationId,
      requestId,
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
