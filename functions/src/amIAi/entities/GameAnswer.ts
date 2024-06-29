import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Game } from 'src/amIAi/entities/Game';
import { GameUser } from 'src/amIAi/entities/GameUser';
import { BaseEntity } from 'src/amIAi/entityHelper/base';
import { GameAnswerRepository } from 'src/amIAi/repository/gameAnswer.repository';

@Entity({
  tableName: 'game_answer',
  repository: () => GameAnswerRepository,
})
export class GameAnswer extends BaseEntity {
  @Property({ default: 0 })
  status: 0 | 1 | 2 | 3;

  @Property({ type: 'text' })
  answer: string;

  @ManyToOne(() => Game)
  game: Game;

  @ManyToOne(() => GameUser)
  gameUser: GameUser;

  [EntityRepositoryType]?: GameAnswerRepository;
}
