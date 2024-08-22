import {
  GoogleGenerativeAI,
  GenerativeModel,
  ChatSession,
  HarmCategory,
  HarmBlockThreshold,
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
      model: 'gemini-1.5-flash',
      safetySettings,
    });
    this.chatSession = this.model.startChat({
      generationConfig: this.generationConfig({}),
      history: [],
    });
  }

  async sendMessage<T>(message: string) {
    const result = await this.chatSession.sendMessage(message);
    const json = result.response.text();
    return JSON.parse(json) as T;
  }

  private generationConfig({
    temperature = 1,
    topP = 0.95,
    topK = 64,
    maxOutputTokens = 10000,
    responseMimeType = 'application/json',
  }: {
    temperature?: number;
    topP?: number;
    topK?: number;
    maxOutputTokens?: number;
    responseMimeType?: 'application/json';
  }) {
    return {
      temperature,
      topP,
      topK,
      maxOutputTokens,
      responseMimeType,
    };
  }
}
