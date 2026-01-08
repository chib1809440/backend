/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

export interface RequestContext {
  requestId: string;
  startTime: number;
}

declare module 'express' {
  interface Request {
    context?: RequestContext;
  }
}

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    req.context = {
      requestId: uuid(),
      startTime: Date.now(),
    };

    res.setHeader('x-request-id', req.context.requestId);
    next();
  }
}
