import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../../domain/services/token.service';

@Injectable()
export class JwtTokenService implements TokenService {
  constructor(private jwtService: JwtService) {}

  generateAccessToken(user: {
    id: string;
    email: string;
    status: string;
  }): string {
    return this.jwtService.sign({
      sub: user.id,
      email: user.email,
      status: user.status,
    });
  }

  generateRefreshToken(userId: string): string {
    return this.jwtService.sign({ sub: userId }, { expiresIn: '7d' });
  }
}
