import { Property, ManyToOne, Entity } from '@mikro-orm/core';
import { GameRateType } from 'src/amIAi/constants/game';
import { User } from 'src/amIAi/entities/User';
import { BaseEntity } from 'src/amIAi/entityHelper/base';

@Entity({
  tableName: 'game_rate',
})
export class GameRate extends BaseEntity {
  @Property({ default: 0 })
  // 0: humanDetectionRate 1: AiNessRate
  type: GameRateType;

  @Property()
  rate: number;

  @ManyToOne(() => User)
  user: User;
}
