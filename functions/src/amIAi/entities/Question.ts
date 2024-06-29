import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { User } from 'src/amIAi/entities/User';
import { BaseEntity } from 'src/amIAi/entityHelper/base';
import { QuestionRepository } from 'src/amIAi/repository/question.repository';

@Entity({
  tableName: 'question',
  repository: () => QuestionRepository,
})
export class Question extends BaseEntity {
  @Property({ default: 0 })
  status: 0 | 1 | 2 | 3;

  @Property({ type: 'text' })
  question: string;

  @Property({ default: 0 })
  createdBy: 0 | 1 | 2 | 3;

  @ManyToOne(() => User)
  createUser: User;

  [EntityRepositoryType]?: QuestionRepository;
}
