import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';
import { generate } from 'short-uuid';
import { GameUserRepository } from 'src/amIAi/repository/gameUser.repository';

@Entity({
  tableName: 'game_user',
  repository: () => GameUserRepository,
})
export class GameUser {
  @PrimaryKey({ onCreate: () => generate() })
  id: string;

  @Property({ onCreate: () => new Date() })
  createdAt: Date;

  @Property({ onUpdate: () => new Date() })
  updatedAt: Date;

  @Property({ default: 0 })
  status: 0 | 1 | 2 | 3;

  [EntityRepositoryType]?: GameUserRepository;
}
