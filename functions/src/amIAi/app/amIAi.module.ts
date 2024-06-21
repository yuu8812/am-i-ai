import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Logger, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from 'src/amIAi/app/amIAi.configService';
import { GameController } from 'src/amIAi/controller/game.controller';
import { Game } from 'src/amIAi/entities/Game';
import { mikroOrmConfig } from 'src/amIAi/mikroOrmConfig';
import { AnswerQuestionUseCase } from 'src/amIAi/usecase/game/answerQuestion.usecase';
import { FindGameDataUseCase } from 'src/amIAi/usecase/game/findGameData.usecase';
import { FindQuestionsUseCase } from 'src/amIAi/usecase/game/findQuestions.usecase';
import { StartGameUseCase } from 'src/amIAi/usecase/game/startGame.usecase';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: (() => {
        if (process.env.NODE_ENV === 'NEST_SELF_HOSTED') {
          return '.env.dev';
        }
        return '.env';
      })(),
      isGlobal: true,
      validate: (config: Environment) => {
        const { ENV, NODE_ENV } = config;
        if (!ENV) {
          throw new Error('ENV is required');
        }
        Logger.log(`ENVIRONMENT: ${ENV.toUpperCase()}`);
        Logger.log(`NODE_ENV: ${NODE_ENV.toUpperCase()}`);
        return config;
      },
    }),
    MikroOrmModule.forRoot(mikroOrmConfig),
    MikroOrmModule.forFeature({
      entities: [Game],
    }),
  ],
  controllers: [GameController],
  providers: [
    AppConfigService,
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
