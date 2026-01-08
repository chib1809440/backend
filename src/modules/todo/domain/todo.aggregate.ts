import crypto from 'crypto';
import { AggregateRoot } from '../../../shared/domain/aggregate-root';
import { TodoCreatedEvent } from '../../../shared/events/todo/todo-created.event';

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
