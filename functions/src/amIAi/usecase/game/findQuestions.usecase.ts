import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';

@Injectable()
export class FindQuestionsUseCase {
  async execute(
    param: GameContractRequestShapes['findQuestions'],
  ): Promise<GameContractResponseShapes['findQuestions']> {
    return {
      status: 201,
      body: {
        users: [
          {
            id: 'id2',
            name: 'name',
          },
        ],
      },
    };
  }
}
