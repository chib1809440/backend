export interface DomainEvent {
  readonly type: string;
  readonly payload: any;
}

export class OrderPaidEvent implements DomainEvent {
  readonly type = 'ORDER_PAID';

  constructor(
    public readonly payload: {
      orderId: string;
    },
  ) {}
}
