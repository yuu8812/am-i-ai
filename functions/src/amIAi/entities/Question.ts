import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { LANGUAGE, LanguageType } from 'src/amIAi/constants/game';
import {
  QUESTION_STATUS,
  QuestionStatusType,
} from 'src/amIAi/constants/question';
import { GameQuestion } from 'src/amIAi/entities/GameQuestion';
import { User } from 'src/amIAi/entities/User';
import { BaseEntity } from 'src/amIAi/entityHelper/base';

@Entity({
  tableName: 'question',
})
export class Question extends BaseEntity {
  @Property({ default: QUESTION_STATUS.ACTIVE })
  status: QuestionStatusType;

  @Property({ type: 'text' })
  question: string;

  @Property({ default: LANGUAGE.EN })
  // 0: 日本語, 1: 英語
  language: LanguageType;

  @ManyToOne(() => User, { nullable: true })
  createdUser: User;

  @OneToMany(() => GameQuestion, (gameQuestion) => gameQuestion.questions)
  gameQuestions = new Collection<GameQuestion>(this);
}
