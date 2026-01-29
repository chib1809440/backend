/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { PrismaModule } from '@app/infrastructure/prisma/prisma.module';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import {
  JWT_PRIVATE_KEY,
  JWT_PUBLIC_KEY,
} from '../../../shared/constants/jwt-keys';
import { JwtStrategy } from '../../../shared/guards/jwt.strategy';
import { LoginUseCase } from './application/user-cases/login.usecase';
import { LogoutUseCase } from './application/user-cases/logout.usecase';
import { RefreshTokenUseCase } from './application/user-cases/refresh-token.usecase';
import { RegisterUseCase } from './application/user-cases/register.usecase';
import { TOKEN_SESSION_REPOSITORY } from './domain/repositorires/session.repository';
import { TOKEN_USER_REPOSITORY } from './domain/repositorires/user.repository';
import { TOKEN_PASSWORD_HASHER } from './domain/services/password-hasher';
import { TOKEN_SERVICE } from './domain/services/token.service';
import { PrismaSessionRepository } from './infrastructure/repositories/prisma-session.repository';
import { PrismaUserRepository } from './infrastructure/repositories/prisma-user.repository';
import { BcryptHasher } from './infrastructure/security/bcrypt-hasher';
import { JwtTokenService } from './infrastructure/security/jwt-token.service';
import { AuthController } from './presentation/auth.controller';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PassportModule,
    JwtModule.register({
      privateKey: JWT_PRIVATE_KEY,
      publicKey: JWT_PUBLIC_KEY,
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '15m',
      },
      verifyOptions: {
        algorithms: ['RS256'],
      },
    }),
    PrismaModule,
  ],

  controllers: [AuthController],

  providers: [
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    JwtStrategy,
    { provide: TOKEN_SERVICE, useClass: JwtTokenService },
    { provide: TOKEN_PASSWORD_HASHER, useClass: BcryptHasher },
    { provide: TOKEN_USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: TOKEN_SESSION_REPOSITORY, useClass: PrismaSessionRepository },
  ],

  exports: [
    RegisterUseCase,
    LoginUseCase,
    RefreshTokenUseCase,
    LogoutUseCase,
    JwtStrategy,
    { provide: TOKEN_SERVICE, useClass: JwtTokenService },
    { provide: TOKEN_PASSWORD_HASHER, useClass: BcryptHasher },
    { provide: TOKEN_USER_REPOSITORY, useClass: PrismaUserRepository },
    { provide: TOKEN_SESSION_REPOSITORY, useClass: PrismaSessionRepository },
  ],
})
export class AuthServiceModule {}
