import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';

import { BaseEntity } from 'src/amIAi/entityHelper/base';
import { GameUser } from 'src/amIAi/entities/GameUser';
import { GameQuestion } from 'src/amIAi/entities/GameQuestion';
import { Vote } from 'src/amIAi/entities/Vote';
import { GameModeType, LanguageType } from 'src/amIAi/constants/game';

@Entity({
  tableName: 'game',
})
export class Game extends BaseEntity {
  @Property({ default: 0 })
  // 0: In progress, 2: Result Checked
  status: 0 | 1 | 2 | 3;

  @Property({ default: 0 })
  language: LanguageType;

  @Property({ default: 0 })
  // 0: detectHuman
  // 1: detectAi
  gameMode: GameModeType;

  @Property({ default: 0 })
  humanCount: number;

  @Property({ default: 0 })
  aiCount: number;

  @Property({ nullable: true })
  shouldAnswerAt: Date;

  @OneToMany(() => GameUser, (gameUser) => gameUser.game)
  gameUsers = new Collection<GameUser>(this);

  @OneToMany(() => GameQuestion, (gameQuestion) => gameQuestion.game)
  gameQuestions = new Collection<GameQuestion>(this);

  @OneToMany(() => Vote, (vote) => vote.game)
  votes = new Collection<Vote>(this);
}
