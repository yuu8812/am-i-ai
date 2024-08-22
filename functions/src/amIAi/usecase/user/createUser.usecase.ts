import { UserRepository } from 'src/amIAi/repository/user.repository';
import { Injectable } from '@nestjs/common';
import {
  UserContractRequestShapes,
  UserContractResponseShapes,
} from 'src/amIAi/contract/type';
import { AuthService } from 'src/amIAi/auth/auth.service';
import { extractToken } from 'src/amIAi/utils/extractToken';

@Injectable()
export class CreateUserUsecase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly authService: AuthService,
  ) {}
  async execute(
    param: UserContractRequestShapes['createUser'],
  ): Promise<UserContractResponseShapes['createUser']> {
    const token = extractToken(param.headers['authorization'] as string);

    const { uid, email, picture } = await this.authService.validate(token);

    await this.userRepository.createUser({
      authenticationId: uid,
      name: 'hello',
      email: email,
      iconUrl: picture,
      language: 0,
    });

    return {
      status: 201,
      body: {
        id: 'created',
      },
    };
  }
}
