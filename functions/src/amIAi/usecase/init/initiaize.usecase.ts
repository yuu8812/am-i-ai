import { AiUserRepository } from './../../repository/aiUser.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class InitializeUseCase {
  constructor(private readonly aiUserRepository: AiUserRepository) {}
  async execute(): Promise<void> {
    await this.aiUserRepository.initializeAiUser();
  }
}
