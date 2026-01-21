/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable, tap } from 'rxjs';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now = Date.now();

    return next.handle().pipe(
      map((data) => {
        console.log(data);
        return {
          success: !!data,
          data,
        };
      }),
      tap(() => {
        console.log(`Request took ${Date.now() - now}ms`);
      }),
    );
  }
}
