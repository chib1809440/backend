/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaService } from '@app/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { Order } from '../../domain/order/order.aggregate';
import { PrismaTx } from './types';

@Injectable()
export class OrderRepository {
  constructor(private prisma: PrismaService) {}

  async findById(id: string, tx?: PrismaTx): Promise<Order> {
    const db = tx ?? this.prisma;

    const row = await db.order.findUnique({ where: { id } });
    if (!row) throw new Error('Order not found');

    return Order.rehydrate({
      id: row.id,
      status: row.status as 'CREATED' | 'PAID',
    });
  }

  async save(order: Order, tx?: PrismaTx) {
    const db = tx ?? this.prisma;

    await db.order.update({
      where: { id: order.id },
      data: { status: order.getStatus },
    });
  }

  async insert(order: Order, tx?: PrismaTx): Promise<void> {
    const db = tx ?? this.prisma;
    await db.order.create({
      data: {
        id: order.id,
        status: order.getStatus,
      },
    });
  }
}
