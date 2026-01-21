import { Global, Module } from '@nestjs/common';
import { EventBusModule } from './event-bus/event-bus.module';
import { PrismaModule } from './prisma/prisma.module';
import { RabbitMQModule } from './rabbitmq/rabbitmq.module';

@Global()
@Module({
  imports: [PrismaModule, EventBusModule, RabbitMQModule],
  exports: [PrismaModule, EventBusModule, RabbitMQModule],
})
export class InfrastructureModule {}
