import { PasswordHasher } from '../services/password-hasher';

export class UserSession {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public refreshTokenHash: string,
    public expiresAt: Date,
    public revokedAt?: Date,
  ) {}

  isExpired(): boolean {
    return this.expiresAt.getTime() < Date.now();
  }

  revoke() {
    this.revokedAt = new Date();
  }

  isRevoked(): boolean {
    return this.revokedAt !== null;
  }

  matches(token: string, hasher: PasswordHasher): Promise<boolean> {
    return hasher.compare(token, this.refreshTokenHash);
  }

  static restore(props: {
    id: string;
    userId: string;
    refreshTokenHash: string;
    expiresAt: Date;
    revokedAt: Date | null;
  }): UserSession {
    return new UserSession(
      props.id,
      props.userId,
      props.refreshTokenHash,
      props.expiresAt,
    );
  }
}
