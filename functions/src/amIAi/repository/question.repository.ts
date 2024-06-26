import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Game } from 'src/amIAi/entities/Game';
import { Question } from 'src/amIAi/entities/Question';

export class QuestionRepository extends EntityRepository<Question> {
  constructor(protected readonly em: EntityManager) {
    super(em, Game);
  }
}
