/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
export abstract class AggregateRoot {
  private events: any[] = [];

  protected addEvent(event: any) {
    this.events.push(event);
  }

  pullEvents() {
    const events = [...this.events];
    this.events = [];
    return events;
  }
}
