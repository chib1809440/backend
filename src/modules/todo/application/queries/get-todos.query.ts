import { Inject, Injectable } from '@nestjs/common';
import {
  TODO_REPOSITORY,
  TodoRepository,
} from '../../domain/repositories/todo.repository';

@Injectable()
export class GetTodosQuery {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly repo: TodoRepository,
  ) {}

  execute() {
    return this.repo.findAll();
  }
}
