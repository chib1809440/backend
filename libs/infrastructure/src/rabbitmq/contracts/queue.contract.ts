export interface QueueContract {
  name: string;
  prefetchCount?: number;
  isAck?: boolean;

  commands?: Record<string, string>;
  topics?: Record<string, string>;
}
