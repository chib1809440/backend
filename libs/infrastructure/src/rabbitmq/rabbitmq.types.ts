export interface RabbitMQClientConfig {
  urls: string[];

  queueOptions: {
    durable: boolean;
    deadLetterExchange?: string;
  };

  channelOptions: {
    prefetch: number;
  };

  retry: {
    maxAttempts: number;
    initialDelayMs: number;
    backoffMultiplier: number;
  };
}

export interface SendOptions {
  timeoutMs?: number;
  retryCount?: number;
  defaultValue?: any;
}

export interface ClientStats {
  queue: string;
  messagesSent: number;
  messagesReceived: number;
  messagesFailed: number;
  lastActivity: Date | null;
  avgResponseTime: number;
}
