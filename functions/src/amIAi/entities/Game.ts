import { GameRepository } from 'src/amIAi/repository/game.repository';
import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

@Entity({ repository: () => GameRepository })
export class Game {
  @PrimaryKey()
  _id!: string;

  @Property()
  createdAt = new Date();

  [EntityRepositoryType]?: GameRepository;
}
