/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { PrismaService } from '@app/infrastructure/prisma/prisma.service';
import { Injectable } from '@nestjs/common';
import { AuthUser } from '../../domain/entities/user.entity';
import { UserRepository } from '../../domain/repositorires/user.repository';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<AuthUser | null> {
    const record = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  async findById(id: string): Promise<AuthUser | null> {
    const record = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!record) return null;

    return this.toDomain(record);
  }

  /**
   * Mapping Prisma model → Domain Entity
   * Đây là phần RẤT QUAN TRỌNG trong DDD
   */
  private toDomain(record: {
    id: string;
    email: string;
    passwordHash: string;
    status: 'ACTIVE' | 'BANNED' | 'INACTIVE';
  }): AuthUser {
    return new AuthUser(
      record.id,
      record.email,
      record.passwordHash,
      record.status,
    );
  }

  async create(user: AuthUser): Promise<void> {
    await this.prisma.user.create({
      data: {
        id: user.id,
        email: user.email,
        passwordHash: (user as any).passwordHash,
        status: user.status,
      },
    });
  }
}
