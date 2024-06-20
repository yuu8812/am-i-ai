import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AmIAiGameController } from 'src/amIAi/controller/amIAiGame.controller';
import { AmIAiAnswerQuestionUseCase } from 'src/amIAi/usecase/game/amIAiAnswerQuestion.usecase';
import { AmIAiFindGameDataUseCase } from 'src/amIAi/usecase/game/amIAiFindGameData.usecase';
import { AmIAiFindQuestionsUseCase } from 'src/amIAi/usecase/game/amIAiFindQuestions.usecase';
import { AmIAiStartGameUseCase } from 'src/amIAi/usecase/game/amIAiStartGame.usecase';

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
  ],
  controllers: [AmIAiGameController],
  providers: [
    AmIAiFindGameDataUseCase,
    AmIAiStartGameUseCase,
    AmIAiAnswerQuestionUseCase,
    AmIAiFindQuestionsUseCase,
  ],
})
export class AmIAiModule {}
