import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { GamePhase } from 'src/amIAi/entities/GamePhase';
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

  @ManyToOne(() => GamePhase)
  game_phase: GamePhase;

  @ManyToOne(() => Question)
  question: Question;

  [EntityRepositoryType]?: GameQuestionRepository;
}
