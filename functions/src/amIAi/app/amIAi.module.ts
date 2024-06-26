import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AppConfigModule } from 'src/amIAi/config/config.module';
import { AppConfigService } from 'src/amIAi/config/config.service';
import { GameController } from 'src/amIAi/controller/game.controller';
import { Game } from 'src/amIAi/entities/Game';
import { MikroOrmConfigService } from 'src/amIAi/mikroOrmConfig/mikroOrmConfig.service';
import { AnswerQuestionUseCase } from 'src/amIAi/usecase/game/answerQuestion.usecase';
import { FindGameDataUseCase } from 'src/amIAi/usecase/game/findGameData.usecase';
import { FindQuestionsUseCase } from 'src/amIAi/usecase/game/findQuestions.usecase';
import { StartGameUseCase } from 'src/amIAi/usecase/game/startGame.usecase';

@Module({
  imports: [
    AppConfigModule,
    MikroOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: async (appConfigService: AppConfigService) => {
        return new MikroOrmConfigService(appConfigService).getMikroOrmConfig();
      },
    }),
    MikroOrmModule.forFeature({
      entities: [Game],
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
