import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import Joi from 'joi';
import { JwtAuthGuard } from 'shared/guards/jwt.guard';
import { JwtStrategy } from 'shared/guards/jwt.strategy';
import { LoggingMiddleware } from 'shared/middlewares/logging.middleware';
import { TenantMiddleware } from 'shared/middlewares/tenant.middleware';
import { TrimPipe } from 'shared/pipes/trim.pipe';
import { EnvironmentVariables } from 'shared/utils/environment-variables';
import { TenantContext } from 'shared/utils/tenant.context';
import { GatewayServiceController } from './gateway-service.controller';
import { GatewayServiceService } from './gateway-service.service';
import { LoggerModule } from 'shared/logger/logger.module';
import { v4 as uuidv4 } from 'uuid';
import { Request } from 'express';
import { ClsModule } from 'nestjs-cls';


interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    roles?: string[];
    tenantId?: string;
  };
}


@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        THROTTLER_TTL_SECONDS: Joi.number().required(),
        THROTTLER_LIMIT: Joi.number().required(),
      }),
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => [
        {
          ttl: seconds(config.get('THROTTLER_TTL_SECONDS')),
          limit: config.get('THROTTLER_LIMIT'),
        },
      ],
    }),
     ClsModule.forRoot({
      global: true,
      middleware: {
        mount: true,
        generateId: true,
        setup: (cls, req: RequestWithUser) => {
          // Correlation ID - từ header hoặc tạo mới
          const correlationId = (req.headers['x-correlation-id'] as string) || uuidv4();
          cls.set('correlationId', correlationId);
          
          // Request ID - unique cho mỗi request
          cls.set('requestId', uuidv4());
          
          // User info - từ JWT token
          cls.set('userId', req.user?.id);
          cls.set('userEmail', req.user?.email);
          
          // Tenant info - cho multi-tenancy
          cls.set('tenantId', req.headers['x-tenant-id']);
          
          // Request metadata
          cls.set('method', req.method);
          cls.set('url', req.url);
          cls.set('userAgent', req.headers['user-agent']);
          cls.set('ip', req.ip || req.connection.remoteAddress);
          
          // Timestamp
          cls.set('requestStartTime', Date.now());
        },
      },
    }),
    LoggerModule,
  ],
  controllers: [GatewayServiceController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_PIPE,
      useClass: TrimPipe,
    },
    JwtStrategy,
    JwtAuthGuard,
    TenantContext,
    GatewayServiceService,
  ],
})
export class GatewayServiceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware, TenantMiddleware).forRoutes('*');
  }
}
