export interface QueueContract {
  name: string;
  prefetchCount?: number;
  commands?: Record<string, string>;
  topics?: Record<string, string>;
}
