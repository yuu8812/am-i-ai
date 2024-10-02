import { GenerativeAiClient } from 'src/amIAi/generativeAi/generativeAiClient';
import { AiUserRepository } from '../../repository/aiUser.repository';
import { Injectable } from '@nestjs/common';
import { QuestionRepository } from 'src/amIAi/repository/question.repository';
import { LANGUAGE, LanguageType } from 'src/amIAi/constants/game';

@Injectable()
export class InitializeUseCase {
  constructor(
    private readonly aiUserRepository: AiUserRepository,
    private readonly generativeAiClient: GenerativeAiClient,
    private readonly questionRepository: QuestionRepository,
  ) {}
  async execute(): Promise<void> {
    // 100回ずつそれぞれ質問を作成
    const questionExist = await this.questionRepository.checkQuestionExist();
    !questionExist &&
      Promise.all(
        Array.from({ length: 10 }, (_, i) => i).map(async () => {
          this.createQuestion(LANGUAGE.JP);
          this.createQuestion(LANGUAGE.EN);
        }),
      );
  }

  async createQuestion(language: LanguageType): Promise<void> {
    await this.aiUserRepository.initializeAiUser();
    const { questions } = await this.generativeAiClient.sendMessage<{
      questions: string[];
    }>(`
${
  language === LANGUAGE.JP
    ? '質問を10つの作成してください'
    : 'Please create 10 questions'
}

${
  language === LANGUAGE.JP
    ? 'ただし以下の点に留意してください。'
    : 'However, please note the following.'
}

${
  language === LANGUAGE.JP
    ? `1. 40文字程度もしくはそれ以内で答えられる質問であること
2. 答える人の内面を知るための質問であること
3. 答える人の知識に依存しすぎた質問でないこと
4. 非常に一般的で汎用的な質問ではないこと
5. 倫理的なジレンマを含むことが好ましい
6. 質問の聞き方を文学的に工夫すること
7. 哲学的な質問が好ましい
8. twitterやsnsなど大衆で議論されているような問題が好ましい
`
    : `
1. The question should be 40 characters or less.
2. It should aim to understand the respondent's inner self.
3. It should not rely too heavily on the respondent's knowledge.
4. It should not be a very general or generic question.
5. It is preferable to include ethical dilemmas.
6. The phrasing of the question should be creatively literary.
7. Philosophical questions are preferred.
`
}

${
  language === LANGUAGE.JP
    ? '日本語で回答してください'
    : 'Answer in english please'
}

{
  questions: string[]
}
`);
    await this.questionRepository.createQuestion(questions, language);
  }
}
