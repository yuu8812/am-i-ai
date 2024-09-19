import {
  Collection,
  Entity,
  ManyToOne,
  OneToMany,
  Property,
} from '@mikro-orm/core';
import { IsVotedType, WhichUserType } from 'src/amIAi/constants/game';
import { AiUser } from 'src/amIAi/entities/AiUser';
import { Game } from 'src/amIAi/entities/Game';
import { GameAnswer } from 'src/amIAi/entities/GameAnswer';
import { User } from 'src/amIAi/entities/User';
import { Vote } from 'src/amIAi/entities/Vote';
import { BaseEntity } from 'src/amIAi/entityHelper/base';

@Entity({
  tableName: 'game_user',
})
export class GameUser extends BaseEntity {
  @Property({ default: 0 })
  // 0: In progress, 2: Result Checked
  status: 0 | 1 | 2 | 3;

  @Property({ default: 0 })
  // 0: human, 1: ai
  whichUser: WhichUserType;

  @Property({ default: 0 })
  // 0: not voted, 1: voted
  isVoted: IsVotedType;

  @Property({ onCreate: () => new Date(), nullable: true })
  onlineDetectedAt: Date;

  @ManyToOne(() => Game)
  game: Game;

  @ManyToOne(() => AiUser, { nullable: true })
  aiUser: AiUser;

  @ManyToOne(() => User, { nullable: true })
  user?: User;

  @OneToMany(() => Vote, (vote) => vote.voteBy)
  voteBys = new Collection<Vote>(this);

  @OneToMany(() => Vote, (vote) => vote.voteTo)
  voteTos = new Collection<Vote>(this);

  @OneToMany(() => GameAnswer, (gameAnswer) => gameAnswer.gameUser)
  gameAnswers = new Collection<GameAnswer>(this);
}
