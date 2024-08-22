import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';
import { GameRepository } from 'src/amIAi/repository/game.repository';
import { extractIdFromHeader } from 'src/amIAi/utils/getIdFromHeader';

@Injectable()
export class StartGameUseCase {
  constructor(private readonly gameRepository: GameRepository) {}
  async execute(
    param: GameContractRequestShapes['startGame'],
  ): Promise<GameContractResponseShapes['startGame']> {
    const { userId, language } = extractIdFromHeader(param);
    const startGameResponse = await this.gameRepository.startGame(
      userId,
      language,
    );
    return {
      status: 201,
      body: startGameResponse,
    };
  }
}
