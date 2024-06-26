import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { User } from 'src/amIAi/entities/User';

export class UserRepository extends EntityRepository<User> {
  constructor(protected readonly em: EntityManager) {
    super(em, User);
  }
}
