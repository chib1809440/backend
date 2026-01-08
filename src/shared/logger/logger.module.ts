import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR, Reflector } from '@nestjs/core';
import winston from 'winston';
import { AppLogger } from './app-logger.service';
import { LoggingInterceptor } from './interceptor/logging.interceptor';
import { devFormat } from './logger.format';

@Module({
  providers: [
    Reflector,
    {
      provide: 'WINSTON',
      useValue: winston.createLogger({
        level: process.env.LOG_LEVEL || 'debug',
        defaultMeta: {
          service: 'backend-api',
        },
        format: devFormat,
        transports: [new winston.transports.Console()],
      }),
    },
    AppLogger,
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
  ],
  exports: [AppLogger],
})
export class LoggerModule {}
