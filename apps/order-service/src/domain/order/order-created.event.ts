import { DomainEvent } from './order.events';

export class OrderCreatedEvent implements DomainEvent {
  readonly type = 'ORDER_CREATED';

  constructor(
    public readonly payload: {
      orderId: string;
    },
  ) {}
}
