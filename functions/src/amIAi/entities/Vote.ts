import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
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
  voteBy: GameUser;

  @ManyToOne(() => GameUser)
  voteTo: GameUser;

  [EntityRepositoryType]?: VoteRepository;
}
