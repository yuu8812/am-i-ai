import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AuthMiddleware } from 'src/amIAi/auth/auth.middleware';
import { AuthService } from 'src/amIAi/auth/auth.service';
import { AppConfigModule } from 'src/amIAi/config/config.module';
import { GameController } from 'src/amIAi/controller/game.controller';
import { UserController } from 'src/amIAi/controller/user.controller';
import { GenerativeAiClient } from 'src/amIAi/generativeAi/generativeAiClient';
import { MikroOrmConfigModule } from 'src/amIAi/mikroOrmConfig/mikroOrmConfig.module';
import { AiUserRepository } from 'src/amIAi/repository/aiUser.repository';
import { GameRepository } from 'src/amIAi/repository/game.repository';
import { QuestionRepository } from 'src/amIAi/repository/question.repository';
import { UserRepository } from 'src/amIAi/repository/user.repository';
import { WaitingUserRepository } from 'src/amIAi/repository/waitingUser.repository';
import { AnswerQuestionUseCase } from 'src/amIAi/usecase/game/answerQuestion.usecase';
import { GetAnswersUseCase } from 'src/amIAi/usecase/game/getAnswers.usecase';
import { HealthCheckUseCase } from 'src/amIAi/usecase/game/healthCheck.usecase';
import { IsAnsweredUseCase } from 'src/amIAi/usecase/game/isAnswered.usecase';
import { IsVotedUseCase } from 'src/amIAi/usecase/game/isVoted.usecase';
import { MatchingUseCase } from 'src/amIAi/usecase/game/matching.usecase';
import { ProgressUseCase } from 'src/amIAi/usecase/game/progress.usecase';
import { ResultUseCase } from 'src/amIAi/usecase/game/result.usecase';
import { StartGameUseCase } from 'src/amIAi/usecase/game/startGame.usecase';
import { VoteUseCase } from 'src/amIAi/usecase/game/vote.usecase';
import { InitializeUseCase } from 'src/amIAi/usecase/init/initiaize.usecase';
import { CreateUserUsecase } from 'src/amIAi/usecase/user/createUser.usecase';
import { EditUserUsecase } from 'src/amIAi/usecase/user/editUser.usecase';
import { FindMeUsecase } from 'src/amIAi/usecase/user/findMe.usecase';
import { OnlineCheckUsecase } from 'src/amIAi/usecase/user/onlineCheck.usecase';

@Module({
  imports: [AppConfigModule, MikroOrmConfigModule],
  controllers: [GameController, UserController],
  providers: [
    /**
     * Generative AI
     */
    GenerativeAiClient,
    /**
     * Repository
     */
    UserRepository,
    GameRepository,
    WaitingUserRepository,
    AiUserRepository,
    /**
     * Auth
     */
    AuthService,
    /**
     * Game
     */
    StartGameUseCase,
    AnswerQuestionUseCase,
    VoteUseCase,
    MatchingUseCase,
    ProgressUseCase,
    HealthCheckUseCase,
    GetAnswersUseCase,
    IsAnsweredUseCase,
    IsVotedUseCase,
    ResultUseCase,
    /**
     * User
     */
    FindMeUsecase,
    CreateUserUsecase,
    OnlineCheckUsecase,
    EditUserUsecase,
    /**
     * question
     */
    QuestionRepository,

    /**
     * init
     */
    InitializeUseCase,
  ],
})
export class AmIAiModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: '/user', method: RequestMethod.POST })
      .forRoutes('*');
  }
}
