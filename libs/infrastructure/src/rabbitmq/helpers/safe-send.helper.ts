/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { catchError, firstValueFrom, of, timeout, TimeoutError } from 'rxjs';

export async function safeSend<T>(
  queue: string,
  pattern: string,
  payload: any,
  options?: {
    timeoutMs?: number;
    defaultValue?: T;
  },
): Promise<T> {
  const timeoutMs = options?.timeoutMs ?? 3000;
  const defaultValue = options?.defaultValue ?? ({} as T);

  return firstValueFrom(
    this.getClient(queue)
      .send(queue, pattern, payload)
      .pipe(
        timeout(timeoutMs),
        catchError((err) => {
          if (err instanceof TimeoutError) {
            console.warn(
              `[RabbitMQ] RPC timeout | queue=${queue} | pattern=${pattern}`,
            );
            return of(defaultValue);
          }

          throw err;
        }),
      ),
  );
}
