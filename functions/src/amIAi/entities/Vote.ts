import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { GameAnswer } from 'src/amIAi/entities/GameAnswer';
import { GameUser } from 'src/amIAi/entities/GameUser';
import { BaseEntity } from 'src/amIAi/entityHelper/base';
import { VoteRepository } from 'src/amIAi/repository/vote.repository';

@Entity({
  tableName: 'vote',
  repository: () => VoteRepository,
})
export class Vote extends BaseEntity {
  @Property({ default: 0 })
  type: 0 | 1 | 2;

  @ManyToOne(() => GameUser)
  game_user: GameUser;

  @ManyToOne(() => GameAnswer)
  gameAnswer: GameAnswer;

  [EntityRepositoryType]?: VoteRepository;
}
