import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Question } from 'src/amIAi/entities/Question';
import * as z from 'zod';

@Injectable()
export class QuestionRepository {
  constructor(protected readonly em: EntityManager) {}

  async createQuestion(questions: string[], language: 0 | 1) {
    const validationCheck = z.array(z.string()).safeParse(questions);

    if (!validationCheck.success) throw new Error('Invalid question format');

    const forkedEm = this.em.fork();

    const questionEntities = questions.map((question) =>
      forkedEm.create(Question, {
        question,
        language,
      }),
    );

    await forkedEm.persistAndFlush(questionEntities);
  }
}
