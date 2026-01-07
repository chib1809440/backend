import { Module } from '@nestjs/common';
import { TodoCreatedNotificationHandler } from './application/todo-created.handler';

@Module({
  providers: [TodoCreatedNotificationHandler],
})
export class NotificationModule {}
