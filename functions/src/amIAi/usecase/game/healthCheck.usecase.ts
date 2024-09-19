import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';
import { GameRepository } from 'src/amIAi/repository/game.repository';
import { extractIdFromHeader } from 'src/amIAi/utils/getIdFromHeader';

@Injectable()
export class HealthCheckUseCase {
  constructor(private readonly gameRepository: GameRepository) {}
  async execute(
    param: GameContractRequestShapes['healthCheck'],
  ): Promise<GameContractResponseShapes['healthCheck']> {
    const { userId } = extractIdFromHeader(param);

    const response = await this.gameRepository.healthCheck({
      gameUserId: param.params.gameUserId,
      userId,
    });
    return {
      status: 200,
      body: response,
    };
  }
}
