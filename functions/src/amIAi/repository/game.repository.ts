import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import { Game } from 'src/amIAi/entities/Game';

export class GameRepository extends EntityRepository<Game> {
  constructor(
    protected readonly em: EntityManager,
    private readonly configService: ConfigService,
  ) {
    super(em, Game);
  }
}
