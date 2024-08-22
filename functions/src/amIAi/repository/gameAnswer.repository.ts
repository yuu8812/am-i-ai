import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import { GameAnswer } from 'src/amIAi/entities/GameAnswer';

export class GameAnswerRepository extends EntityRepository<GameAnswer> {
  constructor(
    protected readonly em: EntityManager,
    private readonly configService: ConfigService,
  ) {
    super(em, GameAnswer);
  }
}
