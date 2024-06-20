import { EntityRepository } from '@mikro-orm/postgresql';
import { Game } from 'src/amIAi/entities/Game';

export class GameRepository extends EntityRepository<Game> {
  // your custom methods...
}
