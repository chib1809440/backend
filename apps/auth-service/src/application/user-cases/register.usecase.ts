/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { ConflictException, Inject, Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { AuthUser } from '../../domain/entities/user.entity';
import {
  TOKEN_USER_REPOSITORY,
  UserRepository,
} from '../../domain/repositorires/user.repository';
import {
  PasswordHasher,
  TOKEN_PASSWORD_HASHER,
} from '../../domain/services/password-hasher';

@Injectable()
export class RegisterUseCase {
  constructor(
    @Inject(TOKEN_PASSWORD_HASHER)
    private readonly hasher: PasswordHasher,
    @Inject(TOKEN_USER_REPOSITORY)
    private readonly userRepo: UserRepository,
  ) {}

  async execute(email: string, password: string) {
    const existed = await this.userRepo.findByEmail(email);
    if (existed) {
      throw new ConflictException('Email already exists');
    }

    const user = await AuthUser.create(
      randomUUID(),
      email,
      password,
      this.hasher,
    );

    await this.userRepo.create(user);

    return {
      id: user.id,
      email: user.email,
      status: user.status,
    };
  }
}
