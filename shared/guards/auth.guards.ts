/* eslint-disable @typescript-eslint/no-unsafe-call */
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
    const request = context.switchToHttp().getRequest();
    console.log('🚀 ~ AuthenticationGuard ~ canActivate ~ request:');
    const authentication = request?.headers?.authorization;

    const token = authentication?.split(' ')[1];
    console.log('🚀 ~ AuthenticationGuard ~ canActivate ~ token:', token);

    // if (token !== '123') return false;
    return true;
  }
}
