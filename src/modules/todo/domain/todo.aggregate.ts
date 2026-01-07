import crypto from 'crypto';
import { TodoCreatedEvent } from '../../../events/todo/todo-created.event';
import { AggregateRoot } from '../../../shared/domain/aggregate-root';

export class Todo extends AggregateRoot {
  constructor(
    public readonly id: string,
    public title: string,
  ) {
    super();
  }

  static create(title: string) {
    if (!title || title.trim().length === 0) {
      throw new Error('Title is required');
    }

    const todo = new Todo(crypto.randomUUID(), title);

    todo.addEvent(new TodoCreatedEvent(todo.id, todo.title));
    return todo;
  }
}
