/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../shared/database/prisma.service';
import { TodoRepository } from '../domain/repositories/todo.repository';
import { Todo } from '../domain/todo.aggregate';

@Injectable()
export class PrismaTodoRepository implements TodoRepository {
  constructor(private readonly prisma: PrismaService) {}

  async save(todo: Todo) {
    await this.prisma.todo.create({
      data: {
        id: todo.id,
        title: todo.title,
      },
    });
  }

  async findAll(): Promise<Todo[]> {
    const rows = await this.prisma.todo.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
    return rows.map((r) => new Todo(r.id, r.title));
  }
}
