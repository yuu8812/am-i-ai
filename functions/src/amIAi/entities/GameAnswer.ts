import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { GameQuestion } from 'src/amIAi/entities/GameQuestion';
import { GameUser } from 'src/amIAi/entities/GameUser';
import { BaseEntity } from 'src/amIAi/entityHelper/base';

@Entity({
  tableName: 'game_answer',
})
export class GameAnswer extends BaseEntity {
  @Property({ default: 0 })
  status: 0 | 1 | 2 | 3;

  @Property({ type: 'text' })
  answer: string;

  @ManyToOne(() => GameQuestion)
  question: GameQuestion;

  @ManyToOne(() => GameUser)
  gameUser: GameUser;
}
