import {
  Collection,
  Entity,
  EntityRepositoryType,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { Game } from 'src/amIAi/entities/Game';
import { GameAnswer } from 'src/amIAi/entities/GameAnswer';
import { Question } from 'src/amIAi/entities/Question';
import { BaseEntity } from 'src/amIAi/entityHelper/base';
import { GameQuestionRepository } from 'src/amIAi/repository/gameQuestion.repository';

@Entity({
  tableName: 'game_question',
  repository: () => GameQuestionRepository,
})
export class GameQuestion extends BaseEntity {
  @Property({ default: 0 })
  status: 0 | 1 | 2 | 3;

  @Property({ nullable: true })
  shouldAnswerAt: Date;

  @Property({ default: 0 })
  phase: number;

  @ManyToOne(() => Game)
  game: Game;

  @ManyToOne(() => Question)
  questions: Question;

  @OneToMany(() => GameAnswer, (gameAnswer) => gameAnswer.question)
  gameAnswers = new Collection<GameAnswer>(this);

  [EntityRepositoryType]?: GameQuestionRepository;
}
