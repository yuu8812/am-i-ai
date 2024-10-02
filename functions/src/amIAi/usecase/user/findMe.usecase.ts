import { UserRepository } from 'src/amIAi/repository/user.repository';
import { Injectable } from '@nestjs/common';
import {
  UserContractRequestShapes,
  UserContractResponseShapes,
} from 'src/amIAi/contract/type';
import { extractIdFromHeader } from 'src/amIAi/utils/getIdFromHeader';

@Injectable()
export class FindMeUsecase {
  constructor(private readonly userRepository: UserRepository) {}
  async execute(
    param: UserContractRequestShapes['getUser'],
  ): Promise<UserContractResponseShapes['getUser']> {
    const { userId } = extractIdFromHeader(param);
    const user = await this.userRepository.findUserById(userId);
    return {
      status: 200,
      body: {
        id: user.id,
        name: user.name,
        iconUrl: user.iconUrl,
        rates: {
          humanDetection: user.rates.humanDetection,
          humanNess: user.rates.humanNess,
          humanNessRank: user.rates.humanNessRank,
          humanDetectionRank: user.rates.humanDetectionRank,
        },
      },
    };
  }
}
