import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';

@Injectable()
export class AnswerQuestionUseCase {
  async execute(
    param: GameContractRequestShapes['answerQuestion'],
  ): Promise<GameContractResponseShapes['answerQuestion']> {
    return await {
      status: 201,
      body: 'OK',
    };
  }
}
