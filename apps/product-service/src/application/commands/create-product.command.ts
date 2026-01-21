/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { EventBus } from '@app/infrastructure/event-bus/event-bus.service';
import { RabbitMQClientV2 } from '@app/infrastructure/rabbitmq-v2/rabbitmq.client';
import { Inject } from '@nestjs/common';
import { Product } from '../../domain/aggregate/product.aggregate';
import {
  IProductRepository,
  PRODUCT_REPOSITORY_TOKEN,
} from '../../domain/repository/product.repository';
import { ORDER_QUEUE } from '../../infrastructure/queues/order.queue';

export class CreateProductCommand {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepo: IProductRepository,
    private readonly eventBus: EventBus,
    private readonly mq: RabbitMQClientV2,
  ) {}

  async execute(data: any) {
    try {
      const product = Product.create(data);

      await this.productRepo.create(product);

      this.eventBus.publishAll(product.pullEvents());

      const rpc = await this.mq.send(
        ORDER_QUEUE.name,
        ORDER_QUEUE.commands.CREATE_ORDER,
        product,
      );
      console.log('🚀 ~ CreateProductCommand ~ execute ~ rpc:', rpc);

      return { id: product.id };
    } catch (error) {
      console.log('🚀 ~ CreateProductCommand ~ execute ~ error:', error);
    }
  }
}
