import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';
import { GameRepository } from 'src/amIAi/repository/game.repository';
import { extractIdFromHeader } from 'src/amIAi/utils/getIdFromHeader';

@Injectable()
export class IsAnsweredUseCase {
  constructor(private readonly gameRepository: GameRepository) {}
  async execute(
    param: GameContractRequestShapes['isAnswered'],
  ): Promise<GameContractResponseShapes['isAnswered']> {
    const { userId } = extractIdFromHeader(param);
    const response = await this.gameRepository.isAnswered({
      gameUserId: param.params.gameUserId,
      questionId: param.query.questionId,
      userId,
    });

    return {
      status: 200,
      body: {
        isAnswered: response,
      },
    };
  }
}
