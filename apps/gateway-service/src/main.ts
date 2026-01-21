/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { HttpExceptionFilter } from 'shared/filters/http-exception.filter';
import { GatewayServiceModule } from './gateway-service.module';
import { PRODUCT_QUEUE } from 'shared/queues/product.queue';

async function bootstrap() {
  const app = await NestFactory.create(GatewayServiceModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL],
      queue: PRODUCT_QUEUE.name,
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.port ?? 3000);
}
bootstrap();
