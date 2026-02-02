/* eslint-disable @typescript-eslint/no-unsafe-return */
import { Inject, Injectable, Scope } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';

@Injectable({ scope: Scope.REQUEST })
export class TenantContext {
  constructor(@Inject(REQUEST) private readonly req: Request) {}

  get tenantId(): string {
    return this.req['tenantId'];
  }
}
