import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { LANGUAGE } from 'src/amIAi/constants/game';
import {
  personalities,
  personalitiesEn,
} from 'src/amIAi/constants/personality';
import { AiUser } from 'src/amIAi/entities/AiUser';

@Injectable()
export class AiUserRepository {
  constructor(protected readonly em: EntityManager) {}

  async initializeAiUser() {
    const forkedEm = this.em.fork();

    const aiUsers = await forkedEm.find(AiUser, {});

    if (aiUsers.length > 0) return;

    personalities.map((personality) => {
      forkedEm.create(AiUser, {
        config: personality,
        language: LANGUAGE.JP,
      });
    });

    personalitiesEn.map((personality) => {
      forkedEm.create(AiUser, {
        config: personality,
        language: LANGUAGE.EN,
      });
    });

    forkedEm.flush();
  }
}
