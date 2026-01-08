import { Module } from '@nestjs/common';
import { CategoryModule } from './modules/category/category.module';
import { NotificationModule } from './modules/notification/notification.module';
import { TodoModule } from './modules/todo/todo.module';
import { SharedModule } from './shared/shared.module';
import { FileModule } from './modules/file/file.module';

@Module({
  imports: [
    SharedModule,
    TodoModule,
    NotificationModule,
    CategoryModule,
    FileModule,
  ],
})
export class AppModule {}
