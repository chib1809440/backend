/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaService } from '@app/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { UserSession } from '../../domain/entities/user-session.entity';
import { SessionRepository } from '../../domain/repositorires/session.repository';

@Injectable()
export class PrismaSessionRepository implements SessionRepository {
  constructor(private prisma: PrismaService) {}

  async findUnique(query: any): Promise<UserSession | null> {
    console.log(
      '🚀 ~ PrismaSessionRepository ~ findValidByToken ~ query:',
      query,
    );
    const session = await this.prisma.userSession.findFirst({
      where: query,
    });

    if (!session) return null;

    return UserSession.restore({
      id: session.id,
      userId: session.userId ?? '',
      refreshTokenHash: session.refreshTokenHash,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
    });
  }

  /**
   * Find refresh token that:
   * - exists
   * - not expired
   * - not revoked
   */
  async findValidByToken(token: string): Promise<UserSession | null> {
    console.log(
      '🚀 ~ PrismaSessionRepository ~ findValidByToken ~ token:',
      token,
    );
    const session = await this.prisma.userSession.findFirst({
      where: {
        refreshTokenHash: token,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!session) return null;

    return UserSession.restore({
      id: session.id,
      userId: session.userId ?? '',
      refreshTokenHash: session.refreshTokenHash,
      expiresAt: session.expiresAt,
      revokedAt: session.revokedAt,
    });
  }

  async revoke(sessionId: string): Promise<void> {
    await this.prisma.userSession.update({
      where: { id: sessionId },
      data: {
        revokedAt: new Date(),
      },
    });
  }

  async save(session: UserSession) {
    await this.prisma.userSession.create({
      data: {
        id: session.id,
        userId: session.userId,
        refreshTokenHash: session['refreshTokenHash'],
        expiresAt: session.expiresAt,
      },
    });
  }

  async revokeAllByUser(userId: string) {
    await this.prisma.userSession.updateMany({
      where: { userId },
      data: { revokedAt: new Date() },
    });
  }

  async findById(id: string): Promise<UserSession | null> {
    const session = await this.prisma.userSession.findUnique({
      where: {
        id,
        revokedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!session) return null;

    return UserSession.restore({
      id,
      userId: session?.userId ?? '',
      refreshTokenHash: session?.refreshTokenHash,
      expiresAt: session?.expiresAt,
      revokedAt: session?.revokedAt,
    });
  }
}
