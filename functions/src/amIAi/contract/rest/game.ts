/**
 * ###IMPORTANT###
 * this files import path should be relative to the contract file
 */
import { MAX_ANSWER_STRING } from './../constants';
import { initContract } from '@ts-rest/core';
import { z } from 'zod';
const c = initContract();

export const GAME_CONTRACT = c.router({
  startGame: {
    method: 'POST',
    path: '/game/start',
    responses: {
      201: z.string(),
    },
    body: null,
  },

  findQuestions: {
    method: 'GET',
    path: '/game/:gameId/questions',
    pathParams: z.object({
      gameId: z.string().uuid(),
    }),
    responses: {
      200: c.type<{ questions: { question: string; options: string[] }[] }>(),
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
      200: c.type<{ id: string }>(),
    },
  },
});
