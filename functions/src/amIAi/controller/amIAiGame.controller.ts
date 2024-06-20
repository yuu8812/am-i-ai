import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { AmIAiAnswerQuestionUseCase } from 'src/amIAi/usecase/game/amIAiAnswerQuestion.usecase';
import { AmIAiFindGameDataUseCase } from 'src/amIAi/usecase/game/amIAiFindGameData.usecase';
import { AmIAiStartGameUseCase } from 'src/amIAi/usecase/game/amIAiStartGame.usecase';
import CONTRACT from 'src/amIAi/contract';
import { AmIAiFindQuestionsUseCase } from 'src/amIAi/usecase/game/amIAiFindQuestions.usecase';

@Controller()
export class AmIAiGameController {
  constructor(
    private readonly amIAiFindGameDataUseCase: AmIAiFindGameDataUseCase,
    private readonly amIAiStartGameUseCase: AmIAiStartGameUseCase,
    private readonly amIAiAnswerQuestionUseCase: AmIAiAnswerQuestionUseCase,
    private readonly amIAiFindQuestionsUseCase: AmIAiFindQuestionsUseCase,
  ) {}

  @TsRestHandler(CONTRACT.GAMES)
  async handler() {
    return tsRestHandler(CONTRACT.GAMES, {
      startGame: async (param) => {
        return await this.amIAiStartGameUseCase.execute(param);
      },
      findQuestions: async (param) => {
        return await this.amIAiFindQuestionsUseCase.execute(param);
      },
      answerQuestion: async (param) => {
        return await this.amIAiAnswerQuestionUseCase.execute(param);
      },
      findGameData: async (param) => {
        return await this.amIAiFindGameDataUseCase.execute(param);
      },
    });
  }
}
