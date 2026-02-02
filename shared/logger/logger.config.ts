/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable prettier/prettier */
// common/logger/logger.config.ts
import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logLevel = process.env.LOG_LEVEL || 'info';
const nodeEnv = process.env.NODE_ENV || 'development';


const customFormat = winston.format.printf(
  ({ timestamp, level, message, context, correlationId, userId, requestId, trace, ...metadata }) => {
    const metaStr = Object.keys(metadata).length ? JSON.stringify(metadata, null, 2) : '';
    
    return [
      `${timestamp}`,
      `[${level.toUpperCase()}]`,
      correlationId ? `[CID: ${correlationId}]` : '',
      requestId ? `[RID: ${requestId}]` : '',
      userId ? `[UID: ${userId}]` : '',
      context ? `[${context}]` : '',
      message,
      trace ? `\n${trace}` : '',
      metaStr ? `\n${metaStr}` : '',
    ]
      .filter(Boolean)
      .join(' ');
  },
);

const developmentFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.colorize({ all: true }),
  customFormat,
);

const productionFormat = winston.format.combine(
  winston.format.timestamp(),
  winston.format.errors({ stack: true }),
  winston.format.json(),
);

const consoleTransport = new winston.transports.Console({
  format: nodeEnv === 'production' ? productionFormat : developmentFormat,
});

const allLogsTransport = new DailyRotateFile({
  filename: 'logs/application-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
});

const errorLogsTransport = new DailyRotateFile({
  level: 'error',
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '30d',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
});

export const winstonConfig: WinstonModuleOptions = {
  level: logLevel,
  transports: [
    consoleTransport,
    allLogsTransport,
    errorLogsTransport,
  ],
  exceptionHandlers: [
    new DailyRotateFile({
      filename: 'logs/exceptions-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: 'logs/rejections-%DATE%.log',
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
};
