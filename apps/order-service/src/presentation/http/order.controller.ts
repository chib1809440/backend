/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { CreateOrderHandler } from '../../application/handlers/create-order.handler';

@Controller('orders')
export class OrderController {
  constructor(private readonly createOrderHandler: CreateOrderHandler) {}

  /**
   * DEMO:
   * curl -X POST http://localhost:3000/orders \
   *   -H "Content-Type: application/json" \
   *   -d '{ "orderId": "order-001" }'
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: { orderId: string }) {
    await this.createOrderHandler.execute({
      orderId: body.orderId,
    });

    return {
      orderId: body.orderId,
      status: 'CREATED',
    };
  }
}
