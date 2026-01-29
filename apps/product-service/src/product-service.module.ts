import { EventBusModule } from '@app/infrastructure/event-bus/event-bus.module';
import { InfrastructureModule } from '@app/infrastructure/infrastructure.module';
import { RabbitMQModule } from '@app/infrastructure/rabbitmq/rabbitmq.module';
import { Module } from '@nestjs/common';
import { CreateProductCommand } from './application/commands/create-product.command';
import { ProductHandle } from './application/handlers/product-created.handle';
import { GetProductQuery } from './application/queries/get-product.query';
import { PRODUCT_REPOSITORY_TOKEN } from './domain/repository/product.repository';
import { PrismaProductRepository } from './infrastructure/product.prisma.repository';
import { ProductController } from './presentation/product.controller';

@Module({
  imports: [InfrastructureModule, EventBusModule, RabbitMQModule],
  controllers: [ProductController],
  providers: [
    CreateProductCommand,
    GetProductQuery,
    ProductHandle,
    {
      provide: PRODUCT_REPOSITORY_TOKEN,
      useClass: PrismaProductRepository,
    },
  ],
})
export class ProductServiceModule {}
