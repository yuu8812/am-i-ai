import { GameRepository } from 'src/amIAi/repository/game.repository';
import { Entity, EntityRepositoryType, Property } from '@mikro-orm/core';

import { BaseEntity } from 'src/amIAi/entityHelper/base';

@Entity({
  repository: () => GameRepository,
  tableName: 'game',
})
export class Game extends BaseEntity {
  @Property({ default: 0 })
  status: 0 | 1 | 2 | 3;

  [EntityRepositoryType]?: GameRepository;
}
