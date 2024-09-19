import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { VoteType } from 'src/amIAi/constants/game';
import { Game } from 'src/amIAi/entities/Game';
import { GameUser } from 'src/amIAi/entities/GameUser';
import { BaseEntity } from 'src/amIAi/entityHelper/base';

@Entity({
  tableName: 'vote',
})
export class Vote extends BaseEntity {
  @Property({ default: 0 })
  // 0: isHuman 1: isAi
  type: VoteType;

  @ManyToOne(() => GameUser)
  voteBy: GameUser;

  @ManyToOne(() => GameUser)
  voteTo: GameUser;

  @ManyToOne(() => Game)
  game: Game;
}
