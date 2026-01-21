/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { catchError, defaultIfEmpty, firstValueFrom, timeout } from 'rxjs';
import { QueueContract } from '../contracts';
import { safeSend } from '../helpers/safe-send.helper';
import { RabbitMQClientFactory } from './rabbitmq.client.factory';

@Injectable()
export class RabbitMQClient {
  private readonly clients = new Map<string, ClientProxy>();

  private getClient(queue: QueueContract): ClientProxy {
    if (!this.clients.has(queue.name)) {
      const client = RabbitMQClientFactory.create(queue);
      this.clients.set(queue.name, client);
    }

    return this.clients.get(queue.name)!;
  }

  emit(queue: QueueContract, pattern: string, payload: any) {
    return this.getClient(queue).emit(pattern, payload);
  }

  send(
    queue: QueueContract,
    pattern: string,
    payload: any,
    timeoutMs: number = 60000,
  ) {
    return firstValueFrom(
      this.getClient(queue)
        .send(pattern, payload)
        .pipe(
          timeout(timeoutMs),
          defaultIfEmpty({}),
          catchError((err) => {
            console.log('🚀 ~ RabbitMQClient ~ send ~ err:', err);

            throw err;
          }),
        ),
    );
  }

  safeSend<T>(
    queue: string,
    pattern: string,
    payload: any,
    options?: {
      timeoutMs?: number;
      defaultValue?: T;
    },
  ): Promise<T> {
    return safeSend.call(this, queue, pattern, payload, options);
  }
}
