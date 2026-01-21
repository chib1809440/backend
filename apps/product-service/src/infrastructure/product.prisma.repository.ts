/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaService } from '@app/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { IProductRepository } from '../domain/repository/product.repository';

@Injectable()
export class PrismaProductRepository implements IProductRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: any): Promise<void> {
    await this.prisma.product.create({
      data: {
        id: data.id,
        name: data.name,
        price: data.price,
        createdAt: new Date(),
      },
    });
  }

  async findAll(): Promise<any> {
    return await this.prisma.product.findMany();
  }
}
