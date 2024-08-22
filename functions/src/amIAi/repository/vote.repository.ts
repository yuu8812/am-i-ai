import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Vote } from 'src/amIAi/entities/Vote';

export class VoteRepository extends EntityRepository<Vote> {
  constructor(protected readonly em: EntityManager) {
    super(em, Vote);
  }
}
