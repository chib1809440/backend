/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { HttpExceptionFilter } from 'shared/filters/http-exception.filter';
import { GatewayServiceModule } from './gateway-service.module';

async function bootstrap() {
  const app = await NestFactory.create(GatewayServiceModule);

  // app.useGlobalGuards(new JwtAuthGuard());

  app.useGlobalFilters(new HttpExceptionFilter());

  app.use(cookieParser());

  await app.listen(process.env.GATEWAY_SERVICE ?? 8000);


  console.log(":::App listen at port", process.env.GATEWAY_SERVICE ?? 8000);
}
bootstrap();
