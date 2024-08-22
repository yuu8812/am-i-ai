import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { Game } from 'src/amIAi/entities/Game';
import { User } from 'src/amIAi/entities/User';
import { WaitingUser } from 'src/amIAi/entities/WaitingUser';

@Injectable()
export class UserRepository {
  constructor(readonly em: EntityManager) {}

  async checkDuplicateUser(authenticationId: string): Promise<boolean> {
    const forkedEm = this.em.fork();
    const user = await forkedEm.findOne(User, {
      authentication_id: authenticationId,
    });

    return !!user;
  }

  async createUser({
    authenticationId,
    language,
    name,
    iconUrl,
    email,
  }): Promise<User> {
    const forkedEm = this.em.fork();

    const dup = await this.checkDuplicateUser(authenticationId);

    if (dup) throw new Error('User already exists');

    const user = new User();
    user.authentication_id = authenticationId;
    user.language = language;
    user.name = name;
    user.iconUrl = iconUrl;
    user.email = email;

    await forkedEm.persistAndFlush(user);

    return user;
  }

  //ユーザーをuserIdで検索
  async findUserById(userId: string) {
    const forkedEm = this.em.fork();
    const user: User = await forkedEm.findOne(User, {
      id: userId,
    });

    return user;
  }

  // ユーザーをauthenticationIdで検索
  async findByAuthenticationId(authenticationId: string): Promise<User> {
    const forkedEm = this.em.fork();
    const user: User = await forkedEm.findOne(User, {
      authentication_id: authenticationId,
    });

    return user;
  }

  // ユーザーのonlineDetectedAtを更新
  async updateOnlineDetectedAt(userId: string): Promise<string> {
    const forkedEm = this.em.fork();

    const user = await forkedEm.findOne(User, {
      id: userId,
    });
    user.onlineDetectedAt = new Date();

    await forkedEm.persistAndFlush(user);

    return user.id;
  }

  async onlineCheck(userId: string): Promise<{
    onlineUsersCount: number;
    waitingUsersCount: number;
    activeGameCount: number;
  }> {
    const forkedEm = this.em.fork();

    await this.updateOnlineDetectedAt(userId);

    const onlineUsersCount = await forkedEm.count(User, {
      onlineDetectedAt: {
        $gte: new Date(Date.now() - 5000),
      },
    });

    // 5秒以内にonlineDetectedAtが更新されたユーザーをカウント
    const waitingUsersCount = await forkedEm.count(WaitingUser, {
      onlineDetectedAt: {
        $gte: new Date(Date.now() - 5000),
      },
    });

    const activeGameCount = await forkedEm.count(Game, {
      gameUsers: {
        $some: {
          onlineDetectedAt: {
            $gte: new Date(Date.now() - 5000),
          },
        },
      },
      status: 1,
    });

    return {
      onlineUsersCount,
      waitingUsersCount,
      activeGameCount,
    };
  }
}
