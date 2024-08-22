import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';
import { GameRepository } from 'src/amIAi/repository/game.repository';

@Injectable()
export class HealthCheckUseCase {
  constructor(private readonly gameRepository: GameRepository) {}
  async execute(
    param: GameContractRequestShapes['healthCheck'],
  ): Promise<GameContractResponseShapes['healthCheck']> {
    const response = await this.gameRepository.healthCheck(
      param.params.gameUserId,
    );
    return {
      status: 200,
      body: response,
    };
  }
}
