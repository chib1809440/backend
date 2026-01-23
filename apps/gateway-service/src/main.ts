/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { HttpExceptionFilter } from 'shared/filters/http-exception.filter';
import { PRODUCT_QUEUE } from 'shared/queues/product.queue';
import { GatewayServiceModule } from './gateway-service.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayServiceModule);

  const rmqUrl = process.env.RABBITMQ_URL;

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: rmqUrl ? [rmqUrl] : [],
      queue: PRODUCT_QUEUE.name,
      queueOptions: { durable: true },
    },
  });

  await app.startAllMicroservices();

  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(process.env.GATEWAY_SERVICE ?? 8000);
}
bootstrap();
