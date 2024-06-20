import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';

@Injectable()
export class AmIAiFindGameDataUseCase {
  async execute(
    param: GameContractRequestShapes['findGameData'],
  ): Promise<GameContractResponseShapes['findGameData']> {
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
