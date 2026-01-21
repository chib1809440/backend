import { NestFactory } from '@nestjs/core';
import { ProductServiceModule } from './product-service.module';

async function bootstrap() {
  const app = await NestFactory.create(ProductServiceModule);

  await app.startAllMicroservices();

  await app.listen(process.env.PRODUCT_SERVICE_PORT ?? 8002);
}
bootstrap();
