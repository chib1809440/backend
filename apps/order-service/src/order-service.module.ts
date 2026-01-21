import { InfrastructureModule } from '@app/infrastructure/infrastructure.module';
import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { CreateOrderHandler } from './application/handlers/create-order.handler';
import { PayOrderHandler } from './application/handlers/pay-order.handler';
import { OrderConsumer } from './infrastructure/consumers/order.consumer';
import { OrderRepository } from './infrastructure/persistence/order.repository';
import { OutboxRepository } from './infrastructure/persistence/outbox.repository';
import { OutboxProcessor } from './infrastructure/workers/outbox.processor';
import { OrderController } from './presentation/http/order.controller';

@Module({
  imports: [ScheduleModule.forRoot(), InfrastructureModule],
  controllers: [OrderController, OrderConsumer],
  providers: [
    CreateOrderHandler,
    PayOrderHandler,
    OrderRepository,
    OutboxRepository,
    OutboxProcessor,
  ],
})
export class OrderServiceModule {}
