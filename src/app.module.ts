import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { CategoryModule } from './modules/category/category.module';
import { FileModule } from './modules/file/file.module';
import { NotificationModule } from './modules/notification/notification.module';
import { TodoModule } from './modules/todo/todo.module';
import { RequestContextMiddleware } from './shared/logger/middleware/request-context.middleware';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    SharedModule,
    TodoModule,
    NotificationModule,
    CategoryModule,
    FileModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestContextMiddleware).forRoutes('*');
  }
}
