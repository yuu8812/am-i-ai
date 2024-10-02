import { EditUserUsecase } from './../usecase/user/editUser.usecase';
import { FindMeUsecase } from './../usecase/user/findMe.usecase';
import { Controller } from '@nestjs/common';
import { TsRestHandler, tsRestHandler } from '@ts-rest/nest';
import CONTRACT from 'src/amIAi/contract/rest';
import { CreateUserUsecase } from 'src/amIAi/usecase/user/createUser.usecase';
import { OnlineCheckUsecase } from 'src/amIAi/usecase/user/onlineCheck.usecase';

@Controller()
export class UserController {
  constructor(
    private readonly findMeUseCase: FindMeUsecase,
    private readonly createUserUseCase: CreateUserUsecase,
    private readonly onlineCheckUsecase: OnlineCheckUsecase,
    private readonly editUserUsecase: EditUserUsecase,
  ) {}

  @TsRestHandler(CONTRACT.USERS)
  async handler() {
    return tsRestHandler(CONTRACT.USERS, {
      getUser: async (param) => {
        return await this.findMeUseCase.execute(param);
      },
      createUser: async (param) => {
        return await this.createUserUseCase.execute(param);
      },
      editUser: async (param) => {
        return await this.editUserUsecase.execute(param);
      },
      onlineCheck: async (param) => {
        return await this.onlineCheckUsecase.execute(param);
      },
    });
  }
}
