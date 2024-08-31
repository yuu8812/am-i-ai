import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';
import { GameRepository } from 'src/amIAi/repository/game.repository';

@Injectable()
export class IsVotedUseCase {
  constructor(private readonly gameRepository: GameRepository) {}
  async execute(
    param: GameContractRequestShapes['isVoted'],
  ): Promise<GameContractResponseShapes['isVoted']> {
    const response = await this.gameRepository.isVoted(param.params.gameUserId);

    return {
      status: 200,
      body: {
        isVoted: response,
      },
    };
  }
}
