import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import { Game } from 'src/amIAi/entities/Game';
import { GameAnswer } from 'src/amIAi/entities/GameAnswer';

export class GameAnswerRepository extends EntityRepository<GameAnswer> {
  constructor(
    protected readonly em: EntityManager,
    private readonly configService: ConfigService,
  ) {
    super(em, Game);
  }
}
