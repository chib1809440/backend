import { DynamicModule, Global, Module } from '@nestjs/common';
import { RabbitMQClient } from './client/rabbitmq.client';

@Global()
@Module({})
export class RabbitMQModule {
  static register(): DynamicModule {
    return {
      module: RabbitMQModule,
      providers: [RabbitMQClient],
      exports: [RabbitMQClient],
    };
  }
}
