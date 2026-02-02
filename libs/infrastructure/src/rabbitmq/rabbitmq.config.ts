import { Transport } from '@nestjs/microservices';

const rabbitmqUrl =
  process.env.RABBITMQ_URL ?? 'amqp://user:password@localhost:5672';
export const rabbitmqConfigConsumer = (queue: string) => ({
  transport: Transport.RMQ,
  options: {
    urls: [rabbitmqUrl],
    queue: queue,
    queueOptions: { durable: true },
    prefetchCount: 10,
    persistent: true,
    noAck: true,
    socketOptions: {
      heartbeatIntervalInSeconds: 60,
      reconnectTimeInSeconds: 5,
    },
  },
});
