import { Injectable } from '@nestjs/common';
import {
  GameContractRequestShapes,
  GameContractResponseShapes,
} from 'src/amIAi/contract/type';

@Injectable()
export class AmIAiStartGameUseCase {
  async execute(
    param: GameContractRequestShapes['startGame'],
  ): Promise<GameContractResponseShapes['startGame']> {
    return await {
      status: 201,
      body: undefined,
    };
  }
}
