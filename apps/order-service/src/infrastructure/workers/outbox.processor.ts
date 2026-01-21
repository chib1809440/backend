/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { OutboxRepository } from '../persistence/outbox.repository';

@Injectable()
export class OutboxProcessor {
  constructor(private outboxRepo: OutboxRepository) {}

  @Cron('1 1 * * * *')
  async process() {
    const events = await this.outboxRepo.lockPending(10);

    for (const e of events) {
      await this.outboxRepo.markPublished(e.id);
    }
  }
}
