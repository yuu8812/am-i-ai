import { GenerativeAiClient } from 'src/amIAi/generativeAi/generativeAiClient';
import { EntityManager, raw } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import {
  GAME_RATE_TYPE,
  IS_VOTED,
  LANGUAGE,
  WHICH_USER,
} from 'src/amIAi/constants/game';
import { Personality } from 'src/amIAi/constants/personality';
import { AiUser } from 'src/amIAi/entities/AiUser';
import { Game } from 'src/amIAi/entities/Game';
import { GameAnswer } from 'src/amIAi/entities/GameAnswer';
import { GameQuestion } from 'src/amIAi/entities/GameQuestion';
import { GameRate } from 'src/amIAi/entities/GameRate';
import { GameUser } from 'src/amIAi/entities/GameUser';
import { Question } from 'src/amIAi/entities/Question';
import { User } from 'src/amIAi/entities/User';
import { Vote } from 'src/amIAi/entities/Vote';
import { WaitingUser } from 'src/amIAi/entities/WaitingUser';
@Injectable()
export class GameRepository {
  constructor(
    protected readonly em: EntityManager,
    private readonly generativeAiClient: GenerativeAiClient,
  ) {}

  /**
   * ユーザがゲームを開始した時にそのユーザをwaitingUserテーブルに登録する関数
   * 5秒以内にそのユーザがgameUserに登録している場合にエラーを返す
   * 5秒以内にそのユーザがwaitingUserに登録している場合にエラーを返す
   * @param userId
   * @param language 0: 日本語, 1: 英語
   * @returns void
   *
   * @throws HttpException(409, 'User is already waiting')
   */
  async startGame(userId: string, language: 'ja' | 'en') {
    const forkedEm = this.em.fork();

    const alreadyJoinedUser = await forkedEm.findOne(GameUser, {
      user: userId,
      onlineDetectedAt: {
        $gte: new Date(Date.now() - 5000),
      },
    });

    if (alreadyJoinedUser)
      throw new HttpException('User is already joined', HttpStatus.CONFLICT);

    const alreadyWaitingUser = await forkedEm.findOne(WaitingUser, {
      user: userId,
      createdAt: {
        $gte: new Date(Date.now() - 5000),
      },
    });

    if (alreadyWaitingUser)
      throw new HttpException('User is already waiting', HttpStatus.CONFLICT);

    const waitingUser = forkedEm.create(WaitingUser, {
      user: userId,
      language: language === 'ja' ? LANGUAGE.JP : LANGUAGE.EN,
    });

    await forkedEm.persistAndFlush(waitingUser);

    return {
      waitingUser: {
        id: waitingUser.id,
        userId: waitingUser.id,
      },
    };
  }

  /**
   * ゲームに登録しているユーザを返却する関数
   * 5秒以内にそのユーザがwaitingUserに登録している場合にエラーを返す
   * @param userId
   * @returns gameUsers: { userId: string; userName: string; online: boolean }[];
   *
   */
  async getGameUsers(
    gameId: string,
    userId: string,
  ): Promise<{
    gameId: string;
    gameUserId: string;
    gameUsers: {
      userId: string;
      userName: string;
      online: boolean;
      iconUrl: string;
    }[];
  }> {
    const forkedEm = this.em.fork();

    if (!gameId)
      throw new HttpException('GameId is not provided', HttpStatus.BAD_REQUEST);

    const gameUsers = await forkedEm.find(
      GameUser,
      {
        game: gameId,
        whichUser: WHICH_USER.HUMAN,
      },
      {
        populate: ['user'],
        orderBy: { createdAt: 'DESC' },
      },
    );

    // 5秒以内にonlineDetectedAtを更新している場合にtrueを返す
    const isOnline = (onlineDetectedAt: Date) => {
      return onlineDetectedAt >= new Date(Date.now() - 5000);
    };

    return {
      gameId: gameId,
      gameUserId: gameUsers.find((gameUser) => gameUser.user.id === userId).id,
      gameUsers: gameUsers.map((gameUser) => ({
        userId: gameUser.user.id,
        userName: gameUser.user.name,
        iconUrl: gameUser.user.iconUrl,
        online: isOnline(gameUser.onlineDetectedAt),
      })),
    };
  }

  async createAiGameUsers({
    gameId,
    aiCount,
  }: {
    gameId: string;
    aiCount: number;
  }) {
    const forkedEm = this.em.fork();

    const aiUsers = await forkedEm.find(AiUser, {});

    const randomAiUsers = aiUsers
      .sort(() => Math.random() - 0.5)
      .slice(0, aiCount);

    randomAiUsers.map((aiUser) => {
      return forkedEm.create(GameUser, {
        game: gameId,
        aiUser: aiUser.id,
        whichUser: WHICH_USER.AI,
      });
    });

    await forkedEm.flush();

    const aiGameUsersNew = await forkedEm.find(
      GameUser,
      {
        game: gameId,
        whichUser: WHICH_USER.AI,
      },
      {
        populate: ['aiUser'],
      },
    );

    const gameQuestions = await forkedEm.find(
      GameQuestion,
      {
        game: gameId,
      },
      {
        populate: ['questions'],
      },
    );

    const generateGameQuestionAnswers = async (
      personality: Personality,
      question: string,
    ) => {
      return await this.generativeAiClient.sendMessage<{ answer: string }>(
        `
あなたの人格は ${JSON.stringify(personality)} です。

この人格に基づいて次の質問に回答してください。
${question}
レスポンスは以下の形式でお願いします。
{
  answer: string
}
`,
      );
    };

    aiGameUsersNew.map(async (aiGameUser) => {
      return gameQuestions.map(async (gameQuestion) => {
        const { answer } = await generateGameQuestionAnswers(
          aiGameUser.aiUser.config,
          gameQuestion.questions.question,
        );
        forkedEm.create(GameAnswer, {
          gameUser: aiGameUser.id,
          question: gameQuestion.id,
          answer,
        });
        await forkedEm.flush();
      });
    });
  }

  /**
   * ユーザのマッチングロジックを実行する関数
   *
   * 1. 自分がgameUserのonlineDetectedAtを5秒以内に更新している場合に5へ
   * 2. 自分がwaitingUserのonlineDetectedAtを5秒以内に更新していない場合にエラーを返す
   * 3. アクティブなマッチング待ちのゲームを探す
   *   見つかった場合 : gameに参加する
   *   見つからなかった場合 : ゲームを作成してgameUserに登録する
   * 4.すべてのユーザの情報を返す
   *
   * @param userId
   * @param language 0: 日本語, 1: 英語
   * @returns マッチングしたユーザの情報
   *
   * @throws HttpException(400, 'User is not waiting')
   *
   */
  async matching({
    humanCount,
    userId,
    waitingUserId,
  }: {
    userId: string;
    humanCount: number;
    waitingUserId: string;
  }) {
    const forkedEm = this.em.fork();

    const gameUser = await forkedEm.findOne(
      GameUser,
      {
        user: {
          id: userId,
        },
        // 5秒以内にonlineDetectedAtを更新している場合
        onlineDetectedAt: {
          $gte: new Date(Date.now() - 5000),
        },
      },
      {
        orderBy: { createdAt: 'DESC' },
        populate: ['game'],
      },
    );

    const waitingUser = await forkedEm.findOne(
      WaitingUser,
      { id: waitingUserId },
      {
        orderBy: { createdAt: 'DESC' },
      },
    );

    if (waitingUser.user.id !== userId)
      throw new HttpException('User is not waiting', HttpStatus.BAD_REQUEST);

    // // 5秒以内にonlineDetectedAtを更新している場合にすぐにかえす
    if (gameUser) {
      gameUser.onlineDetectedAt = new Date();
      waitingUser.onlineDetectedAt = new Date();

      await forkedEm.persistAndFlush([gameUser, waitingUser]);

      return await this.getGameUsers(gameUser.game.id, userId);
    }

    if (!waitingUser)
      throw new HttpException('User is not waiting1', HttpStatus.BAD_REQUEST);

    waitingUser.onlineDetectedAt = new Date();
    await forkedEm.persistAndFlush(waitingUser);

    const activeCurrentlyWaitingGame = await forkedEm
      .createQueryBuilder(Game, 'g')
      .leftJoin('g.gameUsers', 'gu')
      .groupBy('g.id') // g.id を GROUP BY 句に追加
      .having('COUNT(gu.id) = 1') // gameUsers の数が1のゲームを取得
      .andWhere({
        $and: [
          { language: waitingUser.language },
          {
            gameUsers: {
              onlineDetectedAt: { $gte: new Date(Date.now() - 5000) },
            },
          },
        ],
      })
      .orderBy({ 'g.createdAt': 'ASC' }) // 最も古いものを取得するために昇順でソート
      .getSingleResult();

    let gameId = activeCurrentlyWaitingGame?.id;

    if (!!gameId) {
      const gu = await forkedEm.findOne(GameUser, {
        user: {
          id: userId,
        },
        game: {
          id: gameId,
          language: waitingUser.language,
        },
      });
      if (!gu) {
        const gameUser = forkedEm.create(GameUser, {
          user: {
            id: userId,
          },
          game: gameId,
        });

        await forkedEm.persistAndFlush(gameUser);

        const gameUsersCount = await forkedEm.count(GameUser, {
          game: gameId,
        });

        const game = await forkedEm.findOne(Game, {
          id: gameId,
        });

        if (gameUsersCount === humanCount) {
          await this.createGameQuestion(gameId, 5);
          await this.createAiGameUsers({ gameId, aiCount: 2 });
          game.status = 1;
          await forkedEm.persistAndFlush(game);
        }
      }
    } else {
      const user = await forkedEm.findOne(User, {
        id: userId,
      });

      const game = forkedEm.create(Game, {
        language: waitingUser.language,
        humanCount,
        aiCount: humanCount,
      });

      const gameUser = forkedEm.create(GameUser, {
        user,
        game,
        whichUser: WHICH_USER.HUMAN,
      });

      await forkedEm.persistAndFlush([game, gameUser]);
      gameId = game.id;
    }

    return await this.getGameUsers(gameId, userId);
  }

  /**
   * ゲーム中にuserのonlineを確認する関数
   */
  async healthCheck({
    gameUserId,
    userId,
  }: {
    userId: string;
    gameUserId: string;
  }): Promise<{
    gameId: string;
    gameUsers: { id: string; name: string; online: boolean }[];
  }> {
    const forkedEm = this.em.fork();

    await this.ownerCheck({ gameUserId, userId });

    const userJoinedGame = await forkedEm.findOne(Game, {
      gameUsers: {
        id: gameUserId,
      },
    });

    if (!userJoinedGame)
      throw new HttpException(
        'User is not joined game haha',
        HttpStatus.BAD_REQUEST,
      );

    // onlineDetectedAtの更新
    const gameUser = await forkedEm.findOne(
      GameUser,
      {
        id: gameUserId,
      },
      {
        orderBy: { createdAt: 'DESC' },
      },
    );

    if (!gameUser)
      throw new HttpException(
        'User is not joined game',
        HttpStatus.BAD_REQUEST,
      );

    gameUser.onlineDetectedAt = new Date();

    await forkedEm.persistAndFlush(gameUser);

    const game = await forkedEm.findOne(
      Game,
      {
        id: userJoinedGame.id,
      },
      {
        populate: ['gameUsers', 'gameUsers.user'],
      },
    );

    return {
      gameId: game.id,
      gameUsers: game.gameUsers
        .getItems()
        .filter((gameUser) => !!gameUser.user)
        .map((gameUser) => ({
          id: gameUser.user.id,
          name: gameUser.user.name,
          online: gameUser.onlineDetectedAt >= new Date(Date.now() - 5000),
        })),
    };
  }

  /**
   * 進行中のゲームの情報を取得して返却する関数
   *
   * 1. onlineDetectedAtが5秒以内なgameUserを最低一つ持つゲームに参加している
   * 2. gameUserのonlineDetectedAt更新
   * 3. ゲーム情報を返却
   *   shouldAnswerAtを過ぎていない場合にそれに紐づくanswerは表示しない
   *   shouldVoteAtを過ぎていない場合にそれに紐づくvoteは表示しない
   *
   * @param userId
   *
   * @throws HttpException(400, 'User is not joined game')
   */
  async progress(gameUserId: string): Promise<{
    gameId: string;
    questions: {
      id: string;
      phase: number;
      question: string;
      shouldAnswerAt: Date;
      answers: {
        id: string;
        user: {
          id: string;
        };
      }[];
    }[];
  }> {
    const forkedEm = this.em.fork();

    const userJoinedGame = await forkedEm.findOne(Game, {
      gameUsers: {
        id: gameUserId,
      },
    });

    if (!userJoinedGame)
      throw new HttpException(
        'User is not joined game',
        HttpStatus.BAD_REQUEST,
      );

    // onlineDetectedAtの更新
    const gameUser = await forkedEm.findOne(
      GameUser,
      {
        id: gameUserId,
      },
      {
        orderBy: { createdAt: 'DESC' },
      },
    );

    if (!gameUser)
      throw new HttpException(
        'User is not joined game',
        HttpStatus.BAD_REQUEST,
      );

    const game = await forkedEm.findOne(
      Game,
      {
        id: userJoinedGame.id,
      },
      {
        populate: [
          'gameUsers',
          'gameUsers.user',
          'gameQuestions',
          'gameQuestions.questions',
          'gameQuestions.gameAnswers',
          'gameQuestions.gameAnswers.answer',
        ],
      },
    );

    return {
      gameId: game.id,
      questions: game.gameQuestions
        .getItems()
        .map((gameQuestion) => ({
          id: gameQuestion.id,
          phase: gameQuestion.phase,
          question: gameQuestion.questions.question,
          shouldAnswerAt: gameQuestion.shouldAnswerAt,
          answers: gameQuestion.gameAnswers.getItems().map((gameAnswer) => ({
            id: gameAnswer.id,
            user: {
              id: gameAnswer.gameUser?.user?.id,
            },
            answered: gameAnswer.gameUser.id === gameUserId,
          })),
        }))
        .sort((a, b) => a.phase - b.phase),
    };
  }

  /**
   * questionに回答する関数
   *
   * 1. ユーザがゲームに参加しているか確認
   * 2. 質問が存在するか確認
   * 3. gameQuestionのshouldAnswerAtを過ぎてるか確認
   * 4. 回答を登録
   *
   * @param userId
   * @param questionId
   * @param answer
   *
   * @throws HttpException(400, 'User is not joined game')
   * @throws HttpException(400, 'Question is not found')
   * @throws HttpException(400, 'Question is already answered')
   * @throws HttpException(400, 'Question is not answerable')
   *
   */
  async answerQuestion({
    gameUserId,
    questionId,
    answer,
    userId,
  }: {
    gameUserId: string;
    questionId: string;
    answer: string;
    userId: string;
  }): Promise<void> {
    const forkedEm = this.em.fork();

    await this.ownerCheck({ gameUserId, userId });

    const userJoinedGame = await forkedEm.findOne(Game, {
      gameUsers: {
        id: gameUserId,
      },
    });

    if (!userJoinedGame)
      throw new HttpException(
        'User is not joined game',
        HttpStatus.BAD_REQUEST,
      );

    const gameQuestion = await forkedEm.findOne(
      GameQuestion,
      {
        id: questionId,
      },
      {
        populate: ['gameAnswers', 'gameAnswers.gameUser'],
      },
    );

    if (!gameQuestion)
      throw new HttpException('Question is not found', HttpStatus.BAD_REQUEST);

    if (
      gameQuestion.gameAnswers
        .getItems()
        .filter((item) => item.gameUser.id === gameUserId).length > 0
    )
      throw new HttpException(
        'Question is already answered',
        HttpStatus.BAD_REQUEST,
      );

    if (new Date(gameQuestion.shouldAnswerAt) < new Date())
      throw new HttpException(
        'Question is not answerable',
        HttpStatus.BAD_REQUEST,
      );

    forkedEm.create(GameAnswer, {
      gameUser: gameUserId,
      question: questionId,
      answer: answer ?? '',
    });

    await forkedEm.flush();
  }

  /**
   *
   */
  async createGameQuestion(gameId: string, questionCount: number) {
    const forkedEm = this.em.fork();

    const randomQuestions = await forkedEm
      .createQueryBuilder(Question, 'q')
      .orderBy({ [raw('RANDOM()')]: 'ASC' })
      .limit(questionCount)
      .getResultList();

    randomQuestions.map((question, i) => {
      return forkedEm.create(GameQuestion, {
        game: gameId,
        questions: question,
        phase: i,
        // i * 20秒以内に回答する
        // indexが0の場合に25秒以内
        shouldAnswerAt: new Date(
          Date.now() + (i + 1) * (i === 0 ? 23000 : 20000),
        ),
      });
    });

    const game = await forkedEm.findOne(Game, { id: gameId });

    // 最後の質問の回答時間+20秒を設定
    game.shouldAnswerAt = new Date(
      Date.now() + (questionCount + 2) * 20000 + 3000,
    );

    await forkedEm.flush();
  }

  async getAnswers({
    userId,
    gameUserId,
  }: {
    userId: string;
    gameUserId: string;
  }) {
    const forkedEm = this.em.fork();

    await this.ownerCheck({ gameUserId, userId });

    const game = await forkedEm.findOne(
      Game,
      {
        gameUsers: {
          id: gameUserId,
        },
      },
      {
        populate: [
          'gameUsers',
          'gameQuestions',
          'gameQuestions.questions',
          'gameQuestions.gameAnswers',
          'gameQuestions.gameAnswers.answer',
          'gameQuestions.gameAnswers.gameUser.user',
        ],
      },
    );

    if (!game)
      throw new HttpException('Game is not found', HttpStatus.BAD_REQUEST);

    const gameUsers = game.gameUsers
      .map((gameUser) => gameUser.id)
      // ランダムに並び替え後にgameUserIdに一致するものを先頭に持ってくる
      .sort(() => {
        return Math.random() - 0.5;
      })
      .sort((a) => {
        return a === gameUserId ? -1 : 1;
      });

    const builded = {
      gameId: game.id,
      shouldAnswerAt: game.shouldAnswerAt,
      gameQuestions: game.gameQuestions
        .getItems()
        .sort((a, b) => (a.phase > b.phase ? 1 : -1))
        .map((gameQuestion) => ({
          id: gameQuestion.id,
          question: {
            id: gameQuestion.questions.id,
            question: gameQuestion.questions.question,
          },
          answers: gameUsers.map((gameUserId) => {
            return {
              gameUserId: gameUserId,
              answer: gameQuestion.gameAnswers
                .getItems()
                .find((gameAnswer) => gameAnswer.gameUser.id === gameUserId)
                ?.answer?.toString(),
              id: '',
            };
          }),
        })),
    };

    return builded;
  }

  async isAnswered({
    gameUserId,
    questionId,
    userId,
  }: {
    gameUserId: string;
    questionId: string;
    userId: string;
  }) {
    const forkedEm = this.em.fork();

    await this.ownerCheck({ gameUserId, userId });

    const gameAnswer = await forkedEm.findOne(GameAnswer, {
      gameUser: {
        id: gameUserId,
      },
      question: {
        id: questionId,
      },
    });

    return !!gameAnswer;
  }

  async isVoted(gameUserId: string) {
    const forkedEm = this.em.fork();

    const gameAnswer = await forkedEm.findOne(Vote, {
      voteBy: {
        id: gameUserId,
      },
    });

    return !!gameAnswer;
  }

  async vote({
    voteBy,
    voteTo,
    userId,
  }: {
    voteBy: string;
    voteTo: string;
    userId: string;
  }) {
    const forkedEm = this.em.fork();

    await this.ownerCheck({ gameUserId: voteBy, userId });

    const game = await forkedEm.findOne(Game, {
      gameUsers: {
        id: voteBy,
      },
    });

    if (new Date(game.shouldAnswerAt) < new Date())
      throw new HttpException('Too late to vote', HttpStatus.BAD_REQUEST);

    const alreadyVoted = await forkedEm.findOne(Vote, {
      voteBy: {
        id: voteBy,
      },
    });

    if (alreadyVoted)
      throw new HttpException('User is already voted', HttpStatus.BAD_REQUEST);

    const vote = forkedEm.create(Vote, {
      type: 0,
      voteBy,
      voteTo,
      game: game.id,
    });

    vote.voteBy.isVoted = 1;

    await forkedEm.persistAndFlush(vote);
  }

  async ownerCheck({
    gameUserId,
    userId,
  }: {
    gameUserId: string;
    userId: string;
  }) {
    const forkedEm = this.em.fork();

    const gameUser = await forkedEm.findOne(
      GameUser,
      {
        id: gameUserId,
      },
      {
        populate: ['user'],
      },
    );

    if (gameUser.user.id !== userId)
      throw new HttpException('User is not owner', HttpStatus.BAD_REQUEST);

    return null;
  }

  async result({ userId, gameUserId }: { userId: string; gameUserId: string }) {
    const forkedEm = this.em.fork();

    await this.ownerCheck({ gameUserId, userId });

    const game = await forkedEm.findOne(
      Game,
      {
        gameUsers: {
          id: gameUserId,
        },
      },
      {
        populate: ['gameUsers', 'gameUsers.user'],
      },
    );

    if (!game)
      throw new HttpException('Game is not found', HttpStatus.BAD_REQUEST);

    if (new Date(game.shouldAnswerAt) > new Date())
      throw new HttpException('Game is not finished', HttpStatus.BAD_REQUEST);

    const myVote = await forkedEm.findOne(
      Vote,
      {
        game: game.id,
        voteBy: {
          id: gameUserId,
          isVoted: IS_VOTED.VOTED,
        },
      },
      {
        populate: ['voteTo'],
      },
    );

    const opponentUser = game.gameUsers
      .getItems()
      .filter((gameUser) => gameUser.id !== gameUserId)
      .find((gameUser) => gameUser.whichUser === WHICH_USER.HUMAN);

    const opponentVote = await forkedEm.findOne(
      Vote,
      {
        game: game.id,
        voteBy: {
          id: opponentUser.id,
          isVoted: IS_VOTED.VOTED,
        },
      },
      {
        populate: ['voteTo'],
      },
    );

    const meSuccess = myVote?.voteTo?.whichUser === WHICH_USER.HUMAN;
    const meSuccessEmpty = !myVote?.voteTo;

    const opponentSuccess =
      opponentVote?.voteTo?.whichUser === WHICH_USER.HUMAN;
    const opponentSuccessEmpty = !opponentVote?.voteTo;

    const {
      myHumanNessRate,
      myHumanDetectionRate,
      opponentHumanNessRate,
      opponentHumanDetectionRate,
    } = await this.getGameRate({
      meUserId: userId,
      opponentUserId: opponentUser.user.id,
    });

    const isWatchedResult = game?.status === 2;

    if (!isWatchedResult) {
      const currentMyHumanDetectionRate = myHumanDetectionRate[0].rate;

      const currentOpponentHumanDetectionRate =
        opponentHumanDetectionRate[0].rate;

      const currentMyHumanNessRate = myHumanNessRate[0].rate;

      const currentOpponentHumanNessRate = opponentHumanNessRate[0].rate;

      console.log(meSuccess, opponentSuccess);
      console.log(meSuccessEmpty, opponentSuccessEmpty);
      if (meSuccess) {
        forkedEm.create(GameRate, {
          rate: currentOpponentHumanNessRate + 5,
          type: GAME_RATE_TYPE.HUMAN_NESS,
          user: opponentUser.user.id,
        });
        forkedEm.create(GameRate, {
          rate: currentMyHumanDetectionRate + 10,
          type: GAME_RATE_TYPE.HUMAN_DETECTION,
          user: userId,
        });
      } else {
        forkedEm.create(GameRate, {
          rate: currentMyHumanDetectionRate - 5,
          type: GAME_RATE_TYPE.HUMAN_DETECTION,
          user: userId,
        });

        forkedEm.create(GameRate, {
          rate: currentOpponentHumanNessRate - (!meSuccessEmpty ? 5 : 0),
          type: GAME_RATE_TYPE.HUMAN_NESS,
          user: opponentUser.user.id,
        });
      }
      if (opponentSuccess) {
        forkedEm.create(GameRate, {
          rate: currentMyHumanNessRate + 5,
          type: GAME_RATE_TYPE.HUMAN_NESS,
          user: userId,
        });
        forkedEm.create(GameRate, {
          rate: currentOpponentHumanDetectionRate + 10,
          type: GAME_RATE_TYPE.HUMAN_DETECTION,
          user: opponentUser.user.id,
        });
      } else {
        forkedEm.create(GameRate, {
          rate: currentOpponentHumanDetectionRate - 5,
          type: GAME_RATE_TYPE.HUMAN_DETECTION,
          user: opponentUser.user.id,
        });

        forkedEm.create(GameRate, {
          rate: currentMyHumanNessRate - (!opponentSuccessEmpty ? 5 : 0),
          type: GAME_RATE_TYPE.HUMAN_NESS,
          user: userId,
        });
      }

      game.status = 2;
      await forkedEm.flush();
    }

    const {
      myHumanNessRate: newMyHumanNessRate,
      myHumanDetectionRate: newMyHumanDetectionRate,
      opponentHumanNessRate: newOpponentHumanNessRate,
      opponentHumanDetectionRate: newOpponentHumanDetectionRate,
    } = await this.getGameRate({
      meUserId: userId,
      opponentUserId: opponentUser.user.id,
    });

    return {
      gameId: game.id,
      result: {
        me: {
          status: meSuccess ? 'success' : meSuccessEmpty ? 'empty' : 'fail',
          humanDetect: {
            prevRate: newMyHumanDetectionRate[1]?.rate,
            currentRate: newMyHumanDetectionRate[0]?.rate,
          },
          humanNess: {
            prevRate: newMyHumanNessRate[1]?.rate,
            currentRate: newMyHumanNessRate[0]?.rate,
          },
        },
        opponent: {
          status: opponentSuccess
            ? 'success'
            : opponentSuccessEmpty
            ? 'empty'
            : 'fail',
          humanDetect: {
            prevRate: newOpponentHumanDetectionRate[1]?.rate,
            currentRate: newOpponentHumanDetectionRate[0]?.rate,
          },
          humanNess: {
            prevRate: newOpponentHumanNessRate[1]?.rate,
            currentRate: newOpponentHumanNessRate[0]?.rate,
          },
        },
      },
    } as const;
  }

  async getGameRate({
    meUserId,
    opponentUserId,
  }: {
    meUserId: string;
    opponentUserId: string;
  }) {
    const forkedEm = this.em.fork();

    const myHumanDetectionRate = await forkedEm.find(
      GameRate,
      {
        user: {
          id: meUserId,
        },
        type: GAME_RATE_TYPE.HUMAN_DETECTION,
      },
      {
        orderBy: { createdAt: 'DESC' },
        limit: 2,
      },
    );

    const myHumanNessRate = await forkedEm.find(
      GameRate,
      {
        user: {
          id: meUserId,
        },
        type: GAME_RATE_TYPE.HUMAN_NESS,
      },
      {
        orderBy: { createdAt: 'DESC' },
        limit: 2,
      },
    );

    const opponentHumanDetectionRate = await forkedEm.find(
      GameRate,
      {
        user: {
          id: opponentUserId,
        },
        type: GAME_RATE_TYPE.HUMAN_DETECTION,
      },
      {
        orderBy: { createdAt: 'DESC' },
        limit: 2,
      },
    );

    const opponentHumanNessRate = await forkedEm.find(
      GameRate,
      {
        user: {
          id: opponentUserId,
        },
        type: GAME_RATE_TYPE.HUMAN_NESS,
      },
      {
        orderBy: { createdAt: 'DESC' },
        limit: 2,
      },
    );

    return {
      myHumanDetectionRate,
      myHumanNessRate,
      opponentHumanDetectionRate,
      opponentHumanNessRate,
    };
  }
}
