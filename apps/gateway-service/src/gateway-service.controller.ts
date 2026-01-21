/* eslint-disable @typescript-eslint/require-await */
import { Controller, Get, Query } from '@nestjs/common';
import { Roles } from 'shared/decorators/auth.decorator';
import { TrimPipe } from 'shared/pipes/trim.pipe';

@Controller('')
// @UseGuards(AuthenticationGuard)
// @UseInterceptors(new TransformInterceptor())
@Roles('super-admin')
export class GatewayServiceController {
  @Get()
  // @UseGuards(AuthenticationGuard)
  @Roles('admin', 'user')
  async log(@Query('name', new TrimPipe()) name: string) {
    return await new Promise((resolve) =>
      setTimeout(() => {
        resolve(`Hello ${name}!`);
      }, 1000),
    );
  }
}
