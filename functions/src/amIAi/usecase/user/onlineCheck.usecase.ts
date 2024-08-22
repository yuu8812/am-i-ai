import { UserRepository } from 'src/amIAi/repository/user.repository';
import { Injectable } from '@nestjs/common';
import {
  UserContractRequestShapes,
  UserContractResponseShapes,
} from 'src/amIAi/contract/type';
import { extractIdFromHeader } from 'src/amIAi/utils/getIdFromHeader';

@Injectable()
export class OnlineCheckUsecase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(
    param: UserContractRequestShapes['onlineCheck'],
  ): Promise<UserContractResponseShapes['onlineCheck']> {
    const { userId } = extractIdFromHeader(param);
    const response = await this.userRepository.onlineCheck(userId);
    return {
      status: 201,
      body: response,
    };
  }
}
