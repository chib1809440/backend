/* eslint-disable @typescript-eslint/require-await */
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { GatewayServiceService } from './gateway-service.service';
import { LoggingInterceptor } from 'shared/interceptors/logging.interceptor';
import { AppLogger } from 'shared/logger/app-logger.service';

@Controller('')
@UseInterceptors(LoggingInterceptor)
export class GatewayServiceController {
  constructor(private readonly service: GatewayServiceService,
    private readonly logger: AppLogger
  ) {
     this.logger.setContext('TestController');
  }

  @Get()
  get() {
    this.logger.log('Hello endpoint called');
    return this.service.hello();
  }
}
