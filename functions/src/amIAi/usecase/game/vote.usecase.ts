import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';
import { GameRepository } from 'src/amIAi/repository/game.repository';
import { extractIdFromHeader } from 'src/amIAi/utils/getIdFromHeader';

@Injectable()
export class VoteUseCase {
  constructor(private readonly gameRepository: GameRepository) {}
  async execute(
    param: GameContractRequestShapes['vote'],
  ): Promise<GameContractResponseShapes['vote']> {
    const { userId } = extractIdFromHeader(param);
    const response = await this.gameRepository.vote({
      userId,
      voteBy: param.params.gameUserId,
      voteTo: param.body.voteTo,
    });
    return {
      status: 200,
      body: response,
    };
  }
}
