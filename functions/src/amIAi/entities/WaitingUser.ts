import { Entity, ManyToOne, Property } from '@mikro-orm/core';
import { LanguageType } from 'src/amIAi/constants/game';
import { User } from 'src/amIAi/entities/User';
import { BaseEntity } from 'src/amIAi/entityHelper/base';

@Entity({
  tableName: 'waiting_user',
})
export class WaitingUser extends BaseEntity {
  @Property({ default: 0 })
  // 0: 待機中, 1: 待機終了
  status: 0 | 1 | 2;

  @Property({ default: 0 })
  // 0: 1vs1
  type: 0;

  @Property({ default: 0 })
  language: LanguageType;

  @Property({ onCreate: () => new Date(), nullable: true })
  onlineDetectedAt: Date;

  @ManyToOne(() => User)
  user: User;
}
