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
    return {
      status: 201,
      body: 'OK',
    };
  }
}
