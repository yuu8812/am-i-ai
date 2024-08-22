import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';

import { BaseEntity } from 'src/amIAi/entityHelper/base';
import { GameUser } from 'src/amIAi/entities/GameUser';
import { GameQuestion } from 'src/amIAi/entities/GameQuestion';

@Entity({
  tableName: 'game',
})
export class Game extends BaseEntity {
  @Property({ default: 0 })
  status: 0 | 1 | 2 | 3;

  @Property({ default: 0 })
  language: 0 | 1;

  @Property({ default: 0 })
  // 0: detectAi
  // 1: detectHuman
  gameMode: 0 | 1;

  @Property({ default: 0 })
  humanCount: number;

  @Property({ default: 0 })
  aiCount: number;

  @OneToMany(() => GameUser, (gameUser) => gameUser.game)
  gameUsers = new Collection<GameUser>(this);

  @OneToMany(() => GameQuestion, (gameQuestion) => gameQuestion.game)
  gameQuestions = new Collection<GameQuestion>(this);
}
