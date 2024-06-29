import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import { Game } from 'src/amIAi/entities/Game';
import { Vote } from 'src/amIAi/entities/Vote';

export class VoteRepository extends EntityRepository<Vote> {
  constructor(
    protected readonly em: EntityManager,
    private readonly configService: ConfigService,
  ) {
    super(em, Game);
  }
}
