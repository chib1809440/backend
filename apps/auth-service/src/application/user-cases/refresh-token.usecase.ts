/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/await-thenable */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Inject, UnauthorizedException } from '@nestjs/common';
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

export class RefreshTokenUseCase {
  constructor(
    @Inject(TOKEN_SESSION_REPOSITORY)
    private readonly sessions: SessionRepository,
    @Inject(TOKEN_USER_REPOSITORY)
    private readonly users: UserRepository,
    @Inject(TOKEN_SERVICE)
    private readonly tokens: TokenService,
    @Inject(TOKEN_PASSWORD_HASHER)
    private readonly hasher: PasswordHasher,
  ) {}

  async execute(refreshToken: string) {
    const [sessionId, rawToken] = refreshToken.split('.');

    if (!sessionId || !rawToken) {
      throw new UnauthorizedException();
    }

    const session = await this.sessions.findById(sessionId);
    if (!session || session.revokedAt || session.isExpired()) {
      throw new UnauthorizedException();
    }

    const isValid = await this.hasher.compare(
      refreshToken,
      session.refreshTokenHash,
    );

    if (!isValid) {
      await this.sessions.revokeAllByUser(session.userId);
      throw new UnauthorizedException('Reuse detected');
    }

    await this.sessions.revoke(session.id);

    const newSessionId = crypto.randomUUID();
    const newRaw = crypto.randomUUID();
    const newRefreshToken = `${newSessionId}.${newRaw}`;

    const newHash = await this.hasher.hash(newRefreshToken);

    await this.sessions.save(
      new UserSession(
        newSessionId,
        session.userId,
        newHash,
        addDays(new Date(), 30),
      ),
    );

    return {
      accessToken: this.tokens.generateAccessToken({
        id: session.userId,
      }),
      refreshToken: newRefreshToken,
    };
  }
}
