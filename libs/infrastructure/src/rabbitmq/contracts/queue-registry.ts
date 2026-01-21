import { QueueContract } from './queue.contract';

export class QueueRegistry {
  private static queues = new Map<string, QueueContract>();

  static register(queue: QueueContract) {
    this.queues.set(queue.name, queue);
  }

  static get(name: string): QueueContract {
    const queue = this.queues.get(name);
    if (!queue) throw new Error(`Queue ${name} not registered`);
    return queue;
  }

  static getAll() {
    return [...this.queues.values()];
  }
}
