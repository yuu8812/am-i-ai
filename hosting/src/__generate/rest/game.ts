/**
 * ###IMPORTANT###
 * this files import path should be relative to the contract file
 */
import { MAX_ANSWER_STRING } from './constants';
import { initContract } from '@ts-rest/core';
import { SHORT_UUID_SCHEMA } from './validation/index';
import { z } from 'zod';
const c = initContract();

export const GAME_CONTRACT = c.router({
  /**
   *  gameを開始するエンドポイント
   * */
  startGame: {
    method: 'POST',
    path: '/game/startGame',
    responses: {
      201: c.type<{
        waitingUser: {
          id: string;
          userId: string;
        };
      }>(),
    },
    body: null,
  },

  /**
   *  マッチング中にアクセスするエンドポイント
   * */
  matching: {
    method: 'GET',
    path: '/game/matching/:waitingUserId',
    pathParams: z.object({
      waitingUserId: SHORT_UUID_SCHEMA,
    }),
    responses: {
      200: c.type<{
        gameId: string;
        gameUserId: string;
        gameUsers: { userId: string; userName: string; iconUrl: string }[];
      }>(),
    },
  },

  /**
   *  game中にgameDataを取得するエンドポイント
   * */
  progress: {
    method: 'GET',
    path: '/game/progress/:gameUserId',
    pathParams: z.object({
      gameUserId: SHORT_UUID_SCHEMA,
    }),
    responses: {
      200: c.type<{
        gameId: string;
        questions: {
          id: string;
          phase: number;
          question: string;
          shouldAnswerAt: Date;
        }[];
      }>(),
    },
  },

  /**
   * game中にuserのonlineを確認するエンドポイント
   */
  healthCheck: {
    method: 'GET',
    path: '/game/health/:gameUserId',
    pathParams: z.object({
      gameUserId: SHORT_UUID_SCHEMA,
    }),
    responses: {
      200: c.type<{
        gameId: string;
        gameUsers: { id: string; name: string; online: boolean }[];
      }>(),
    },
  },

  /**
   *  questionに対して回答するエンドポイント
   * */
  answerQuestion: {
    method: 'POST',
    path: '/game/answer/:gameUserId',
    pathParams: z.object({
      gameUserId: SHORT_UUID_SCHEMA,
    }),
    body: z.object({
      questionId: SHORT_UUID_SCHEMA,
      answer: MAX_ANSWER_STRING,
    }),
    responses: {
      201: null,
    },
  },

  /**
   *  questionに対して回答するエンドポイント
   * */
  vote: {
    method: 'POST',
    path: '/game/vote/:answerId',
    pathParams: z.object({
      answerId: SHORT_UUID_SCHEMA,
    }),
    body: null,
    responses: {
      201: null,
    },
  },

  /**
   * game中に回答を取得するエンドポイント
   */
  getAnswers: {
    method: 'GET',
    path: '/game/answers/:gameUserId',
    pathParams: z.object({
      gameUserId: SHORT_UUID_SCHEMA,
    }),
    responses: {
      200: c.type<{
        gameId: string;
        shouldAnswerAt: Date;
        gameQuestions: {
          id: string;
          question: {
            id: string;
            question: string;
          };
          answers: {
            id: string;
            answer: string;
            gameUserId: string;
            user: {
              id: string;
            };
          }[];
        }[];
      }>(),
    },
  },

  /**
   * 現在の質問に答えたかを取得するエンドポイント
   */
  isAnswered: {
    method: 'GET',
    path: '/game/isAnswered/:gameUserId',
    pathParams: z.object({
      gameUserId: SHORT_UUID_SCHEMA,
    }),
    query: z.object({
      questionId: SHORT_UUID_SCHEMA,
    }),
    responses: {
      200: c.type<{
        isAnswered: boolean;
      }>(),
    },
  },

  /**
   * 投票をしたか確認するエンドポイント
   */
  isVoted: {
    method: 'GET',
    path: '/game/isVoted/:gameUserId',
    pathParams: z.object({
      gameUserId: SHORT_UUID_SCHEMA,
    }),
    responses: {
      200: c.type<{
        isVoted: boolean;
      }>(),
    },
  },
});
