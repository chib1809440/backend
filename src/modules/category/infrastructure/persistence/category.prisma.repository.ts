/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/shared/database/prisma.service';
import { Category } from '../../domain/entities/category.entity';
import { CategoryRepository } from '../../domain/repositories/category.repository';

@Injectable()
export class CategoryPrismaRepository implements CategoryRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(data: Category) {
    await this.prisma.category.create({
      data: {
        id: data.id,
        name: data.name,
        slug: data.slug,
        icon: data?.icon,
      },
    });
  }

  async getAll(): Promise<Category[]> {
    const rows = await this.prisma.category.findMany({});

    return rows.map((r) => new Category(r.id, r.name, r.slug, r.icon));
  }
}
