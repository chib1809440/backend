import { AuthUser } from '../entities/user.entity';

export interface UserRepository {
  create(user: AuthUser): Promise<void>;
  findByEmail(email: string): Promise<AuthUser | null>;
  findById(id: string): Promise<AuthUser | null>;
}

export const TOKEN_USER_REPOSITORY = Symbol('TOKEN_USER_REPOSITORY');
