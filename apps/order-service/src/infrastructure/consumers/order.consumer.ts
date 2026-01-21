/* eslint-disable @typescript-eslint/require-await */
import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ORDER_QUEUE } from '../../../../../shared/queues/order.queue';

@Controller()
export class OrderConsumer {
  @MessagePattern(ORDER_QUEUE.commands!.CREATE_ORDER)
  async createOrder(data: any) {
    console.log('🔥 Service B received:', data);
    return { status: 'ORDER_CREATED' };
  }
}
