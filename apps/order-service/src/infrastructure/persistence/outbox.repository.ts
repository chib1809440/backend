/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaService } from '@app/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { DomainEvent } from '../../domain/order/order.events';
import { PrismaTx } from './types';

@Injectable()
export class OutboxRepository {
  constructor(private prisma: PrismaService) {}

  async save(event: DomainEvent, tx?: PrismaTx) {
    const db = tx ?? this.prisma;

    await db.outboxEvent.create({
      data: {
        id: crypto.randomUUID(),
        eventType: event.type,
        payload: event.payload,
        status: 'PENDING',
      },
    });
  }

  async lockPending(limit: number) {
    return this.prisma.outboxEvent.findMany({
      where: { status: 'PENDING' },
      take: limit,
    });
  }

  async markPublished(id: string) {
    await this.prisma.outboxEvent.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        processedAt: new Date(),
      },
    });
  }
}
