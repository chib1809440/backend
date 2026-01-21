import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { QueueContract } from '../contracts';

export class RabbitMQClientFactory {
  static create(queue: QueueContract) {
    return ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URL!],
        queue: queue.name,
        queueOptions: {
          durable: true,
        },
      },
    });
  }
}
