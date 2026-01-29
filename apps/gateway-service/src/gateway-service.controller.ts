/* eslint-disable @typescript-eslint/require-await */
import { Controller, Get } from '@nestjs/common';

@Controller('')
export class GatewayServiceController {
  private count = 0;
  @Get()
  // @UseGuards(JwtAuthGuard)
  get() {
    this.count++;
    return `Hello World! ${this.count}`;
  }
}
