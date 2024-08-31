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
import { User } from 'src/amIAi/entities/User';
import { Vote } from 'src/amIAi/entities/Vote';
import { BaseEntity } from 'src/amIAi/entityHelper/base';
import { GameUserRepository } from 'src/amIAi/repository/gameUser.repository';

@Entity({
  tableName: 'game_user',
  repository: () => GameUserRepository,
})
export class GameUser extends BaseEntity {
  @Property({ default: 0 })
  status: 0 | 1 | 2 | 3;

  @Property({ default: 0 })
  // 0: human, 1: ai
  type: 0 | 1;

  @Property({ onCreate: () => new Date(), nullable: true })
  onlineDetectedAt: Date;

  @ManyToOne(() => Game)
  game: Game;

  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @OneToMany(() => Vote, (vote) => vote.voteBy)
  voteBys = new Collection<Vote>(this);

  @OneToMany(() => Vote, (vote) => vote.voteTo)
  voteTos = new Collection<Vote>(this);

  @OneToMany(() => GameAnswer, (gameAnswer) => gameAnswer.gameUser)
  gameAnswers = new Collection<GameAnswer>(this);

  [EntityRepositoryType]?: GameUserRepository;
}
