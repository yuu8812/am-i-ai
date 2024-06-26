import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Game } from 'src/amIAi/entities/Game';
import { GameUser } from 'src/amIAi/entities/GameUser';

export class GameUserRepository extends EntityRepository<GameUser> {
  constructor(protected readonly em: EntityManager) {
    super(em, Game);
  }
}
