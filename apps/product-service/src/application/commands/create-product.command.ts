/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { EventBus } from '@app/infrastructure/event-bus/event-bus.service';
import { RabbitMQClient } from '@app/infrastructure/rabbitmq/rabbitmq.client';
import { Inject } from '@nestjs/common';
import { PRODUCT_QUEUE } from 'shared/queues/product.queue';
import { Product } from '../../domain/aggregate/product.aggregate';
import {
  IProductRepository,
  PRODUCT_REPOSITORY_TOKEN,
} from '../../domain/repository/product.repository';

export class CreateProductCommand {
  constructor(
    @Inject(PRODUCT_REPOSITORY_TOKEN)
    private readonly productRepo: IProductRepository,
    private readonly eventBus: EventBus,
    private readonly mq: RabbitMQClient,
  ) {}

  async execute(data: any) {
    try {
      const product = Product.create(data);

      await this.productRepo.create(product);

      this.eventBus.publishAll(product.pullEvents());

      const rpc = await this.mq.send(
        PRODUCT_QUEUE.name,
        'PRODUCT_QUEUE.PRODUCT_CREATED',
        {
          id: product.id,
          name: product.name,
          price: product.price,
        },
      );
      console.log('🚀 ~ CreateProductCommand ~ execute ~ rpc:', rpc);

      return { id: product.id };
    } catch (error) {
      console.log('🚀 ~ CreateProductCommand ~ execute ~ error:', error);
    }
  }
}
