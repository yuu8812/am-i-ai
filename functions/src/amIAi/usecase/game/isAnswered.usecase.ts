import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';
import { GameRepository } from 'src/amIAi/repository/game.repository';

@Injectable()
export class IsAnsweredUseCase {
  constructor(private readonly gameRepository: GameRepository) {}
  async execute(
    param: GameContractRequestShapes['isAnswered'],
  ): Promise<GameContractResponseShapes['isAnswered']> {
    const response = await this.gameRepository.isAnswered({
      gameUserId: param.params.gameUserId,
      questionId: param.query.questionId,
    });

    return {
      status: 200,
      body: {
        isAnswered: response,
      },
    };
  }
}
