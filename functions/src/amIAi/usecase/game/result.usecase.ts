import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';
import { GameRepository } from 'src/amIAi/repository/game.repository';
import { extractIdFromHeader } from 'src/amIAi/utils/getIdFromHeader';

@Injectable()
export class ResultUseCase {
  constructor(private readonly gameRepository: GameRepository) {}
  async execute(
    param: GameContractRequestShapes['result'],
  ): Promise<GameContractResponseShapes['result']> {
    const { userId } = extractIdFromHeader(param);
    const response = await this.gameRepository.result({
      userId,
      gameUserId: param.params.gameUserId,
    });
    return {
      status: 200,
      body: response,
    };
  }
}
