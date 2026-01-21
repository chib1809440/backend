import { PrismaService } from '@app/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../../infrastructure/persistence/order.repository';
import { OutboxRepository } from '../../infrastructure/persistence/outbox.repository';
import { PayOrderCommand } from '../commands/pay-order.command';

@Injectable()
export class PayOrderHandler {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderRepo: OrderRepository,
    private readonly outboxRepo: OutboxRepository,
  ) {}

  async execute(cmd: PayOrderCommand) {
    await this.prisma.$transaction(async () => {
      const order = await this.orderRepo.findById(cmd.orderId);

      order.markPaid();

      await this.orderRepo.save(order);

      for (const e of order.pullEvents()) {
        await this.outboxRepo.save(e);
      }
    });
  }
}
