import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { GameQuestion } from 'src/amIAi/entities/GameQuestion';
import { User } from 'src/amIAi/entities/User';
import { BaseEntity } from 'src/amIAi/entityHelper/base';

@Entity({
  tableName: 'question',
})
export class Question extends BaseEntity {
  @Property({ default: 0 })
  status: 0 | 1 | 2 | 3;

  @Property({ type: 'text' })
  question: string;

  @Property({ default: 0 })
  // 0: admin
  createdBy: 0 | 1 | 2 | 3;

  @Property({ default: 0 })
  // 0: 日本語, 1: 英語
  language: 0 | 1;

  @ManyToOne(() => User, { nullable: true })
  createdUser: User;

  @OneToMany(() => GameQuestion, (gameQuestion) => gameQuestion.questions)
  gameQuestions = new Collection<GameQuestion>(this);
}
