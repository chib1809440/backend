import { PasswordHasher } from '../services/password-hasher';

export class AuthUser {
  constructor(
    public readonly id: string,
    public readonly email: string,
    private readonly passwordHash: string,
    public status: 'ACTIVE' | 'BANNED' | 'INACTIVE',
  ) {}

  static async create(
    id: string,
    email: string,
    plainPassword: string,
    hasher: PasswordHasher,
  ): Promise<AuthUser> {
    const hash = await hasher.hash(plainPassword);

    return new AuthUser(id, email, hash, 'ACTIVE');
  }

  verifyPassword(
    plainPassword: string,
    hasher: PasswordHasher,
  ): Promise<boolean> {
    return hasher.compare(plainPassword, this.passwordHash);
  }

  isActive(): boolean {
    return this.status === 'ACTIVE';
  }

  canLogin(): boolean {
    return this.status === 'ACTIVE';
  }
}
