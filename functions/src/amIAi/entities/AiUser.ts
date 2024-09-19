import { Collection, Entity, OneToMany, Property } from '@mikro-orm/core';
import { Personality } from 'src/amIAi/constants/personality';
import { GameUser } from 'src/amIAi/entities/GameUser';

import { BaseEntity } from 'src/amIAi/entityHelper/base';

@Entity({
  tableName: 'ai_user',
})
export class AiUser extends BaseEntity {
  @Property({ default: 0 })
  // 0: Active, 2: Not Active
  status: 0 | 1;

  @Property({ type: 'jsonb' })
  config: Personality;

  @OneToMany(() => GameUser, (gameUser) => gameUser.aiUser)
  GameUsers = new Collection<GameUser>(this);
}
