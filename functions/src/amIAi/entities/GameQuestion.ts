import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Game } from 'src/amIAi/entities/Game';
import { BaseEntity } from 'src/amIAi/entityHelper/base';
import { GameQuestionRepository } from 'src/amIAi/repository/gameQuestion.repository';

@Entity({
  tableName: 'game_question',
  repository: () => GameQuestionRepository,
})
export class GameQuestion extends BaseEntity {
  @Property({ default: 0 })
  status: 0 | 1 | 2 | 3;

  @Property({ default: 0 })
  phase: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  @ManyToOne(() => Game)
  game: Game;

  @ManyToOne(() => GameQuestion)
  question: GameQuestion;

  @Property({ default: 0 })
  language: 0 | 1 | 2;

  [EntityRepositoryType]?: GameQuestionRepository;
}
