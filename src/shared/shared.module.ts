import { Global, Module } from '@nestjs/common';
import { PrismaService } from './database/prisma.service';
import { EventBus } from './event-bus/event-bus';

@Global()
@Module({
  providers: [EventBus, PrismaService],
  exports: [EventBus, PrismaService],
})
export class SharedModule {}
