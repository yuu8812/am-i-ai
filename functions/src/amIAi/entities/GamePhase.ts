import {
  Entity,
  EntityRepositoryType,
  ManyToOne,
  Property,
} from '@mikro-orm/core';
import { Game } from 'src/amIAi/entities/Game';
import { BaseEntity } from 'src/amIAi/entityHelper/base';
import { GamePhaseRepository } from 'src/amIAi/repository/gamePhase.repository';

@Entity({
  tableName: 'game_phase',
  repository: () => GamePhaseRepository,
})
export class GamePhase extends BaseEntity {
  @Property({ default: 0 })
  status: 0 | 1 | 2 | 3;

  @Property({ default: 0 })
  phase: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

  @ManyToOne(() => Game)
  game: Game;

  [EntityRepositoryType]?: GamePhaseRepository;
}
