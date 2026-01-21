import { OrderCreatedEvent } from './order-created.event';
import { DomainEvent, OrderPaidEvent } from './order.events';

export class Order {
  private domainEvents: DomainEvent[] = [];

  private constructor(
    public readonly id: string,
    private _status: 'CREATED' | 'PAID',
  ) {}

  static create(id: string): Order {
    const order = new Order(id, 'CREATED');

    order.domainEvents.push(new OrderCreatedEvent({ orderId: id }));

    return order;
  }

  static rehydrate(props: { id: string; status: 'CREATED' | 'PAID' }): Order {
    return new Order(props.id, props.status);
  }

  markPaid() {
    if (this._status !== 'CREATED') {
      throw new Error('Invalid state transition');
    }

    this._status = 'PAID';

    this.domainEvents.push(
      new OrderPaidEvent({
        orderId: this.id,
      }),
    );
  }

  pullEvents() {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  get getStatus() {
    return this._status;
  }
}
