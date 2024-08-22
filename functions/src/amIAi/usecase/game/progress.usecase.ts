import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';
import { GameRepository } from 'src/amIAi/repository/game.repository';

@Injectable()
export class ProgressUseCase {
  constructor(private readonly gameRepository: GameRepository) {}
  async execute(
    param: GameContractRequestShapes['progress'],
  ): Promise<GameContractResponseShapes['progress']> {
    const response = await this.gameRepository.progress(
      param.params.gameUserId,
    );
    return {
      status: 200,
      body: response,
    };
  }
}
