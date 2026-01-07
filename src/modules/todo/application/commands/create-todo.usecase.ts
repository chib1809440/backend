import { Inject, Injectable } from '@nestjs/common';
import { EventBus } from '../../../../shared/event-bus/event-bus';
import {
  TODO_REPOSITORY,
  TodoRepository,
} from '../../domain/repositories/todo.repository';
import { Todo } from '../../domain/todo.aggregate';

@Injectable()
export class CreateTodoUseCase {
  constructor(
    @Inject(TODO_REPOSITORY)
    private readonly repo: TodoRepository,
    private readonly eventBus: EventBus,
  ) {}

  async execute(title: string) {
    const todo = Todo.create(title);
    await this.repo.save(todo);

    this.eventBus.publishAll(todo.pullEvents());

    return { id: todo.id };
  }
}
