import { QueueContract } from 'shared/queues/queue.contract';

export const ORDER_QUEUE: QueueContract = {
  name: 'ORDER_QUEUE',
  commands: {
    CREATE_ORDER: 'ORDER_QUEUE.CREATE_ORDER',
  },
  topics: {
    ORDER_CREATED: 'ORDER_QUEUE.ORDER_CREATED',
  },
};
