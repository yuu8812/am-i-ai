import { HealthCheckUseCase } from './../usecase/game/healthCheck.usecase';
import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import { AnswerQuestionUseCase } from 'src/amIAi/usecase/game/answerQuestion.usecase';
import { StartGameUseCase } from 'src/amIAi/usecase/game/startGame.usecase';
import CONTRACT from 'src/amIAi/contract/rest';
import { VoteUseCase } from 'src/amIAi/usecase/game/vote.usecase';
import { MatchingUseCase } from 'src/amIAi/usecase/game/matching.usecase';
import { ProgressUseCase } from 'src/amIAi/usecase/game/progress.usecase';
import { GetAnswersUseCase } from 'src/amIAi/usecase/game/getAnswers.usecase';
import { IsAnsweredUseCase } from 'src/amIAi/usecase/game/isAnswered.usecase';
import { IsVotedUseCase } from 'src/amIAi/usecase/game/isVoted.usecase';

@Controller()
export class GameController {
  constructor(
    private readonly startGameUseCase: StartGameUseCase,
    private readonly answerQuestionUseCase: AnswerQuestionUseCase,
    private readonly voteUseCase: VoteUseCase,
    private readonly matchingUseCase: MatchingUseCase,
    private readonly progressUseCase: ProgressUseCase,
    private readonly healthCheckUseCase: HealthCheckUseCase,
    private readonly getAnswersUseCase: GetAnswersUseCase,
    private readonly isAnsweredUseCase: IsAnsweredUseCase,
    private readonly isVotedUseCase: IsVotedUseCase,
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
      getAnswers: async (param) => {
        return await this.getAnswersUseCase.execute(param);
      },
      isAnswered: async (param) => {
        return await this.isAnsweredUseCase.execute(param);
      },
      isVoted: async (param) => {
        return await this.isVotedUseCase.execute(param);
      },
    });
  }
}
