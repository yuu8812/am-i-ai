import { EntityManager, raw } from '@mikro-orm/postgresql';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { Game } from 'src/amIAi/entities/Game';
import { GameAnswer } from 'src/amIAi/entities/GameAnswer';
import { GameQuestion } from 'src/amIAi/entities/GameQuestion';
import { GameUser } from 'src/amIAi/entities/GameUser';
import { Question } from 'src/amIAi/entities/Question';
import { User } from 'src/amIAi/entities/User';
import { Vote } from 'src/amIAi/entities/Vote';
import { WaitingUser } from 'src/amIAi/entities/WaitingUser';
@Injectable()
export class GameRepository {
  constructor(protected readonly em: EntityManager) {}

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
  async startGame(userId: string, language: 0 | 1) {
    Logger.log(
      'ユーザがゲームを開始した時にそのユーザをwaitingUserテーブルに登録する関数',
      'startGame',
    );
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
      language,
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
   * @param language 0: 日本語, 1: 英語
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
    Logger.log('ゲームに登録しているユーザを返却する関数', 'getGameUsers');
    const forkedEm = this.em.fork();
    Logger.log('gameId', gameId);

    if (!gameId)
      throw new HttpException('GameId is not provided', HttpStatus.BAD_REQUEST);

    const gameUsers = await forkedEm.find(
      GameUser,
      {
        game: gameId,
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
    language,
    userId,
    waitingUserId,
  }: {
    userId: string;
    language: 0 | 1;
    humanCount: number;
    waitingUserId: string;
  }) {
    Logger.log('ユーザのマッチングロジックを実行する関数', 'matching');
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
          { language },
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

    Logger.log(JSON.stringify(activeCurrentlyWaitingGame), 'here');

    if (!!gameId) {
      Logger.log('ゲームユーザを紐づける関数');
      const gu = await forkedEm.findOne(GameUser, {
        user: {
          id: userId,
        },
        game: {
          id: gameId,
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
          game.status = 1;
        }
      }
    } else {
      Logger.log('ゲームを作成してゲームユーザを紐づける関数');

      const user = await forkedEm.findOne(User, {
        id: userId,
      });

      const game = forkedEm.create(Game, {
        language,
        humanCount,
        aiCount: humanCount,
      });

      const gameUser = forkedEm.create(GameUser, {
        user,
        game,
      });

      await forkedEm.persistAndFlush([game, gameUser]);
      gameId = game.id;
    }

    return await this.getGameUsers(gameId, userId);
  }

  /**
   * ゲーム中にuserのonlineを確認する関数
   */
  async healthCheck(gameUserId: string): Promise<{
    gameId: string;
    gameUsers: { id: string; name: string; online: boolean }[];
  }> {
    Logger.log('healthCheck', 'healthCheck');
    const forkedEm = this.em.fork();

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
      gameUsers: game.gameUsers.getItems().map((gameUser) => ({
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
    Logger.log('進行中のゲームの情報を取得して返却する関数', 'progress');
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
              id: gameAnswer.gameUser.user.id,
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
  }: {
    gameUserId: string;
    questionId: string;
    answer: string;
  }): Promise<void> {
    Logger.log('questionに回答する関数', 'answerQuestion');
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

    if (gameQuestion.shouldAnswerAt < new Date())
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

    Logger.log('userId', userId);
    Logger.log('gameUserId', gameUserId);

    const game = await forkedEm.findOne(
      Game,
      {
        gameUsers: {
          id: gameUserId,
        },
      },
      {
        populate: [
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

    const builded = {
      gameId: game.id,
      shouldAnswerAt: game.shouldAnswerAt,
      gameQuestions: game.gameQuestions.getItems().map((gameQuestion) => ({
        id: gameQuestion.id,
        question: {
          id: gameQuestion.questions.id,
          question: gameQuestion.questions.question,
        },
        answers: gameQuestion.gameAnswers.getItems().map((gameAnswer) => ({
          id: gameAnswer.id,
          answer: gameAnswer.answer,
          gameUserId: gameAnswer.gameUser.id,
          user: {
            id: gameAnswer.gameUser.user.id,
          },
        })),
      })),
    };

    return builded;
  }

  async isAnswered({
    gameUserId,
    questionId,
  }: {
    gameUserId: string;
    questionId: string;
  }) {
    const forkedEm = this.em.fork();

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
}
