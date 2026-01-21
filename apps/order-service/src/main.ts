import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { ORDER_QUEUE } from '../../../shared/queues/order.queue';
import { OrderServiceModule } from './order-service.module';

async function bootstrap() {
  const app = await NestFactory.create(OrderServiceModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: ORDER_QUEUE.name,
      queueOptions: { durable: true },
    },
  });

  app.startAllMicroservices();
  await app.listen(8001);
}
bootstrap();
