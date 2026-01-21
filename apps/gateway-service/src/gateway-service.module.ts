import { InfrastructureModule } from '@app/infrastructure/infrastructure.module';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AuthenticationGuard } from 'shared/guards/auth.guards';
import { TransformInterceptor } from 'shared/interceptors/transform.interceptor';
import { LoggingMiddleware } from 'shared/middlewares/logging.middleware';
import { GatewayServiceController } from './gateway-service.controller';

@Module({
  imports: [InfrastructureModule],
  controllers: [GatewayServiceController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
  ],
})
export class GatewayServiceModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggingMiddleware).forRoutes('*');
  }
}
