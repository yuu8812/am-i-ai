import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
  HarmCategory,
  HarmBlockThreshold,
  GenerationConfig,
} from '@google/generative-ai';
import { Injectable } from '@nestjs/common';
import { AppConfigService } from 'src/amIAi/config/config.service';

const safetySettings = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

@Injectable()
export class GenerativeAiClient {
  private apiKey: string;
  private genAi: GoogleGenerativeAI;
  private model: GenerativeModel;
  private chatSession: ChatSession;

  constructor(private readonly appConfigService: AppConfigService) {
    this.apiKey = this.appConfigService.get('GENERATIVE_AI_API_KEY');
    this.genAi = new GoogleGenerativeAI(this.apiKey);
    this.model = this.genAi.getGenerativeModel({
      model: 'gemini-1.5-pro',
      safetySettings,
    });
    this.chatSession = this.model.startChat({
      generationConfig: this.generationConfig({}),
      history: [],
    });
  }

  //エラー時の3回までの再実行機能を備えたsendMessage
  async sendMessage<T>(message: string) {
    let retryCount = 0;
    while (retryCount < 3) {
      try {
        const result = await this.chatSession.sendMessage(message);
        const json = result.response.text();
        return JSON.parse(json) as T;
      } catch (error) {
        retryCount++;
        if (retryCount === 3) {
          throw new Error(
            `Failed to send message to generative AI : ${JSON.stringify(
              error,
            )}`,
          );
        }
      }
    }
  }

  private generationConfig({
    temperature = 1.8, // Increase from 1.5 to 1.8 or higher
    topP = 0.8, // Increase to allow more diverse sampling
    topK = 100, // Allow for more options
    maxOutputTokens = 10000,
    responseMimeType = 'application/json',
  }): GenerationConfig {
    return {
      temperature,
      topP,
      topK,
      maxOutputTokens,
      responseMimeType,
    };
  }
}
