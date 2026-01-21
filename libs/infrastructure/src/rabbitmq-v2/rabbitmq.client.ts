/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Injectable, Logger } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';
import {
  catchError,
  defer,
  firstValueFrom,
  of,
  retry,
  timeout,
  TimeoutError,
  timer,
} from 'rxjs';
import { RabbitMQClient } from '../rabbitmq/client/rabbitmq.client';
import { RABBITMQ_URL } from './rabbitmq.constants';

@Injectable()
export class RabbitMQClientV2 {
  private readonly logger = new Logger(RabbitMQClient.name);
  private readonly clients = new Map<string, ClientProxy>();

  /**
   * Lazy create client per queue
   */
  private getClient(queue: string): ClientProxy {
    if (!this.clients.has(queue)) {
      this.logger.log(`Create RMQ client for queue: ${queue}`);

      const client = ClientProxyFactory.create({
        transport: Transport.RMQ,
        options: {
          urls: [RABBITMQ_URL],
          queue,
          queueOptions: {
            durable: true,
          },
        },
      });

      this.clients.set(queue, client);
    }

    return this.clients.get(queue)!;
  }

  /**
   * Event (fire & forget)
   */
  emit(queue: string, pattern: string, payload: any) {
    return this.getClient(queue).emit(pattern, payload);
  }

  /**
   * RPC (request / response)
   */
  async send<T>(
    queue: string,
    pattern: string,
    payload: any,
    options?: {
      timeoutMs?: number;
      retryCount?: number;
      retryDelayMs?: number;
      defaultValue?: T;
    },
  ): Promise<T> {
    const {
      timeoutMs = 3000,
      retryCount = 2,
      retryDelayMs = 300,
      defaultValue,
    } = options ?? {};

    return firstValueFrom(
      defer(() =>
        this.getClient(queue)
          .send<T>(pattern, payload)
          .pipe(timeout(timeoutMs)),
      ).pipe(
        retry({
          count: retryCount,
          delay: (error, retryIndex) => {
            if (error instanceof TimeoutError) {
              console.warn(
                `[RabbitMQ] RPC timeout retry ${
                  retryIndex + 1
                }/${retryCount} | queue=${queue} | pattern=${pattern}`,
              );
              return timer(retryDelayMs);
            }

            throw error;
          },
          resetOnSuccess: true,
        }),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            console.error(
              `[RabbitMQ] RPC failed after retries | queue=${queue} | pattern=${pattern}`,
            );
            return of(defaultValue as T);
          }

          throw err;
        }),
      ),
    );
  }
}
