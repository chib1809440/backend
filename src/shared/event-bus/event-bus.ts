/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';

@Injectable()
export class EventBus {
  private handlers = new Map<string, any[]>();

  register(eventName: string, handler: any) {
    const list = this.handlers.get(eventName) || [];
    list.push(handler);
    this.handlers.set(eventName, list);
  }

  publishAll(events: any[]) {
    for (const event of events) {
      const handlers = this.handlers.get(event.constructor.name) || [];
      for (const handler of handlers) {
        handler.handle(event);
      }
    }
  }
}
