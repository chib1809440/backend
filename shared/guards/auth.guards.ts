/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.getAllAndMerge<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    console.log('🚀 ~ AuthenticationGuard ~ canActivate ~ roles:', roles);

    const request = context.switchToHttp().getRequest();
    console.log('🚀 ~ AuthenticationGuard ~ canActivate ~ request:');
    const token = request?.headers?.authorization;

    console.log('🚀 ~ AuthGuard ~ canActivate ~ request:', token);
    // if (token !== '123') return false;
    return true;
  }
}
