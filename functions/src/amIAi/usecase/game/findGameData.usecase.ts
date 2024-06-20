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
    const response = this.gameRepository.create({
      _id: `${Math.random()}`.slice(2).toString(),
      createdAt: new Date(),
    });
    await this.em.flush();
    Logger.log(JSON.stringify(response));
    return {
      status: 201,
      body: {
        users: [
          {
            id: 'id2',
            name: response.createdAt,
          },
        ],
      },
    };
  }
}
