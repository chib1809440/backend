import { Body, Controller, Post } from '@nestjs/common';
import { PayOrderHandler } from '../../application/handlers/pay-order.handler';

@Controller('payments')
export class PaymentController {
  constructor(private readonly handler: PayOrderHandler) {}

  @Post('success')
  async success(@Body() body: { orderId: string }) {
    await this.handler.execute({ orderId: body.orderId });
    return { ok: true };
  }
}
