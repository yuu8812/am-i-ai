import { GameRepository } from 'src/amIAi/repository/game.repository';
import {
  Entity,
  EntityRepositoryType,
  PrimaryKey,
  Property,
} from '@mikro-orm/core';

import { generate } from 'short-uuid';

const shortUuid = generate();

@Entity({ repository: () => GameRepository })
export class Game {
  @PrimaryKey({ default: shortUuid })
  id: string;

  @Property()
  createdAt = new Date();

  [EntityRepositoryType]?: GameRepository;
}
