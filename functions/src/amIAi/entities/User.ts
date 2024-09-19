import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { GameRate } from 'src/amIAi/entities/GameRate';
import { GameUser } from 'src/amIAi/entities/GameUser';
import { WaitingUser } from 'src/amIAi/entities/WaitingUser';
import { BaseEntity } from 'src/amIAi/entityHelper/base';

@Entity({
  tableName: 'user',
})
export class User extends BaseEntity {
  @Property({ default: 0 })
  status: 0 | 1 | 2 | 3;

  @Property({ type: 'text' })
  email: string;

  @Property({ type: 'text' })
  name: string;

  @Property({ type: 'text', nullable: true })
  authentication_id: string;

  @Property({ default: 0 })
  // 0: 日本語, 1: 英語
  language: 0 | 1;

  @Property({ onCreate: () => new Date(), nullable: true })
  onlineDetectedAt: Date;

  @Property({ nullable: true })
  iconUrl: string;

  @OneToMany(() => GameUser, (gameUser) => gameUser.user)
  gameUsers = new Collection<GameUser>(this);

  @OneToMany(() => WaitingUser, (waitingUser) => waitingUser.user)
  waitingUsers = new Collection<WaitingUser>(this);

  @OneToMany(() => GameRate, (gameRate) => gameRate.user)
  gameRates = new Collection<GameRate>(this);
}
