import { Global, Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { EventBus } from './event-bus/event-bus';
import { LoggerModule } from './logger/logger.module';

@Global()
@Module({
  imports: [LoggerModule],
  providers: [EventBus, PrismaService],
  exports: [EventBus, PrismaService, LoggerModule],
})
export class SharedModule {}
