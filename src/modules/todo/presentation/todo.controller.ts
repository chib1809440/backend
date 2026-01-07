import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateTodoUseCase } from '../application/commands/create-todo.usecase';
import { GetTodosQuery } from '../application/queries/get-todos.query';

@Controller('todos')
export class TodoController {
  constructor(
    private readonly createTodo: CreateTodoUseCase,
    private readonly getTodos: GetTodosQuery,
  ) {}

  @Post()
  create(@Body('title') title: string) {
    return this.createTodo.execute(title);
  }

  @Get()
  findAll() {
    return this.getTodos.execute();
  }
}
