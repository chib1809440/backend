/* eslint-disable prettier/prettier */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable, LoggerService as NestLoggerService, Scope } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import { Logger } from 'winston';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

export interface LogMetadata {
  [key: string]: any;
}

@Injectable({ scope: Scope.TRANSIENT })
export class AppLogger implements NestLoggerService {
  private context?: string;

  constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private readonly winstonLogger: Logger,
    private readonly cls: ClsService,
  ) {}

  setContext(context: string): void {
    this.context = context;
  }

  /**
   * Lấy metadata từ CLS để tự động inject vào mọi log
   */
  private getContextMetadata(): Record<string, any> {
    return {
      correlationId: this.cls.get('correlationId'),
      requestId: this.cls.get('requestId'),
      userId: this.cls.get('userId'),
      tenantId: this.cls.get('tenantId'),
      userAgent: this.cls.get('userAgent'),
      ip: this.cls.get('ip'),
      method: this.cls.get('method'),
      url: this.cls.get('url'),
      context: this.context,
    };
  }

  /**
   * Merge metadata từ CLS và custom metadata
   */
  private mergeMetadata(metadata?: LogMetadata): Record<string, any> {
    const contextMetadata = this.getContextMetadata();
    return {
      ...contextMetadata,
      ...metadata,
    };
  }

  log(message: string, metadata?: LogMetadata): void {
    this.winstonLogger.info(message, this.mergeMetadata(metadata));
  }

  info(message: string, metadata?: LogMetadata): void {
    this.winstonLogger.info(message, this.mergeMetadata(metadata));
  }

  error(message: string, trace?: string, metadata?: LogMetadata): void {
    this.winstonLogger.error(message, this.mergeMetadata({ ...metadata, trace }));
  }

  warn(message: string, metadata?: LogMetadata): void {
    this.winstonLogger.warn(message, this.mergeMetadata(metadata));
  }

  debug(message: string, metadata?: LogMetadata): void {
    this.winstonLogger.debug(message, this.mergeMetadata(metadata));
  }

  verbose(message: string, metadata?: LogMetadata): void {
    this.winstonLogger.verbose(message, this.mergeMetadata(metadata));
  }

  /**
   * Log với performance timing
   */
  logWithTiming(message: string, startTime: number, metadata?: LogMetadata): void {
    const duration = Date.now() - startTime;
    this.log(message, {
      ...metadata,
      duration: `${duration}ms`,
    });
  }

  /**
   * Log HTTP request
   */
  logHttpRequest(method: string, url: string, statusCode: number, duration: number, metadata?: LogMetadata): void {
    const level = statusCode >= 500 ? 'error' : statusCode >= 400 ? 'warn' : 'info';
    
    this.winstonLogger.log(level, `HTTP ${method} ${url} ${statusCode}`, this.mergeMetadata({
      ...metadata,
      statusCode,
      duration: `${duration}ms`,
    }));
  }

  /**
   * Log database query
   */
  logQuery(query: string, duration: number, metadata?: LogMetadata): void {
    this.debug(`Database Query`, {
      ...metadata,
      query,
      duration: `${duration}ms`,
    });
  }

  /**
   * Log external API call
   */
  logExternalCall(service: string, method: string, url: string, duration: number, metadata?: LogMetadata): void {
    this.info(`External API Call: ${service}`, {
      ...metadata,
      method,
      url,
      duration: `${duration}ms`,
    });
  }

  /**
   * Log business event
   */
  logEvent(eventName: string, metadata?: LogMetadata): void {
    this.info(`Event: ${eventName}`, {
      ...metadata,
      eventType: 'business',
    });
  }

  /**
   * Log security event
   */
  logSecurityEvent(eventName: string, metadata?: LogMetadata): void {
    this.warn(`Security Event: ${eventName}`, {
      ...metadata,
      eventType: 'security',
    });
  }
}
