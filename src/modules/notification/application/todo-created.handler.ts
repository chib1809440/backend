import { Injectable, OnModuleInit } from '@nestjs/common';
import { TodoCreatedEvent } from '../../../events/todo/todo-created.event';
import { EventBus } from '../../../shared/event-bus/event-bus';

@Injectable()
export class TodoCreatedNotificationHandler implements OnModuleInit {
  constructor(private readonly eventBus: EventBus) {}

  onModuleInit() {
    this.eventBus.register(TodoCreatedEvent.name, this);
  }

  handle(event: TodoCreatedEvent) {
    console.log(`[Notification] Todo created with id = ${event.todoId}`);
  }
}
