import {
  Entity,
  EntityRepositoryType,
  OneToOne,
  Property,
} from '@mikro-orm/core';
import { Game } from 'src/amIAi/entities/Game';
import { User } from 'src/amIAi/entities/User';
import { BaseEntity } from 'src/amIAi/entityHelper/base';
import { GameUserRepository } from 'src/amIAi/repository/gameUser.repository';

@Entity({
  tableName: 'game_user',
  repository: () => GameUserRepository,
})
export class GameUser extends BaseEntity {
  @Property({ default: 0 })
  status: 0 | 1 | 2 | 3;

  @OneToOne(() => Game)
  game: Game;

  @OneToOne(() => User)
  user: User;

  [EntityRepositoryType]?: GameUserRepository;
}
