import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import { Game } from 'src/amIAi/entities/Game';
import { GamePhase } from 'src/amIAi/entities/GamePhase';

export class GamePhaseRepository extends EntityRepository<GamePhase> {
  constructor(
    protected readonly em: EntityManager,
    private readonly configService: ConfigService,
  ) {
    super(em, Game);
  }
}
