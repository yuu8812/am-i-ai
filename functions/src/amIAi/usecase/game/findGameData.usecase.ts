import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';
import { GameRepository } from 'src/amIAi/repository/game.repository';

@Injectable()
export class FindGameDataUseCase {
  constructor(
    private readonly em: EntityManager,
    private readonly gameRepository: GameRepository,
  ) {}
  async execute(
    param: GameContractRequestShapes['findGameData'],
  ): Promise<GameContractResponseShapes['findGameData']> {
    Logger.log(param.headers['x-user-id']);
    return {
      status: 200,
      body: { id: param.headers['x-user-id'] },
    };
  }
}
