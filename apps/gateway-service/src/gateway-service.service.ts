import { Injectable } from '@nestjs/common';
import { TenantContext } from 'shared/utils/tenant.context';

@Injectable()
export class GatewayServiceService {
  constructor(private readonly tenantContext: TenantContext) {}

  hello() {
    const tenantId = this.tenantContext.tenantId;
    console.log('🚀 ~ GatewayServiceService ~ hello ~ tenantId:', tenantId);
    return `Hello World! ${tenantId}`;
  }
}
