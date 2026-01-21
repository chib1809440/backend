import { Transport } from '@nestjs/microservices';
import { QueueContract } from '../contracts';

export class RabbitMQServerFactory {
  static create(queue: QueueContract) {
    return {
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL!],
        queue: queue.name,
        prefetchCount: queue.prefetchCount ?? 10,
        queueOptions: {
          durable: true,
        },
      },
    };
  }
}
