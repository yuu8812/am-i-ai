import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';
import { GenerativeAiClient } from 'src/amIAi/generativeAi/generativeAiClient';
import { GameRepository } from 'src/amIAi/repository/game.repository';
import { extractIdFromHeader } from 'src/amIAi/utils/getIdFromHeader';

@Injectable()
export class MatchingUseCase {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly generativeAiClient: GenerativeAiClient,
  ) {}
  async execute(
    param: GameContractRequestShapes['matching'],
  ): Promise<GameContractResponseShapes['matching']> {
    const { userId } = extractIdFromHeader(param);
    const response = await this.gameRepository.matching({
      userId,
      humanCount: 2,
      waitingUserId: param.params.waitingUserId,
    });

    return {
      status: 200,
      body: response,
    };
  }
}
