import { NestFactory } from '@nestjs/core';
import 'dotenv/config';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { AppLogger } from './shared/logger/app-logger.service';
import { setupSwagger } from './shared/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalFilters(new GlobalExceptionFilter(app.get(AppLogger)));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
