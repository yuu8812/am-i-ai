import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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
      envFilePath: [`.env.dev`],
      validate: (config) => {
        const { ENV } = config;
        if (!ENV) {
          throw new Error('ENV is required');
        }
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
