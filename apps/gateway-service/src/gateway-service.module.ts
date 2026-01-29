import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { seconds, ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import Joi from 'joi';
import { JwtAuthGuard } from 'shared/guards/jwt.guard';
import { JwtStrategy } from 'shared/guards/jwt.strategy';
import { LoggingMiddleware } from 'shared/middlewares/logging.middleware';
import { TrimPipe } from 'shared/pipes/trim.pipe';
import { EnvironmentVariables } from 'shared/utils/environment-variables';
import { GatewayServiceController } from './gateway-service.controller';

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
  ],
})
export class GatewayServiceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
