import { IntegrationEvent } from './integration-event.base';

export interface IEventBus {
  publish(event: IntegrationEvent): void;
}

export const EVENT_BUS_TOKEN = Symbol('EVENT_BUS_TOKEN');
