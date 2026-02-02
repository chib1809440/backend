import { Module, Global } from '@nestjs/common';
import { WinstonModule } from 'nest-winston';
import { AppLogger } from './app-logger.service';
import { winstonConfig } from './logger.config';

@Global()
@Module({
  imports: [
    WinstonModule.forRoot(winstonConfig),
  ],
  providers: [AppLogger],
  exports: [AppLogger],
})
export class LoggerModule {}
