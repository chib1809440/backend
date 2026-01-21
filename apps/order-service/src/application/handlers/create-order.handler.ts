/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaService } from '@app/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Order } from '../../domain/order/order.aggregate';
import { OrderRepository } from '../../infrastructure/persistence/order.repository';
import { OutboxRepository } from '../../infrastructure/persistence/outbox.repository';
import { CreateOrderCommand } from '../commands/create-order.command';

@Injectable()
export class CreateOrderHandler {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderRepo: OrderRepository,
    private readonly outboxRepo: OutboxRepository,
  ) {}

  async execute(cmd: CreateOrderCommand): Promise<void> {
    const order = Order.create(cmd.orderId);

    await this.prisma.$transaction(async () => {
      await this.orderRepo.insert(order);

      for (const event of order.pullEvents()) {
        await this.outboxRepo.save(event);
      }
    });
  }
}
