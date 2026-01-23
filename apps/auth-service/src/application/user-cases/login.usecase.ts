/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Inject, Injectable } from '@nestjs/common';
import { addDays } from 'date-fns';
import { UserSession } from '../../domain/entities/user-session.entity';
import {
  SessionRepository,
  TOKEN_SESSION_REPOSITORY,
} from '../../domain/repositorires/session.repository';
import {
  TOKEN_USER_REPOSITORY,
  UserRepository,
} from '../../domain/repositorires/user.repository';
import {
  PasswordHasher,
  TOKEN_PASSWORD_HASHER,
} from '../../domain/services/password-hasher';
import {
  TOKEN_SERVICE,
  TokenService,
} from '../../domain/services/token.service';
import { RefreshToken } from '../../domain/value-objects/refresh-token.vo';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(TOKEN_USER_REPOSITORY)
    private readonly users: UserRepository,
    @Inject(TOKEN_SESSION_REPOSITORY)
    private readonly sessions: SessionRepository,
    @Inject(TOKEN_SERVICE)
    private readonly tokens: TokenService,
    @Inject(TOKEN_PASSWORD_HASHER)
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(email: string, password: string) {
    const user = await this.users.findByEmail(email);
    if (!user) throw new Error('Invalid credentials');

    if (!user.verifyPassword(password, this.hasher))
      throw new Error('Invalid credentials');

    if (!user.isActive()) throw new Error('User banned');

    const refreshToken = RefreshToken.generate();

    const sessionId = crypto.randomUUID();

    const refreshTokenHash = await this.hasher.hash(
      `${sessionId}.${refreshToken.value}`,
    );

    const session = new UserSession(
      sessionId,
      user.id,
      refreshTokenHash,
      addDays(new Date(), 30),
    );

    await this.sessions.save(session);

    return {
      accessToken: this.tokens.generateAccessToken({
        id: user.id,
        email: user.email,
        status: user.status,
      }),
      refreshToken: `${sessionId}.${refreshToken.value}`,
    };
  }
}
