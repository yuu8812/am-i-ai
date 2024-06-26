import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { AppConfigModule } from 'src/amIAi/config/config.module';
import { AppConfigService } from 'src/amIAi/config/config.service';
import { GameController } from 'src/amIAi/controller/game.controller';
import { Game } from 'src/amIAi/entities/Game';
import { GameQuestion } from 'src/amIAi/entities/GameQuestion';
import { GameUser } from 'src/amIAi/entities/GameUser';
import { Question } from 'src/amIAi/entities/Question';
import { User } from 'src/amIAi/entities/User';
import { MikroOrmConfigService } from 'src/amIAi/mikroOrmConfig/mikroOrmConfig.service';
import { AnswerQuestionUseCase } from 'src/amIAi/usecase/game/answerQuestion.usecase';
import { FindGameDataUseCase } from 'src/amIAi/usecase/game/findGameData.usecase';
import { FindQuestionsUseCase } from 'src/amIAi/usecase/game/findQuestions.usecase';
import { StartGameUseCase } from 'src/amIAi/usecase/game/startGame.usecase';

@Module({
  imports: [
    MikroOrmModule.forRootAsync({
      imports: [AppConfigModule],
      inject: [AppConfigService],
      useFactory: async (appConfigService: AppConfigService) => {
        return new MikroOrmConfigService(appConfigService).getMikroOrmConfig();
      },
    }),
    MikroOrmModule.forFeature({
      entities: [Game, Question, User, GameUser, GameQuestion],
    }),
  ],
  controllers: [GameController],
  providers: [
    /**
     * Game
     */
    FindGameDataUseCase,
    StartGameUseCase,
    AnswerQuestionUseCase,
    FindQuestionsUseCase,
  ],
})
export class AmIAiModule {}
