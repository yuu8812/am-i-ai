import { GenerativeAiClient } from 'src/amIAi/generativeAi/generativeAiClient';
import { AiUserRepository } from './../../repository/aiUser.repository';
import { Injectable } from '@nestjs/common';
import { QuestionRepository } from 'src/amIAi/repository/question.repository';

@Injectable()
export class InitializeUseCase {
  constructor(
    private readonly aiUserRepository: AiUserRepository,
    private readonly generativeAiClient: GenerativeAiClient,
    private readonly questionRepository: QuestionRepository,
  ) {}
  async execute(): Promise<void> {
    await this.aiUserRepository.initializeAiUser();
    const { questions } = await this.generativeAiClient.sendMessage<{
      questions: string[];
    }>(`
5つの、簡単に答えられる時事問題を作成してください
レスポンスは以下の形式でお願いします
{
  questions: string[]
}
`);
    await this.questionRepository.createQuestion(questions, 0);
  }
}
