import { Todo } from '../todo.aggregate';

export interface TodoRepository {
  save(todo: Todo): Promise<void>;
  findAll(): Promise<Todo[]>;
}

export const TODO_REPOSITORY = Symbol('TODO_REPOSITORY');
