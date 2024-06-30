import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { AnswerQuestionUseCase } from 'src/amIAi/usecase/game/answerQuestion.usecase';
import { StartGameUseCase } from 'src/amIAi/usecase/game/startGame.usecase';
import { FindGameDataUseCase } from 'src/amIAi/usecase/game/findGameData.usecase';
import { FindQuestionsUseCase } from 'src/amIAi/usecase/game/findQuestions.usecase';
import CONTRACT from 'src/amIAi/contract/rest';

@Controller()
export class GameController {
  constructor(
    private readonly findGameDataUseCase: FindGameDataUseCase,
    private readonly startGameUseCase: StartGameUseCase,
    private readonly answerQuestionUseCase: AnswerQuestionUseCase,
    private readonly findQuestionsUseCase: FindQuestionsUseCase,
  ) {}

  @TsRestHandler(CONTRACT.GAMES)
  async handler() {
    return tsRestHandler(CONTRACT.GAMES, {
      startGame: async (param) => {
        return await this.startGameUseCase.execute(param);
      },
      findQuestions: async (param) => {
        return await this.findQuestionsUseCase.execute(param);
      },
      answerQuestion: async (param) => {
        return await this.answerQuestionUseCase.execute(param);
      },
      findGameData: async (param) => {
        return await this.findGameDataUseCase.execute(param);
      },
    });
  }
}
