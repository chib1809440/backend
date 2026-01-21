import { EventBus } from '@app/infrastructure/event-bus/event-bus.service';
import { Injectable, OnModuleInit } from '@nestjs/common';
import { ProductCreatedEvent } from 'shared/events/product-created.event';

@Injectable()
export class ProductHandle implements OnModuleInit {
  constructor(private readonly eventBus: EventBus) {}

  onModuleInit() {
    this.eventBus.register(ProductCreatedEvent.name, this);
  }

  handle(data) {
    console.log('🚀 ~ ProductHandle ~ handle ~ data:', data);
  }
}
