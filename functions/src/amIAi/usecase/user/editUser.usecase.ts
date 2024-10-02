import { UserRepository } from 'src/amIAi/repository/user.repository';
import { Injectable } from '@nestjs/common';
import {
  UserContractRequestShapes,
  UserContractResponseShapes,
} from 'src/amIAi/contract/type';
import { AuthService } from 'src/amIAi/auth/auth.service';
import { extractIdFromHeader } from 'src/amIAi/utils/getIdFromHeader';

@Injectable()
export class EditUserUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}
  async execute(
    param: UserContractRequestShapes['editUser'],
  ): Promise<UserContractResponseShapes['editUser']> {
    const { userId } = extractIdFromHeader(param);

    const id = await this.userRepository.editUser({
      name: param.body.name,
      userId,
    });

    return {
      status: 201,
      body: {
        id,
      },
    };
  }
}
