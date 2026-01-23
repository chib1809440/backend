import { UserSession } from '../entities/user-session.entity';

export interface SessionRepository {
  save(session: UserSession): Promise<void>;
  findById(id: string): Promise<UserSession | null>;
  findValidByToken(token: string): Promise<UserSession | null>;
  revoke(sessionId: string): Promise<void>;
  revokeAllByUser(userId: string): Promise<void>;
}

export const TOKEN_SESSION_REPOSITORY = Symbol('TOKEN_SESSION_REPOSITORY');
