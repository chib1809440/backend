import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { AppLogger } from '../logger/app-logger.service';
import { ClsService } from 'nestjs-cls';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: AppLogger,
    private readonly cls: ClsService,
  ) {
    this.logger.setContext('HTTP');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();
    const { method, url, body, query, params } = request;
    const startTime = this.cls.get<number>('requestStartTime') || Date.now();
    const correlationId = this.cls.get<string>('correlationId');

    // Thêm correlation ID vào response header
    response.setHeader('X-Correlation-Id', correlationId);
    response.setHeader('X-Request-Id', this.cls.get<string>('requestId'));

    // Log incoming request
    this.logger.info(`Incoming Request: ${method} ${url}`, {
      body: this.sanitizeBody(body),
      query,
      params,
    });

    return next.handle().pipe(
      tap(() => {
        const duration = Date.now() - startTime;
        this.logger.logHttpRequest(
          method,
          url,
          response.statusCode,
          duration,
        );
      }),
      catchError((error) => {
        const duration = Date.now() - startTime;
        this.logger.logHttpRequest(
          method,
          url,
          error.status || 500,
          duration,
          {
            error: error.message,
            stack: error.stack,
          },
        );
        throw error;
      }),
    );
  }

  /**
   * Loại bỏ sensitive data khỏi logs
   */
  private sanitizeBody(body: any): any {
    if (!body) return body;

    const sanitized = { ...body };
    const sensitiveFields = ['password', 'token', 'secret', 'apiKey', 'creditCard'];

    sensitiveFields.forEach((field) => {
      if (sanitized[field]) {
        sanitized[field] = '***REDACTED***';
      }
    });

    return sanitized;
  }
}
