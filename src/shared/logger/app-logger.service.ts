// src/shared/logger/app-logger.service.ts
import { Inject, Injectable } from '@nestjs/common';
import { Logger } from 'winston';
import { AppLoggerPort } from './app-logger.port';
import { LogContext } from './types/log-context.type';

@Injectable()
export class AppLogger implements AppLoggerPort {
  constructor(
    @Inject('WINSTON')
    private readonly logger: Logger,
  ) {}

  info(message: string, context?: LogContext): void {
    this.logger.info(message, context);
  }

  warn(message: string, context?: LogContext): void {
    this.logger.warn(message, context);
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.logger.error(message, {
      ...context,
      stack: error?.stack,
    });
  }

  debug(message: string, context?: LogContext): void {
    this.logger.debug(message, context);
  }
}
