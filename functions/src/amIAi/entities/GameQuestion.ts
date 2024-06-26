import {
  Entity,
  EntityRepositoryType,
  OneToOne,
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

  @OneToOne(() => Game)
  game: Game;

  [EntityRepositoryType]?: GameQuestionRepository;
}
