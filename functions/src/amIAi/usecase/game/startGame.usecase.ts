import { QuestionRepository } from './../../repository/question.repository';
import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';
import { GameRepository } from 'src/amIAi/repository/game.repository';
import { extractIdFromHeader } from 'src/amIAi/utils/getIdFromHeader';

@Injectable()
export class StartGameUseCase {
  constructor(
    private readonly gameRepository: GameRepository,
    private readonly questionRepository: QuestionRepository,
  ) {}
  async execute(
    param: GameContractRequestShapes['startGame'],
  ): Promise<GameContractResponseShapes['startGame']> {
    const { userId } = extractIdFromHeader(param);
    const startGameResponse = await this.gameRepository.startGame(
      userId,
      param.body.language,
    );
    return {
      status: 201,
      body: startGameResponse,
    };
  }
}
