import { Module } from '@nestjs/common';
import { CreateTodoUseCase } from './application/commands/create-todo.usecase';
import { GetTodosQuery } from './application/queries/get-todos.query';
import { TODO_REPOSITORY } from './domain/repositories/todo.repository';
import { PrismaTodoRepository } from './infrastructure/prisma-todo.repository';
import { TodoController } from './presentation/todo.controller';

@Module({
  controllers: [TodoController],
  providers: [
    CreateTodoUseCase,
    GetTodosQuery,
    {
      provide: TODO_REPOSITORY,
      useClass: PrismaTodoRepository,
    },
    {
      provide: PrismaTodoRepository,
      useExisting: TODO_REPOSITORY,
    },
  ],
})
export class TodoModule {}
