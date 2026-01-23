import { SessionRepository } from '../../domain/repositorires/session.repository';

export class LogoutUseCase {
  constructor(private readonly sessions: SessionRepository) {}

  async execute(userId: string) {
    await this.sessions.revokeAllByUser(userId);
  }
}
