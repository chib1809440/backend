import { rabbitmqConfigConsumer } from '@app/infrastructure/rabbitmq/rabbitmq.config';
import { NestFactory } from '@nestjs/core';
import { SearchServiceModule } from './search-service.module';

async function bootstrap() {
  const app = await NestFactory.create(SearchServiceModule);

  app.connectMicroservice(rabbitmqConfigConsumer('PRODUCT_QUEUE'));

  app.startAllMicroservices();

  await app.listen(process.env.SEARCH_SERVICE ?? 8004);
}
bootstrap();
