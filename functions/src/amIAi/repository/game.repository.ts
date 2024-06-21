import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Game } from 'src/amIAi/entities/Game';

export class GameRepository extends EntityRepository<Game> {
  constructor(protected readonly em: EntityManager) {
    super(em, Game);
  }
  async findSome() {
    const game = this.em.find(Game, {});
    return await this.em.persistAndFlush(game);
  }
}
