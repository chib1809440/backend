import { Transport } from '@nestjs/microservices';

const rabbitmqUrl =
  process.env.RABBITMQ_URL ?? 'amqp://user:password@localhost:5672';
export const rabbitmqConfigConsumer = (queue: string) => ({
  transport: Transport.RMQ,
  options: {
    urls: [rabbitmqUrl],
    queue: queue,
    queueOptions: { durable: true },
  },
});
