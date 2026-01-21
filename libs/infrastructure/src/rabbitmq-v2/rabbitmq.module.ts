import { Global, Module } from '@nestjs/common';
import { RabbitMQClientV2 } from './rabbitmq.client';

@Global()
@Module({
  providers: [RabbitMQClientV2],
  exports: [RabbitMQClientV2],
})
export class RabbitMQV2Module {}
