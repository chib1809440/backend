import { Module } from '@nestjs/common';
import { NotificationModule } from './modules/notification/notification.module';
import { TodoModule } from './modules/todo/todo.module';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [SharedModule, TodoModule, NotificationModule],
})
export class AppModule {}
