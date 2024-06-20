import { initContract } from '@ts-rest/core';
import { MAX_ANSWER_STRING } from 'src/amIAi/contract/constants';
import { z } from 'zod';
const c = initContract();

export const GAME_CONTRACT = c.router({
  startGame: {
    method: 'POST',
    path: '/game/start',
    responses: {
      201: z.string(),
    },
    body: undefined,
  },

  findQuestions: {
    method: 'GET',
    path: '/game/:gameId/questions',
    pathParams: z.object({
      gameId: z.string().uuid(),
    }),
    responses: {
      200: z.object({
        question: z.string(),
        options: z.array(z.string()),
      }),
    },
  },

  answerQuestion: {
    method: 'POST',
    path: '/game/:gameId/answer/:questionId',
    pathParams: z.object({
      gameId: z.string().uuid(),
      questionId: z.string().uuid(),
    }),
    responses: {
      201: z.string(),
    },
    body: z.object({
      answer: MAX_ANSWER_STRING,
    }),
  },

  findGameData: {
    method: 'GET',
    path: '/game/:gameId',
    pathParams: z.object({
      gameId: z.string().uuid(),
    }),
    responses: {
      200: z.object({
        users: z.array(
          z.object({
            id: z.string(),
            name: z.string(),
          }),
        ),
        gameData: z.object({
          id: z.string(),
          name: z.string(),
        }),
      }),
    },
  },
});
