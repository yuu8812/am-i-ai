import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable, Logger } from '@nestjs/common';
import { GAME_RATE_TYPE } from 'src/amIAi/constants/game';
import { Game } from 'src/amIAi/entities/Game';
import { GameRate } from 'src/amIAi/entities/GameRate';
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

    const gameRate1 = new GameRate();
    gameRate1.type = GAME_RATE_TYPE.HUMAN_DETECTION;
    gameRate1.rate = 100;
    gameRate1.user = user;

    const gameRate2 = new GameRate();
    gameRate2.type = GAME_RATE_TYPE.AI_NESS;
    gameRate2.rate = 100;
    gameRate2.user = user;

    await forkedEm.persistAndFlush([user, gameRate1, gameRate2]);

    return user;
  }

  //ユーザーをuserIdで検索
  async findUserById(userId: string) {
    const forkedEm = this.em.fork();
    const user: User = await forkedEm.findOne(User, {
      id: userId,
    });

    const humanDetectionRates = await forkedEm.find(
      GameRate,
      {
        user: user,
        type: GAME_RATE_TYPE.HUMAN_DETECTION,
      },
      {
        orderBy: { createdAt: 'desc' },
        limit: 20,
      },
    );

    const aiNessRate = await forkedEm.find(
      GameRate,
      {
        user: user,
        type: GAME_RATE_TYPE.AI_NESS,
      },
      {
        orderBy: { createdAt: 'desc' },
        limit: 20,
      },
    );

    const query = (userId: string) => `
    WITH LatestRates AS (
      SELECT
        gr.user_id,
        gr.type,
        gr.rate,
        gr.created_at,
        ROW_NUMBER() OVER (PARTITION BY gr.user_id, gr.type ORDER BY gr.created_at DESC) AS rank
      FROM game_rate AS gr
    ),
    RankedRates AS (
      SELECT
        user_id,
        type,
        rate,
        created_at,
        ROW_NUMBER() OVER (PARTITION BY type ORDER BY rate DESC) AS overall_rank
      FROM LatestRates
      WHERE rank = 1
    )
    SELECT overall_rank, type
    FROM RankedRates
    WHERE user_id = '${userId}';
    `;

    const results: { overall_rank: string; type: number }[] = await forkedEm
      .getConnection()
      .execute(query(user.id));

    const aiNessRank = results.find(
      (result) => result.type === GAME_RATE_TYPE.AI_NESS,
    );
    const humanDetectionRank = results.find(
      (result) => result.type === GAME_RATE_TYPE.HUMAN_DETECTION,
    );

    return {
      id: user.id,
      name: user.name,
      iconUrl: user.iconUrl,
      rates: {
        humanDetection: humanDetectionRates.map((rate) => ({
          rate: rate.rate,
          createdAt: rate.createdAt,
        })),
        humanDetectionRank: Number(humanDetectionRank?.overall_rank),
        aiNess: aiNessRate.map((rate) => ({
          rate: rate.rate,
          createdAt: rate.createdAt,
        })),
        aiNessRank: Number(aiNessRank?.overall_rank),
      },
    };
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
