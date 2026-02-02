/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class TenantMiddleware implements NestMiddleware {
  use(req: Request, _: Response, next: NextFunction) {
    const tenantId = req.headers['x-tenant-id'];

    // if (!tenantId) {
    //   throw new UnauthorizedException('Tenant missing');
    // }

    req['tenantId'] = tenantId;
    next();
  }
}
