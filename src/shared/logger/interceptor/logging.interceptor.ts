/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable, tap } from 'rxjs';
import { AppLogger } from '../app-logger.service';
import { SERVICE_NAME_KEY } from '../decorators/service-name.decorator';
import { sanitizeResponse } from '../utils/sanitize-response';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: AppLogger,
    private readonly reflector: Reflector,
  ) {}

  private inferServiceName(controller: Function): string {
    return controller.name
      .replace('Controller', '')
      .replace(/([a-z])([A-Z])/g, '$1-$2')
      .toLowerCase();
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const req = context.switchToHttp().getRequest();
    const res = context.switchToHttp().getResponse();

    const reqCtx = req.context;

    const serviceFromDecorator =
      this.reflector.get<string>(SERVICE_NAME_KEY, context.getHandler()) ??
      this.reflector.get<string>(SERVICE_NAME_KEY, context.getClass());

    const inferredService = this.inferServiceName(context.getClass());

    const service = serviceFromDecorator ?? inferredService;

    return next.handle().pipe(
      tap({
        next: (data) => {
          const durationMs = Date.now() - reqCtx.startTime;

          this.logger.info('HTTP Response', {
            service,
            controller: context.getClass().name,
            handler: context.getHandler().name,
            requestId: reqCtx.requestId,
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs,
            responseBody: sanitizeResponse(data),
          });
        },
        error: (err) => {
          const durationMs = Date.now() - reqCtx.startTime;

          this.logger.error('HTTP Error', err, {
            service,
            controller: context.getClass().name,
            handler: context.getHandler().name,
            requestId: reqCtx.requestId,
            method: req.method,
            path: req.originalUrl,
            statusCode: res.statusCode,
            durationMs,
          });
        },
      }),
    );
  }
}
