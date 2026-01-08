import { Injectable, OnModuleInit } from '@nestjs/common';
import { EventBus } from '../../../shared/event-bus/event-bus';
import { TodoCreatedEvent } from '../../../shared/events/todo/todo-created.event';

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
