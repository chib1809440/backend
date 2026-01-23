/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { createHash } from 'crypto';
import { PasswordHasher } from '../../domain/services/password-hasher';

@Injectable()
export class BcryptHasher implements PasswordHasher {
  async hash(value: string): Promise<string> {
    const sha256Hash = createHash('sha256').update(value).digest('hex');

    return bcrypt.hash(sha256Hash, 10);
  }

  async compare(value: string, hash: string): Promise<boolean> {
    try {
      const sha256Hash = createHash('sha256').update(value).digest('hex');

      return await bcrypt.compare(sha256Hash, hash);
    } catch (error) {
      console.error('Bcrypt compare error:', error);
      return false;
    }
  }
}
