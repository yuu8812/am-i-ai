import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Question } from 'src/amIAi/entities/Question';

export class GameQuestionRepository extends EntityRepository<Question> {
  constructor(protected readonly em: EntityManager) {
    super(em, Question);
  }
}
