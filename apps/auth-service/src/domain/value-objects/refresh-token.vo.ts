import { randomBytes } from 'crypto';

export class RefreshToken {
  private constructor(public readonly value: string) {}

  static generate(): RefreshToken {
    return new RefreshToken(randomBytes(32).toString('hex'));
  }
}
