import { HealthCheckUseCase } from './../usecase/game/healthCheck.usecase';
import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { AnswerQuestionUseCase } from 'src/amIAi/usecase/game/answerQuestion.usecase';
import { StartGameUseCase } from 'src/amIAi/usecase/game/startGame.usecase';
import CONTRACT from 'src/amIAi/contract/rest';
import { VoteUseCase } from 'src/amIAi/usecase/game/vote.usecase';
import { MatchingUseCase } from 'src/amIAi/usecase/game/matching.usecase';
import { ProgressUseCase } from 'src/amIAi/usecase/game/progress.usecase';

@Controller()
export class GameController {
  constructor(
    private readonly startGameUseCase: StartGameUseCase,
    private readonly answerQuestionUseCase: AnswerQuestionUseCase,
    private readonly voteUseCase: VoteUseCase,
    private readonly matchingUseCase: MatchingUseCase,
    private readonly progressUseCase: ProgressUseCase,
    private readonly healthCheckUseCase: HealthCheckUseCase,
  ) {}

  @TsRestHandler(CONTRACT.GAMES)
  async handler() {
    return tsRestHandler(CONTRACT.GAMES, {
      startGame: async (param) => {
        return await this.startGameUseCase.execute(param);
      },
      vote: async (param) => {
        return await this.voteUseCase.execute(param);
      },
      answerQuestion: async (param) => {
        return await this.answerQuestionUseCase.execute(param);
      },
      matching: async (param) => {
        return await this.matchingUseCase.execute(param);
      },
      progress: async (param) => {
        return await this.progressUseCase.execute(param);
      },
      healthCheck: async (param) => {
        return await this.healthCheckUseCase.execute(param);
      },
    });
  }
}
