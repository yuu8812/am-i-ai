import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';

@Injectable()
export class AmIAiFindQuestionsUseCase {
  async execute(
    param: GameContractRequestShapes['findQuestions'],
  ): Promise<GameContractResponseShapes['findQuestions']> {
    return await {
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
