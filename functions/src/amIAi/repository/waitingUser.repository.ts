import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { WaitingUser } from 'src/amIAi/entities/WaitingUser';

@Injectable()
export class WaitingUserRepository {
  constructor(protected readonly em: EntityManager) {}

  async updateOnlineDetectedAt(userId: string): Promise<void> {
    const forkedEm = this.em.fork();

    const waitingUser = await forkedEm.findOne(WaitingUser, { user: userId });

    waitingUser.onlineDetectedAt = new Date();

    await forkedEm.flush();
  }
}
